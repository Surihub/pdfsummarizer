import React, { useRef, useState } from 'react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isAnalyzing }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isAnalyzing) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isAnalyzing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('PDF 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
        ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        p-12 text-center group
      `}
      onClick={() => !isAnalyzing && inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept="application/pdf"
        className="hidden"
        disabled={isAnalyzing}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`
          p-4 rounded-full bg-slate-100 transition-colors duration-300
          ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50'}
        `}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6" />
          </svg>
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-700">
            {isDragging ? '파일을 여기에 놓으세요' : 'PDF 파일을 선택하거나 끌어다 놓으세요'}
          </p>
          <p className="text-sm text-slate-500">
            최대 20MB까지 업로드 가능합니다
          </p>
        </div>

        <button 
          className={`
            px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            ${isDragging 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white text-slate-700 border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 shadow-sm'}
          `}
        >
          파일 선택하기
        </button>
      </div>
    </div>
  );
};