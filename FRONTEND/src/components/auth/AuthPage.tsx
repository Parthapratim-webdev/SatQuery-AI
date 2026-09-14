import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Mail, 
  Lock, 
  UserCheck, 
  Building2, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../../types';
import { DEFAULT_PROFILE } from '../../data/mockData';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';
import { 
  generateOAuthState, 
  saveOAuthState, 
  getOAuthUrl, 
  openOAuthPopup, 
  OAuthProvider 
} from '../../services/oauthService';
import { OAuthModal } from './OAuthModal';

export type AuthMode = 'login' | 'signup' | 'forgot-password';

interface AuthPageProps {
  initialMode?: AuthMode;
  onLoginSuccess: (user: UserProfile) => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onBackToLanding
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [resetDispatched, setResetDispatched] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');

  // OAuth State
  const [activeOAuthModal, setActiveOAuthModal] = useState<OAuthProvider | null>(null);
  const [currentOAuthState, setCurrentOAuthState] = useState<string>('');

  useEffect(() => {
    if (initialMode && initialMode !== mode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Global listener for OAuth success from popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'SATQUERY_OAUTH_SUCCESS' && event.data.user) {
        setActiveOAuthModal(null);
        onLoginSuccess(event.data.user);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onLoginSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot-password') {
      setResetDispatched(true);
      return;
    }

    const resolvedUser: UserProfile = {
      name: name.trim() || (mode === 'signup' ? 'Satellite Analyst' : DEFAULT_PROFILE.name),
      email: email.trim() || DEFAULT_PROFILE.email,
      organization: organization.trim() || (mode === 'signup' ? 'Satellite Research Lab' : DEFAULT_PROFILE.organization),
      role: mode === 'signup' ? 'Satellite Analyst' : DEFAULT_PROFILE.role,
      stacTier: 'Standard Plan',
      quotaUsedGb: mode === 'signup' ? 120 : 840,
      quotaMaxGb: 2000
    };

    onLoginSuccess(resolvedUser);
  };

  const handleSocialLogin = (provider: OAuthProvider) => {
    const state = generateOAuthState();
    setCurrentOAuthState(state);
    saveOAuthState(state, provider);

    const url = getOAuthUrl(provider, state);
    const title = provider === 'Google' ? 'Sign in - Google Accounts' : 'Authorize SatQueryAI - GitHub';
    const popup = openOAuthPopup(url, title, 500, provider === 'Google' ? 620 : 680);

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setActiveOAuthModal(provider);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setResetDispatched(false);
    window.location.hash = newMode;
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-white text-slate-900 font-sans p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Top Simple Utility Bar */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-2 z-20">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 bg-white transition-all active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Single Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center py-6 z-20">
        <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
          
          {/* Top Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />

          {/* Brand Logo & Heading */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <ModernSatelliteAiLogo size="md" showText={true} />
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot-password' && 'Reset Password'}
            </h1>

            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {mode === 'login' && 'Sign in to access your satellite analysis workspace'}
              {mode === 'signup' && 'Join SatQuery AI to explore and analyze satellite images'}
              {mode === 'forgot-password' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Login / Register) */}
          {mode !== 'forgot-password' && (
            <div className="flex p-1 mb-5 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Password Reset Confirmation Alert */}
          {resetDispatched && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reset Link Sent</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Instructions have been dispatched to <strong className="font-mono text-slate-900">{email || 'your email'}</strong>. Check your inbox to proceed.
              </p>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-semibold text-blue-600 hover:underline block pt-1"
              >
                Return to Log In →
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Sign Up Fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Maya Chen"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-blue-600 outline-none text-slate-900 placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Team
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Satellite Research Lab"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-blue-600 outline-none text-slate-900 placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="analyst@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-blue-600 outline-none text-slate-900 placeholder-slate-400 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-blue-600 outline-none text-slate-900 placeholder-slate-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (Login Mode) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => switchMode('forgot-password')}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 mt-2 text-white shadow-sm transition-colors"
            >
              {mode === 'login' && (
                 <>
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Sign In</span>
                </>
              )}
              {mode === 'signup' && (
                <>
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Create Account</span>
                </>
              )}
              {mode === 'forgot-password' && (
                <>
                  <KeyRound className="w-4 h-4 text-white" />
                  <span>Send Reset Link</span>
                </>
              )}
              <ArrowRight className="w-4 h-4 text-white ml-1" />
            </button>

            {/* Forgot Password Mode Back Link */}
            {mode === 'forgot-password' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </form>

          {/* Social OAuth Buttons */}
          {mode !== 'forgot-password' && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500 text-[10px] uppercase tracking-wider">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.6 7c-.8 1.6-1.3 3.4-1.3 5.3s.5 3.7 1.3 5.3l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="text-center py-2 text-xs text-slate-500 z-20">
        <span>© 2026 SatQuery AI • Easy Satellite Image Analysis</span>
      </footer>

      {/* OAuth Fallback Modal */}
      {activeOAuthModal && (
        <OAuthModal
          isOpen={true}
          provider={activeOAuthModal}
          stateParam={currentOAuthState}
          onClose={() => setActiveOAuthModal(null)}
          onSuccess={(user) => {
            setActiveOAuthModal(null);
            onLoginSuccess(user);
          }}
        />
      )}
    </div>
  );
};

export default AuthPage;

