import React from 'react';
import { 
  Wheat, 
  Flame, 
  Building2, 
  Trees, 
  Droplets, 
  MapPin, 
  Globe2 
} from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: Wheat,
      title: 'Agriculture',
      tag: 'Crops & Farming',
      desc: 'Track crop growth, predict seasonal harvest yields, check soil moisture, and spot dry areas early.'
    },
    {
      icon: Flame,
      title: 'Disaster Management',
      tag: 'Emergency Response',
      desc: 'Map flood waters through thick clouds, outline wildfire damage, and help rescue teams respond quickly.'
    },
    {
      icon: Building2,
      title: 'Urban Planning',
      tag: 'Cities & Growth',
      desc: 'Track new construction, detect unauthorized building, plan roads, and see urban growth over time.'
    },
    {
      icon: Trees,
      title: 'Forest Monitoring',
      tag: 'Trees & Wildlife',
      desc: 'Detect illegal tree cutting, track new logging roads, and protect forests and wildlife.'
    },
    {
      icon: Droplets,
      title: 'Water Resources',
      tag: 'Lakes & Reservoirs',
      desc: 'Track water levels in lakes and reservoirs, detect drying water bodies, and manage freshwater.'
    },
    {
      icon: MapPin,
      title: 'Infrastructure',
      tag: 'Roads & Transport',
      desc: 'Inspect railways, highways, ports, and power lines to keep vital infrastructure in top shape.'
    },
    {
      icon: Globe2,
      title: 'Environment & Climate',
      tag: 'Nature & Climate',
      desc: 'Track melting glaciers, monitor shrinking coastlines, and protect local nature preserves.'
    }
  ];

  return (
    <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white border-b border-slate-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wider">
          Real-World Uses
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Built for Practical Satellite Insights
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From farming and flood response to urban tracking, SatQuery AI makes satellite data easy and accessible for everyone.
        </p>
      </div>

      {/* 7 Use Cases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {useCases.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {uc.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {uc.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {uc.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-blue-600 group-hover:text-blue-800 font-semibold transition-colors">
                <span className="text-slate-500">Use Case 0{i + 1}</span>
                <span className="group-hover:translate-x-0.5 transition-transform">Explore →</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
