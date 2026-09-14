import React from 'react';
import { 
  Scan
} from 'lucide-react';
import { RevealOnScroll } from '../common/RevealOnScroll';

interface LandingHeroProps {
  onLaunchApp: () => void;
  onExploreFeatures?: () => void;
  onExploreCapabilities?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchApp,
  onExploreFeatures,
  onExploreCapabilities,
}) => {
  return (
    <section id="home" className="relative pt-24 pb-16 overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* User-Friendly Announcement Pill */}
        <RevealOnScroll direction="up" delay={200} duration={800}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs">
              <span className="font-semibold text-slate-900">Smart AI Satellite Assistant</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-semibold">Easy Satellite Analysis</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Hero Headings */}
        <div className="relative text-center max-w-4xl mx-auto space-y-4 mb-10">
          {/* Headline Entrance */}
          <RevealOnScroll direction="up" delay={400} duration={800}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Ask Questions.{' '}
              <span className="theme-heading-gradient block sm:inline font-black">
                Understand Satellite Photos.
              </span>
            </h1>
          </RevealOnScroll>

          {/* Subtitle Entrance */}
          <RevealOnScroll direction="up" delay={600} duration={800}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal mt-4">
              SatQuery AI lets you ask questions in plain English and automatically analyzes satellite photos to give you clear, easy-to-understand answers.
            </p>
          </RevealOnScroll>

          {/* Primary and Secondary Action CTAs */}
          <RevealOnScroll direction="up" delay={800} duration={800}>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={onLaunchApp}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                <span>Launch SatQuery AI</span>
              </button>

              <button
                onClick={onExploreFeatures || onExploreCapabilities}
                className="px-6 py-3.5 rounded-xl btn-secondary font-semibold text-sm flex items-center justify-center"
              >
                <span>Explore Features</span>
              </button>
            </div>
          </RevealOnScroll>
        </div>

        {/* HERO VISUAL: HOW IT WORKS PREVIEW PANEL */}
        <RevealOnScroll direction="up" delay={250} duration={1000} threshold={0.08} className="max-w-5xl mx-auto mt-6 relative">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden relative">
            
            {/* Top Bar */}
            <div className="px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <Scan className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900">HOW IT WORKS • STEP-BY-STEP SATELLITE ANALYSIS</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-[11px]">
                <span>Source: Satellite Photos & Radar</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Ready to Analyze
                </span>
              </div>
            </div>

            {/* Workflow Progression Visual Banner: 4 Stages */}
            <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {/* Stage 01: INPUT */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white border border-blue-200 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-blue-600 font-bold uppercase mb-1">01 Input</div>
                  <div className="text-xs font-bold text-slate-900">Satellite Photos</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Standard Photos + Radar</div>
                </div>

                {/* Stage 02: QUESTION */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white border border-purple-200 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-purple-600 font-bold uppercase mb-1">02 Question</div>
                  <div className="text-xs font-bold text-slate-900">Plain English</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">"Has the city expanded?"</div>
                </div>

                {/* Stage 03: AI ANALYSIS */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-amber-600 font-bold uppercase mb-1">03 AI Analysis</div>
                  <div className="text-xs font-bold text-slate-900">Smart AI Tools</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Runs 2 Smart AI Models</div>
                </div>

                {/* Stage 04: CLEAR RESULTS */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white border border-teal-200 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-teal-700 font-bold uppercase mb-1">04 Results</div>
                  <div className="text-xs font-bold text-slate-900">Visual Answer</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Highlights Changes + 91% Certainty</div>
                </div>
              </div>
            </div>

            {/* Visual Canvas Comparison Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left 7 Columns: Multi-Layer Satellite Visual Preview */}
              <div className="lg:col-span-7 space-y-3">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* Layer 1: Baseline Image */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span className="font-semibold text-slate-900">Before Photo</span>
                      <span>2022</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-slate-300 flex items-end p-2.5 shadow-xs bg-slate-900"
                    >
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-white border border-white/20">
                        Standard Color Photo
                      </div>
                    </div>
                  </div>

                  {/* Layer 2: Post-Period Image */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span className="font-semibold text-slate-900">After Photo</span>
                      <span>2025</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-slate-300 flex items-end p-2.5 shadow-xs bg-slate-900"
                    >
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-white border border-white/20">
                        New Buildings
                      </div>
                    </div>
                  </div>

                  {/* Layer 3: AI Change Detection Mask */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-700 font-bold">
                      <span>Highlighted Changes</span>
                      <span>+28.4%</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-amber-500/40 flex items-end p-2.5 shadow-xs bg-amber-950"
                    >
                      <div className="absolute top-3 left-3 right-3 bottom-8 border-2 border-dashed border-amber-400 rounded-lg pointer-events-none" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 border border-amber-400/40 text-[10px] font-mono text-amber-300 font-bold">
                        Area Highlights
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-label metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span>Target Area: City Growth Zone</span>
                  <span>Resolution: High-Detail Satellite Photo</span>
                </div>
              </div>

              {/* Right 5 Columns: AI Analysis Summary Card */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">AI Analysis Summary</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
                    91% Certainty
                  </span>
                </div>

                {/* Query Display */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Your Question:</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    "Has the city expanded?"
                  </div>
                </div>

                {/* Grounded Natural Language Answer */}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs space-y-1">
                  <div className="font-bold text-blue-700">
                    Analysis Result:
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed">
                    New buildings and paved areas have grown by <strong className="text-amber-700 font-bold">+28.4%</strong> between 2022 and 2025. Clear new construction is detected in the southern area.
                  </p>
                </div>

                {/* Tools selected by agent */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Tools Used:</span>
                  <span className="text-blue-700 font-bold">
                    Change Detection AI + Photo Q&A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default LandingHero;
