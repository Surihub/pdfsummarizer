export interface ChapterSummary {
  chapterNumber: string;
  title: string;
  summary: string;
  keyPoints: string[];
}

export interface AnalysisResult {
  title: string;
  overallSummary: string;
  chapters: ChapterSummary[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}