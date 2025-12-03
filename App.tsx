import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ResultTable } from './components/ResultTable';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { analyzePdf, fileToBase64 } from './services/geminiService';
import { AnalysisResult, AppState } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // API Key Management - strictly separate, no embedded env key
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleResetApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setResult(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (!apiKey) {
      // Should not happen in UI flow, but as safeguard
      alert("API Key가 필요합니다.");
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      const base64Data = await fileToBase64(file);
      const analysisData = await analyzePdf(base64Data, apiKey);
      
      setResult(analysisData);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error("Failed to analyze PDF:", error);
      setErrorMsg("문서를 분석하는 동안 오류가 발생했습니다. API Key를 확인하거나 잠시 후 다시 시도해주세요.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header onResetKey={handleResetApiKey} hasKey={!!apiKey} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {!apiKey ? (
          <ApiKeyPrompt onKeySubmit={handleSetApiKey} />
        ) : (
          <>
            {/* Intro Section - Show only when IDLE or ERROR */}
            {(appState === AppState.IDLE || appState === AppState.ERROR) && (
              <div className="mb-10 text-center max-w-2xl mx-auto animate-fade-in">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  복잡한 PDF, AI로 3초 만에 요약하세요
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  논문, 보고서, 매뉴얼을 업로드하면 각 장의 핵심 내용을 표로 깔끔하게 정리해드립니다.
                </p>
                
                <div className="bg-white p-2 rounded-2xl shadow-sm">
                  <UploadArea onFileSelect={handleFileSelect} isAnalyzing={false} />
                </div>

                {appState === AppState.ERROR && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {errorMsg}
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {appState === AppState.ANALYZING && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[400px] flex items-center justify-center animate-fade-in">
                <LoadingOverlay />
              </div>
            )}

            {/* Result State */}
            {appState === AppState.SUCCESS && result && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <button 
                      onClick={handleReset}
                      className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                      </svg>
                      다른 파일 분석하기
                    </button>
                 </div>
                <ResultTable data={result} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;