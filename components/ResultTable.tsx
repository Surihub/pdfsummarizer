import React from 'react';
import { AnalysisResult } from '../types';

interface ResultTableProps {
  data: AnalysisResult;
}

export const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Document Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              분석 완료
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.title}</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {data.overallSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-500">
              <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
            </svg>
            장별 상세 요약
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                  장 번호
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4">
                  제목
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">
                  핵심 내용 요약
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  주요 포인트
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.chapters.map((chapter, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 align-top whitespace-nowrap">
                    {chapter.chapterNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-semibold align-top">
                    {chapter.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 align-top leading-relaxed">
                    {chapter.summary}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 align-top">
                    <ul className="list-disc list-outside ml-4 space-y-1">
                      {chapter.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-slate-700">
                          <span className="text-slate-600">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};