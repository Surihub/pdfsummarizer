import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey);

  useEffect(() => {
    setKey(currentKey);
  }, [currentKey]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden animate-fade-in">
        <h3 className="text-xl font-bold text-slate-800 mb-4">API Key 설정</h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Google Gemini API Key를 입력해주세요.<br/>
          입력한 키는 서버에 저장되지 않고 브라우저에만 저장됩니다.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 transition-all"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => onSave(key)}
              disabled={!key.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};