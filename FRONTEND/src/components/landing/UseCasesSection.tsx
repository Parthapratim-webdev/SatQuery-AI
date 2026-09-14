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
      tag: 'Farms & Crops',
      desc: 'Check how crops are growing, spot dry areas early, and get a clearer picture of your farmland.'
    },
    {
      icon: Flame,
      title: 'Disaster Response',
      tag: 'Emergencies',
      desc: 'See flooded or burned areas even in bad weather, and help teams respond faster.'
    },
    {
      icon: Building2,
      title: 'Cities & Towns',
      tag: 'Urban Growth',
      desc: 'Watch new construction appear, plan roads, and see how your town grows over time.'
    },
    {
      icon: Trees,
      title: 'Forests & Nature',
      tag: 'Trees & Wildlife',
      desc: 'Keep an eye on woodlands, notice when trees disappear, and help protect nature.'
    },
    {
      icon: Droplets,
      title: 'Water Supplies',
      tag: 'Lakes & Rivers',
      desc: 'Track water levels in lakes and reservoirs, and notice when they start to shrink.'
    },
    {
      icon: MapPin,
      title: 'Roads & Transport',
      tag: 'Getting Around',
      desc: 'Inspect highways, ports, and railways to keep important routes working well.'
    },
    {
      icon: Globe2,
      title: 'Environment & Climate',
      tag: 'Our Planet',
      desc: 'Watch coastlines, glaciers, and nature preserves — and see the changes over time.'
    }
  ];

  return (
    <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white border-b border-slate-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wider">
          Helpful in the Real World
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Useful for Everyday Questions
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From farms to cities and rivers to forests, SatQuery makes satellite photos
          easy to understand for everyone.
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
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

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                Simple answers for {uc.title.toLowerCase()}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};