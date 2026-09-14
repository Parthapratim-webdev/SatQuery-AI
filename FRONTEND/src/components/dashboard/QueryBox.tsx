import React from 'react';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface QueryBoxProps {
  query: string;
  onChangeQuery: (query: string) => void;
  onAnalyze: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const QueryBox: React.FC<QueryBoxProps> = ({
  query,
  onChangeQuery,
  onAnalyze,
  isProcessing,
  disabled = false
}) => {
  const suggestedQueries = [
    'Describe the land-cover in this image.',
    'Highlight the water body.',
    'What changed between these two dates?',
    'Has the built-up area increased?',
    'Identify built-up and water-covered regions using optical and SAR imagery.'
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isProcessing && !disabled) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label htmlFor="query-textarea" className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Ask a Question</span>
        </label>
        <span className="text-[11px] text-slate-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10px]">Enter ↵</kbd> to analyze
        </span>
      </div>

      {/* Query Text Area & Action Button */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 focus-within:border-blue-500 shadow-sm transition-all">
        <textarea
          id="query-textarea"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing || disabled}
          placeholder="Ask a question about your satellite imagery..."
          rows={3}
          className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 resize-none outline-none leading-relaxed"
        />

        {/* Action Button Strip */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">AI automatically selects the optimal analysis model</span>
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!query.trim() || isProcessing || disabled}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
              query.trim() && !isProcessing && !disabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Analyze with SatQuery AI</span>
          </button>
        </div>
      </div>

      {/* Suggested Queries Chips */}
      <div className="space-y-2">
        <div className="text-[11px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Suggested queries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((suggested, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChangeQuery(suggested)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all text-left cursor-pointer"
            >
              {suggested}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
