import React from 'react';
import {
  MessageCircleQuestion,
  Sparkles,
  CircleCheck,
  Timer,
  MessageSquareText
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
    <section id="home" className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-white border-b border-slate-200">
      {/* Subtle dot-grid texture */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

      {/* Soft decorative gradient orbs (pure CSS, no images) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200/50 blur-3xl pointer-events-none animate-blob-float" />
      <div className="absolute -top-16 left-1/3 w-72 h-72 rounded-full bg-sky-200/50 blur-3xl pointer-events-none animate-blob-float-reverse" />
      <div className="absolute top-40 -right-28 w-[28rem] h-[28rem] rounded-full bg-indigo-200/50 blur-3xl pointer-events-none animate-blob-float-slow" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl pointer-events-none animate-blob-float-reverse" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-72 rounded-full bg-sky-100/60 blur-3xl pointer-events-none" />

      {/* Twinkling accent dots */}
      <div className="absolute top-24 left-[12%] w-2 h-2 rounded-full bg-blue-400/70 animate-twinkle pointer-events-none" />
      <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-indigo-400/70 animate-twinkle-slow pointer-events-none" />
      <div className="absolute bottom-24 left-[22%] w-1.5 h-1.5 rounded-full bg-sky-400/70 animate-twinkle-slow pointer-events-none" />
      <div className="absolute bottom-16 right-[25%] w-2 h-2 rounded-full bg-violet-400/70 animate-twinkle pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* User-Friendly Announcement Pill */}
        <RevealOnScroll direction="up" delay={200} duration={800}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-900">Made for Everyone</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-semibold">No Experience Needed</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Hero Headings */}
        <div className="relative text-center max-w-4xl mx-auto space-y-4 mb-12">
          <RevealOnScroll direction="up" delay={400} duration={800}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Ask Questions.{' '}
              <span className="theme-heading-gradient block sm:inline font-black">
                Understand Satellite Photos.
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delay={600} duration={800}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal mt-4">
              SatQuery AI looks at pictures of the Earth taken from space, then answers
              your questions in simple, everyday language. Just ask — you'll get a clear answer.
            </p>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delay={800} duration={800}>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={onLaunchApp}
                className="btn-gradient btn-shine px-7 py-3.5 rounded-xl text-sm"
              >
                <span>Try SatQuery AI</span>
              </button>

              <button
                onClick={onExploreFeatures || onExploreCapabilities}
                className="btn-secondary px-6 py-3.5 rounded-xl text-sm"
              >
                <span>See What It Can Do</span>
              </button>
            </div>
          </RevealOnScroll>
        </div>

        {/* FRIENDLY PREVIEW: SIMPLE QUESTION & ANSWER (no photos, no jargon) */}
        <RevealOnScroll direction="up" delay={250} duration={1000} threshold={0.08} className="max-w-3xl mx-auto mt-4 relative">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden relative">

            {/* Top Bar */}
            <div className="px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs font-mono relative z-10">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <MessageCircleQuestion className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900">A SIMPLE QUESTION</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Ready
              </span>
            </div>

            {/* Conversation preview */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* User question */}
              <div className="flex justify-end">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md bg-blue-600 text-white text-sm shadow-sm">
                  <span className="font-semibold">"Has our town grown over the last few years?"</span>
                </div>
              </div>

              {/* SatQuery answer */}
              <div className="flex justify-start">
                <div className="max-w-[90%] space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
                    <MessageSquareText className="w-3.5 h-3.5" />
                    SatQuery AI
                  </div>
                  <div className="px-4 py-3.5 rounded-2xl rounded-tl-md bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                    Yes, it has! New homes were built in the south part of town, and a few
                    new roads were added near the river. What you see most is fresh construction
                    compared with a few years ago. 
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                    <CircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium text-slate-600">Clear, easy-to-follow answer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Reassurance chips */}
        <RevealOnScroll direction="up" delay={150} duration={900} className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
              <CircleCheck className="w-3.5 h-3.5 text-emerald-600" />
              Plain-English answers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
              <Timer className="w-3.5 h-3.5 text-blue-600" />
              Quick results
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Simple to use, no training needed
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default LandingHero;