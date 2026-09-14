import React from 'react';
import { Shield, Globe, Terminal, FileCode2, ExternalLink } from 'lucide-react';
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
              Smart AI platform for satellite imagery analysis, landscape monitoring, and environmental intelligence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All satellite analysis services operational
            </div>
          </div>

          {/* Col 2: Earth Observation Sensors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Supported Satellites & Data
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  European Space Agency Sentinel-2
                </span>
              </li>
              <li>
                <span className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  USGS & NASA Landsat-9
                </span>
              </li>
              <li>
                <span className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  High-Resolution PlanetScope
                </span>
              </li>
              <li>
                <span className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  All-Weather Radar Sentinel-1
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Application Pages */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Application Pages
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="#landing" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-slate-400" />
                  Home
                </a>
              </li>
              <li>
                <a href="#login" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <FileCode2 className="w-3 h-3 text-slate-400" />
                  Sign In
                </a>
              </li>
              <li>
                <a href="#signup" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <FileCode2 className="w-3 h-3 text-slate-400" />
                  Create Account
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-slate-400" />
                  Workspace
                </a>
              </li>
              <li>
                <a href="#history" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  Saved Reports & History
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-slate-400" />
                  System Diagnostics
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Benchmark Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Trust & Accuracy
            </h4>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Verified Satellite Standards
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All imagery is processed and calibrated automatically for reliable, accurate insights.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 SatQuery AI. Easy Satellite Image Analysis & Insights.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">System Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

