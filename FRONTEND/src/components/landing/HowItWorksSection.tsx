import React, { useState } from 'react';
import { UploadCloud, MessageSquare, BrainCircuit, Cpu, FileCheck2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2); // default highlighting Agent Understanding

  const steps = [
    {
      step: '01',
      title: 'Upload',
      subtitle: 'Satellite Image(s)',
      icon: UploadCloud,
      detail: 'Upload single photos, before-and-after image pairs, or radar images. Formats and image details are detected automatically.',
      badge: 'Easy Upload'
    },
    {
      step: '02',
      title: 'Ask',
      subtitle: 'Type in Plain English',
      icon: MessageSquare,
      detail: 'Type any question like "What type of land is here?" or "Has the city expanded?" without needing complicated commands.',
      badge: 'Plain English'
    },
    {
      step: '03',
      title: 'Understand',
      subtitle: 'AI Identifies the Task',
      icon: BrainCircuit,
      detail: 'The assistant reads your question and determines whether you need an image summary, an area highlighted, or a comparison.',
      badge: 'Smart Assistant'
    },
    {
      step: '04',
      title: 'Analyze',
      subtitle: 'Fast AI Inspection',
      icon: Cpu,
      detail: 'Runs specialized satellite AI models in seconds to identify structures, waterways, greenery, and changes.',
      badge: 'Fast AI Models'
    },
    {
      step: '05',
      title: 'Explain',
      subtitle: 'Clear Visual Answers',
      icon: FileCheck2,
      detail: 'Get easy-to-read answers with interactive sliders, highlighted overlays, and certainty percentages to verify everything.',
      badge: 'Visual Proof'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white border-b border-slate-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wider">
          Easy 5-Step Process
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          From Question to Clear Answers
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          How SatQuery AI turns your questions and satellite photos into clear, verified visual answers in five easy steps.
        </p>
      </div>

      {/* 5-Step Visual Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden md:block absolute top-16 left-12 right-12 h-0.5 bg-slate-200 pointer-events-none" />

        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeStep === index;

          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(index)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between group relative select-none ${
                isActive
                  ? 'bg-blue-50/80 border-2 border-blue-600 shadow-md -translate-y-1'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {item.step}
                </span>

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 scale-105'
                    : 'bg-slate-100 text-slate-600 group-hover:text-blue-600'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.3]" />
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-1.5 relative z-10">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-blue-700">
                  {item.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {item.detail}
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{item.badge}</span>
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
