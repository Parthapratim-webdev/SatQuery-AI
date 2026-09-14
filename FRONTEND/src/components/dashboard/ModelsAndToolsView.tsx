import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Zap, Layers, Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { MOCK_MODEL_TOOLS } from '../../data/mockData';
import { AnalysisTaskType } from '../../types';
import { SatQueryApiService, BackendModel } from '../../services/apiService';

interface ModelsAndToolsViewProps {
  onSelectModelTask?: (taskType: AnalysisTaskType) => void;
}

export const ModelsAndToolsView: React.FC<ModelsAndToolsViewProps> = ({ onSelectModelTask }) => {
  const [models, setModels] = useState<BackendModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadModels = async () => {
      try {
        const liveModels = await SatQueryApiService.getModels();
        if (mounted && liveModels && liveModels.length > 0) {
          setModels(liveModels);
        } else if (mounted) {
          setModels(MOCK_MODEL_TOOLS as unknown as BackendModel[]);
        }
      } catch {
        if (mounted) setModels(MOCK_MODEL_TOOLS as unknown as BackendModel[]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadModels();
    return () => { mounted = false; };
  }, []);

  const displayList = models.length > 0 ? models : (MOCK_MODEL_TOOLS as unknown as BackendModel[]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>AI Models & Capabilities</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
          AI Models & Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore the intelligent AI models and verification tools used to analyze satellite imagery.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map((tool) => (
          <div
            key={tool.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header: Title, Badge, Status */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {tool.badge}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{tool.status}</span>
                </div>
              </div>

              {/* Model/Tool Name & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {tool.description}
                </p>
              </div>

              {/* Specifications: Supported Input, Architecture, Precision */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Supported Input:</span>
                  <span className="text-slate-700 font-semibold">{tool.supportedInput}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Architecture:</span>
                    <span className="text-slate-600">{tool.architecture.slice(0, 22)}...</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Accuracy:</span>
                    <span className="text-slate-600">{tool.precision}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-blue-700 font-bold flex items-center justify-between">
                  <span className="text-slate-500 font-normal">Benchmark</span>
                  <span>{tool.benchmarkMetric}</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            {onSelectModelTask && (
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Response: ~{tool.latencyMs}ms</span>
                <button
                  onClick={() => onSelectModelTask(tool.taskType as AnalysisTaskType)}
                  className="flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Select Model</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
