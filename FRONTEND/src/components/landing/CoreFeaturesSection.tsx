import React, { useState } from 'react';
import { 
  HelpCircle, 
  FileText, 
  Crosshair, 
  GitCompare, 
  Radio, 
  Cpu, 
  ArrowRight, 
  Check, 
  Layers,
  Eye
} from 'lucide-react';

interface CoreFeaturesSectionProps {
  onLaunchWithQuery?: (query: string, mode: 'single' | 'bi-temporal' | 'optical-sar') => void;
}

export const CoreFeaturesSection: React.FC<CoreFeaturesSectionProps> = ({ onLaunchWithQuery }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const features = [
    {
      id: 'vqa',
      title: 'Ask Questions About Images',
      subtitle: 'Get direct answers in plain English',
      exampleQuery: 'What type of land is visible?',
      icon: HelpCircle,
      badge: 'Question & Answer',
      mode: 'single' as const,
      description: 'Ask everyday questions about any satellite image and get accurate, direct answers without needing complicated software or code.',
      visualPreview: {
        type: 'vqa',
        gradient: 'linear-gradient(135deg, #15803d 0%, #4d7c0f 45%, #ca8a04 100%)',
        tag: 'Standard Satellite Photo',
        stats: '62% Farm Fields • 18% Trees • 12% Town'
      }
    },
    {
      id: 'scene-description',
      title: 'Instant Image Summary',
      subtitle: 'Clear descriptions of any scene',
      exampleQuery: 'Describe this entire area in simple words.',
      icon: FileText,
      badge: 'Quick Overview',
      mode: 'single' as const,
      description: 'Automatically generate a clean, easy-to-read paragraph describing terrain, farms, city neighborhoods, and waterways.',
      visualPreview: {
        type: 'caption',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        tag: 'Detailed Photo',
        stats: 'Busy Port • 24 Docks • Train Connection'
      }
    },
    {
      id: 'visual-grounding',
      title: 'Find & Highlight Areas',
      subtitle: 'Spot specific objects or places on the map',
      exampleQuery: 'Highlight the water body.',
      icon: Crosshair,
      badge: 'Area Highlighting',
      mode: 'single' as const,
      description: 'Tell the AI what you want to find—like a lake, forest boundary, or road network—and it outlines exactly where it is located on the image.',
      visualPreview: {
        type: 'grounding',
        gradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #0284c7 100%)',
        tag: 'Water Highlight',
        stats: 'Lake Area: 412.8 km² • 95% Accuracy'
      }
    },
    {
      id: 'change-analysis',
      title: 'Track Changes Over Time',
      subtitle: 'Compare before and after photos',
      exampleQuery: 'What changed between 2022 and 2025?',
      icon: GitCompare,
      badge: 'Before & After',
      mode: 'bi-temporal' as const,
      description: 'Upload photos from two different dates to immediately see new construction, tree loss, or coastline shifts with an intuitive difference map.',
      visualPreview: {
        type: 'change',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)',
        tag: 'Difference Map',
        stats: '+28.4% New Buildings • 412.5 ha Changed'
      }
    },
    {
      id: 'optical-sar',
      title: 'Photo + Radar Analysis',
      subtitle: 'See through clouds and bad weather',
      exampleQuery: 'Check flooded areas even if it was cloudy.',
      icon: Radio,
      badge: 'All-Weather View',
      mode: 'optical-sar' as const,
      description: 'Combines daytime satellite photos with cloud-penetrating radar to monitor floods, ports, and ground conditions 24/7 in all weather.',
      visualPreview: {
        type: 'optical-sar',
        gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #f59e0b 80%, #b45309 100%)',
        tag: 'Photo & Radar Combined',
        stats: '312.4 km² Flooded • Clear Through Clouds'
      }
    },
    {
      id: 'agentic-orchestration',
      title: 'Smart Automated Tools',
      subtitle: 'Picks the right AI tool automatically',
      exampleQuery: 'Automatically pick the best tool for my request.',
      icon: Cpu,
      badge: 'Smart AI Dispatch',
      mode: 'bi-temporal' as const,
      description: 'You do not need technical settings—SatQuery AI reads your question and image, then chooses the perfect model to give you precise results.',
      visualPreview: {
        type: 'agentic',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #0284c7 100%)',
        tag: 'Smart AI Selection',
        stats: 'Fast AI Models • Instant Results'
      }
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white border-b border-slate-200">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wider">
          Simple & Powerful Satellite AI
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          One Simple Platform. Everything You Need.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Ask questions, get instant summaries, track changes over time, and inspect satellite photos with ease.
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
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200">
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

                {/* Mini Visual Simulation */}
                <div 
                  className="h-20 rounded-xl relative overflow-hidden flex flex-col justify-end p-2 border border-slate-200"
                  style={{ background: feature.visualPreview.gradient }}
                >
                  <div className="relative z-10 flex items-center justify-between text-[10px] text-white">
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/85 font-semibold">
                      {feature.visualPreview.tag}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/85 text-blue-300 font-bold">
                      {feature.visualPreview.stats}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Type: {feature.mode === 'single' ? 'Single Photo' : feature.mode === 'bi-temporal' ? 'Two Dates' : 'Photo + Radar'}</span>
                {onLaunchWithQuery && (
                  <button
                    onClick={() => onLaunchWithQuery(feature.exampleQuery, feature.mode)}
                    className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline active:scale-95 transition-transform"
                  >
                    <span>Try This Query</span>
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
