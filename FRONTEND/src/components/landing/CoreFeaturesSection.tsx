import React from 'react';
import {
  HelpCircle,
  FileText,
  Crosshair,
  GitCompare,
  CloudSun,
  Wand2,
  ArrowRight
} from 'lucide-react';

interface CoreFeaturesSectionProps {
  onLaunchWithQuery?: (query: string, mode: 'single' | 'bi-temporal' | 'optical-sar') => void;
}

export const CoreFeaturesSection: React.FC<CoreFeaturesSectionProps> = ({ onLaunchWithQuery }) => {
  const features = [
    {
      id: 'vqa',
      title: 'Ask Questions About Photos',
      subtitle: 'Get direct answers in plain English',
      exampleQuery: 'What kind of place is this?',
      icon: HelpCircle,
      badge: 'Question & Answer',
      mode: 'single' as const,
      description: 'Ask everyday questions about any satellite photo and get a simple, accurate answer — no technical knowledge required.',
    },
    {
      id: 'scene-description',
      title: 'Get a Quick Summary',
      subtitle: 'Understand the whole area at a glance',
      exampleQuery: 'Describe this entire area in simple words.',
      icon: FileText,
      badge: 'Quick Overview',
      mode: 'single' as const,
      description: 'Receive a short, friendly summary of what a photo shows — fields, towns, rivers, and other useful details.',
    },
    {
      id: 'visual-grounding',
      title: 'Find Things on the Photo',
      subtitle: 'Spot lakes, roads, or buildings easily',
      exampleQuery: 'Highlight the water body.',
      icon: Crosshair,
      badge: 'Area Highlighting',
      mode: 'single' as const,
      description: 'Tell SatQuery what you want to find and it will outline exactly where it is on the picture — right where you expect it.',
    },
    {
      id: 'change-analysis',
      title: 'See What Changed Over Time',
      subtitle: 'Compare one date with another',
      exampleQuery: 'What changed between 2022 and 2025?',
      icon: GitCompare,
      badge: 'Before & After',
      mode: 'bi-temporal' as const,
      description: 'Look at two photos from different dates side by side and see what is new — homes, roads, or lost trees — at a glance.',
    },
    {
      id: 'optical-sar',
      title: 'Works Even in Bad Weather',
      subtitle: 'See through clouds and darkness',
      exampleQuery: 'Check flooded areas even when it is cloudy.',
      icon: CloudSun,
      badge: 'All-Weather View',
      mode: 'optical-sar' as const,
      description: 'SatQuery combines daytime photos with weather-resilient views so you get clear answers even on cloudy days or at night.',
    },
    {
      id: 'agentic-orchestration',
      title: 'We Pick the Right Tool',
      subtitle: 'Nothing to configure, just ask',
      exampleQuery: 'Automatically choose the best way to answer my question.',
      icon: Wand2,
      badge: 'Effortless Setup',
      mode: 'bi-temporal' as const,
      description: 'You never have to worry about settings. SatQuery reads your question and instantly picks the best way to help you.',
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white border-b border-slate-200">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wider">
          Simple & Powerful Satellite Help
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          All the Help You Need, in One Place
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Ask questions, get simple summaries, track changes over time, and spot important
          details in satellite photos — all in plain language.
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className="p-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {feature.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-blue-700 mt-0.5 font-semibold">
                    {feature.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                    {feature.description}
                  </p>
                </div>

                {/* Example Query Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Sample Question:</span>
                  <span className="text-slate-900 font-semibold italic">
                    "{feature.exampleQuery}"
                  </span>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Easy for anyone</span>
                {onLaunchWithQuery && (
                  <button
                    onClick={() => onLaunchWithQuery(feature.exampleQuery, feature.mode)}
                    className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline active:scale-95 transition-transform"
                  >
                    <span>Try This Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};