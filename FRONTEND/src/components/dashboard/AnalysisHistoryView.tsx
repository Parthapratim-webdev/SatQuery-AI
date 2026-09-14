import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  Download
} from 'lucide-react';
import { MOCK_SAVED_REPORTS } from '../../data/mockData';
import { ReportItem } from '../../types';
import { SatQueryApiService } from '../../services/apiService';

interface AnalysisHistoryViewProps {
  onViewReport: (report: ReportItem) => void;
  onOpenInWorkspace?: (report: ReportItem) => void;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  onViewReport,
  onOpenInWorkspace
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Change' | 'Grounding' | 'VQA' | 'Optical+SAR'>('All');
  const [serverReports, setServerReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    let mounted = true;
    SatQueryApiService.getReports().then(reps => {
      if (mounted && reps && reps.length > 0) {
        const mapped: ReportItem[] = reps.map(r => ({
          id: r.id,
          title: r.title,
          query: r.query,
          date: r.date,
          task: r.task,
          confidence: r.confidence,
          answer: r.answer,
          modelsUsed: r.modelsUsed,
          executionTime: r.executionTime,
          status: (r.status as any) || 'Generated',
          inputSummary: r.inputSummary,
          evidenceVisual: r.evidenceVisual,
          tags: r.tags,
        }));
        setServerReports(mapped);
      }
    });
    return () => { mounted = false; };
  }, []);

  const allItems = [...serverReports, ...MOCK_SAVED_REPORTS];

  const filteredReports = allItems.filter(item => {
    const matchesSearch = item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.task.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Change') return matchesSearch && item.task.includes('Change');
    if (selectedFilter === 'Grounding') return matchesSearch && item.task.includes('Grounding');
    if (selectedFilter === 'VQA') return matchesSearch && item.task.includes('VQA');
    if (selectedFilter === 'Optical+SAR') return matchesSearch && item.task.includes('SAR');
    return matchesSearch;
  });

  const handleDownloadSingle = (report: ReportItem) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SatQuery_Report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
          <History className="w-4 h-4 text-blue-600" />
          <span>Past Analyses</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
          Analysis History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review previous questions, analysis results, and visual reports.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by query, task, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none text-slate-800"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          {(['All', 'Change', 'Grounding', 'VQA', 'Optical+SAR'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-lg transition-all font-semibold whitespace-nowrap cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Query</th>
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Query */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                    "{row.query}"
                    <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                      {row.inputSummary}
                    </span>
                  </td>

                  {/* Task */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {row.task}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {row.date}
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600">
                      {row.confidence}%
                    </span>
                  </td>

                  {/* Actions: View Result & Download Report */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewReport(row)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white font-semibold transition-colors flex items-center gap-1 text-slate-700 cursor-pointer"
                        title="View Result Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Result</span>
                      </button>

                      <button
                        onClick={() => handleDownloadSingle(row)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-colors text-slate-600 cursor-pointer"
                        title="Download Report JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
