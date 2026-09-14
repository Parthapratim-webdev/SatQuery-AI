import React, { useState, useEffect } from 'react';
import { 
  X, 
  Satellite, 
  Mail, 
  Lock, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Globe,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../../types';
import { DEFAULT_PROFILE } from '../../data/mockData';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'signin' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'signin',
  onClose,
  onLoginSuccess
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('m.chen@earthobservatory.org');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Dr. Maya Chen');
  const [organization, setOrganization] = useState('Planetary Dynamics Institute');

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: name || DEFAULT_PROFILE.name,
      email: email || DEFAULT_PROFILE.email,
      organization: organization || DEFAULT_PROFILE.organization,
      role: tab === 'signup' ? 'Earth Observation Scientist' : 'Principal Geospatial Research Lead',
      stacTier: 'Enterprise STAC Planetary Dedicated',
      quotaUsedGb: 840,
      quotaMaxGb: 2000
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md">
        <div 
          className="relative z-10 w-full rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header decoration */}
          <div className="h-1.5 w-full bg-blue-600"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Logo & Title */}
            <div className="mb-6">
              <ModernSatelliteAiLogo size="md" showText={true} />
              <p className="text-xs text-slate-500 mt-2">
                Sign in or create an account to start analyzing satellite images.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 mb-6 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  tab === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  tab === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Dr. Maya Chen"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Organization / Company
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      required
                      placeholder="Planetary Dynamics Institute"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="analyst@earthobservatory.org"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  {tab === 'signin' && (
                    <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your secure password"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                <span>{tab === 'signin' ? 'Log In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Institutional SSO Options */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                <Globe className="w-3 h-3 text-slate-400" />
                Copernicus SSO
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                NASA Earthdata
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
