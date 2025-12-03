import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The main title of the document.",
    },
    overallSummary: {
      type: Type.STRING,
      description: "A brief executive summary of the entire document.",
    },
    chapters: {
      type: Type.ARRAY,
      description: "A list of chapters or major sections found in the document.",
      items: {
        type: Type.OBJECT,
        properties: {
          chapterNumber: {
            type: Type.STRING,
            description: "The chapter number or section identifier (e.g., 'Chapter 1', 'Section A').",
          },
          title: {
            type: Type.STRING,
            description: "The title of the chapter.",
          },
          summary: {
            type: Type.STRING,
            description: "A concise summary of the chapter's content.",
          },
          keyPoints: {
            type: Type.ARRAY,
            description: "3-5 bullet points extracting the most important information.",
            items: {
              type: Type.STRING,
            },
          },
        },
        required: ["chapterNumber", "title", "summary", "keyPoints"],
      },
    },
  },
  required: ["title", "overallSummary", "chapters"],
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzePdf = async (base64Data: string, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set your Gemini API Key in settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data,
            },
          },
          {
            text: "이 PDF 문서를 분석해줘. 전체 제목과 전체 요약을 작성하고, 각 장(Chapter) 또는 주요 섹션별로 구분하여 '장 번호', '제목', '요약', '핵심 포인트(3~5개)'를 추출해줘. 한국어로 작성해줘.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for more factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    throw error;
  }
};