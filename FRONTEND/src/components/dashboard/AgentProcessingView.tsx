import React from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles, Cpu } from 'lucide-react';
import { AgentProcessStep } from '../../types';

interface AgentProcessingViewProps {
  currentStepIndex: number;
  steps: AgentProcessStep[];
  selectedTask?: string;
  selectedModel?: string;
}

export const AgentProcessingView: React.FC<AgentProcessingViewProps> = ({
  currentStepIndex,
  steps,
  selectedTask,
  selectedModel
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* Title & Agent Activity */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>AI Analysis in Progress</span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500">
              Processing satellite images and generating accurate answers
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
          <span>AI Engine Active</span>
        </div>
      </div>

      {/* Step-by-Step Workflow */}
      <div className="space-y-3 text-xs max-w-xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Analyzing request...
        </div>

        {steps.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                  : isCurrent
                  ? 'bg-blue-50/80 border-blue-300 text-slate-900 shadow-xs ring-1 ring-blue-200'
                  : 'bg-slate-50/60 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}

                <div>
                  <span className={`font-semibold ${isCurrent ? 'font-bold text-slate-900' : ''}`}>
                    {isDone ? `✓ ${step.title}` : isCurrent ? `● ${step.title}` : `○ ${step.title}`}
                  </span>
                  {step.detail && (
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {step.detail}
                    </span>
                  )}
                </div>
              </div>

              {isDone && (
                <span className="text-[10px] text-emerald-600 font-bold uppercase">
                  Done
                </span>
              )}
              {isCurrent && (
                <span className="text-[10px] text-blue-600 font-bold uppercase animate-pulse">
                  Working
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Dispatched Model Notification Pill */}
      {selectedModel && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Active Model: <strong className="text-blue-600">{selectedModel}</strong></span>
          <span>Task: <strong className="text-slate-800">{selectedTask || 'Image Analysis'}</strong></span>
        </div>
      )}
    </div>
  );
};
