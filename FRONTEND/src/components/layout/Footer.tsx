import React from 'react';
import { Globe, Sparkles, Home, LogIn, UserPlus, LayoutDashboard, FileCheck2 } from 'lucide-react';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <ModernSatelliteAiLogo size="sm" showText={true} />
            <p className="text-xs text-slate-600 leading-relaxed">
              SatQuery AI makes satellite photos easier to understand — answering your
              questions in plain, everyday language.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Ready to help whenever you are
            </div>
          </div>

          {/* Col 2: What You Can Do */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Made for Everyone
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-slate-400" />
                  Photos from space, explained simply
                </span>
              </li>
              <li>
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-slate-400" />
                  Everyday-language answers
                </span>
              </li>
              <li>
                <span className="text-slate-600 flex items-center gap-1.5">
                  <FileCheck2 className="w-3 h-3 text-slate-400" />
                  Clear, friendly results
                </span>
              </li>
              <li>
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-slate-400" />
                  No experience needed
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="#landing" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <Home className="w-3 h-3 text-slate-400" />
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-slate-400" />
                  Features
                </a>
              </li>
              <li>
                <a href="#login" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <LogIn className="w-3 h-3 text-slate-400" />
                  Sign In
                </a>
              </li>
              <li>
                <a href="#signup" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <UserPlus className="w-3 h-3 text-slate-400" />
                  Create Account
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-3 h-3 text-slate-400" />
                  My Workspace
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Note */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              How It Helps
            </h4>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Ask, and you'll understand
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                You don't need any special skills — just describe what you want to know
                and SatQuery answers in a way that makes sense.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 SatQuery AI. Simple satellite photo answers for everyone.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};