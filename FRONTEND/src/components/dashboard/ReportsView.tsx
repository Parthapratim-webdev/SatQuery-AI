import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Cpu, 
  X, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { ReportItem } from '../../types';
import { MOCK_SAVED_REPORTS } from '../../data/mockData';
import { SatQueryApiService } from '../../services/apiService';

interface ReportsViewProps {
  customReports?: ReportItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ customReports = [] }) => {
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

  const allReports = [...customReports, ...serverReports, ...MOCK_SAVED_REPORTS];
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(allReports[0]);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadReportJson = (report: ReportItem) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SatQuery_Report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Saved Analysis Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate, preview, and download structured analysis reports.
          </p>
        </div>
      </div>

      {/* Main Grid: Left List + Right Active Report Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 cols: Reports List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Available Reports ({allReports.length})
          </div>

          <div className="space-y-2.5">
            {allReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-150 border text-left ${
                  selectedReport?.id === report.id
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-200'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-blue-700 font-bold">{report.task}</span>
                  <span className="text-slate-400">{report.date.split(' ')[0]}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {report.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  "{report.query}"
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-600 font-bold">
                    {report.confidence}% Conf.
                  </span>
                  <span className="text-slate-400">{report.executionTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 8 cols: Detailed Report Preview Document */}
        {selectedReport ? (
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  {selectedReport.task}
                </span>
                <span className="text-xs text-slate-500">ID: {selectedReport.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-400 text-xs font-semibold flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>

                <button
                  onClick={() => handleDownloadReportJson(selectedReport)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Document Header */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedReport.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span>Date: <strong>{selectedReport.date}</strong></span>
                <span>Processing Time: <strong>{selectedReport.executionTime}</strong></span>
                <span>Status: <strong className="text-emerald-600">{selectedReport.status}</strong></span>
              </div>
            </div>

            {/* 1. Query & Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Question:</span>
                <span className="text-slate-900 font-semibold">"{selectedReport.query}"</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Input Images:</span>
                <span className="text-slate-900 font-semibold">{selectedReport.inputSummary}</span>
              </div>
            </div>

            {/* 2. Analysis Answer & Confidence */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-700">
                  Answer
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {selectedReport.confidence}% Confidence
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                {selectedReport.answer}
              </p>
            </div>

            {/* 3. Visual Evidence Snapshot */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-slate-500 block">
                Visual Results Snapshot:
              </span>
              <div
                className="h-44 sm:h-52 rounded-xl relative overflow-hidden border border-slate-200 p-4 flex flex-col justify-between"
                style={{
                  background: selectedReport.evidenceVisual
                    ? (selectedReport.evidenceVisual.startsWith('http') || selectedReport.evidenceVisual.startsWith('/')
                        ? `url("${selectedReport.evidenceVisual}") center/cover no-repeat`
                        : selectedReport.evidenceVisual)
                    : 'linear-gradient(135deg, #0f172a, #0369a1)'
                }}
              >
                <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />
                <span className="relative z-10 px-2.5 py-0.5 rounded bg-slate-950/80 text-xs text-slate-200 self-start">
                  Detection Map
                </span>
                <span className="relative z-10 text-xs text-white font-bold bg-slate-950/90 px-3 py-1 rounded self-end">
                  Task: {selectedReport.task}
                </span>
              </div>
            </div>

            {/* 4. Models Used & Execution Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Models & Tools Used:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.modelsUsed.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-blue-700 font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Validation: Standard Quality Assurance Verification</span>
                <span className="text-emerald-600 font-bold">Verified</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Select a report on the left to view details
          </div>
        )}
      </div>
    </div>
  );
};
