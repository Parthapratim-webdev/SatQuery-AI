import React, { useState } from 'react';
import { 
  X, 
  Satellite, 
  ArrowRight, 
  Check, 
  UserPlus, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { OAuthProvider } from '../../services/oauthService';

interface OAuthModalProps {
  isOpen?: boolean;
  provider: OAuthProvider;
  stateParam?: string;
  isPopupPage?: boolean;
  onClose?: () => void;
  onSuccess?: (user: UserProfile) => void;
}

const PRESET_GOOGLE_ACCOUNTS = [
  {
    name: 'Dr. Maya Chen',
    email: 'maya.chen.eo@gmail.com',
    role: 'Lead Research Analyst',
    organization: 'Earth Observation Lab',
    avatarBg: 'from-blue-500 to-indigo-600',
    initials: 'MC'
  },
  {
    name: 'Dr. Alex Vance',
    email: 'alex.vance.radar@gmail.com',
    role: 'Satellite Imagery Specialist',
    organization: 'Climate Monitoring Center',
    avatarBg: 'from-teal-600 to-emerald-600',
    initials: 'AV'
  },
  {
    name: 'Research Operations',
    email: 'ops.lead@satquery.ai',
    role: 'Operations Lead',
    organization: 'SatQuery Team',
    avatarBg: 'from-purple-600 to-indigo-600',
    initials: 'RO'
  }
];

export const OAuthModal: React.FC<OAuthModalProps> = ({
  isOpen = true,
  provider,
  stateParam = '',
  isPopupPage = false,
  onClose,
  onSuccess
}) => {
  // Google View State
  const [showCustomGoogle, setShowCustomGoogle] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // GitHub View State
  const [showCustomGithub, setShowCustomGithub] = useState(false);
  const [customGithubUser, setCustomGithubUser] = useState('');
  const [customGithubEmail, setCustomGithubEmail] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isOpen) return null;

  const handleCompleteAuth = (user: UserProfile) => {
    // If inside a popup window, transmit result to opener window
    if (typeof window !== 'undefined' && window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          {
            type: 'SATQUERY_OAUTH_SUCCESS',
            provider,
            user,
            state: stateParam
          },
          window.location.origin
        );
        window.close();
        return;
      } catch (err) {
        console.warn('postMessage to opener failed, falling back', err);
      }
    }

    // In-page callback
    if (onSuccess) {
      onSuccess(user);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSelectGoogleAccount = (acc: typeof PRESET_GOOGLE_ACCOUNTS[0]) => {
    const userProfile: UserProfile = {
      name: acc.name,
      email: acc.email,
      organization: acc.organization,
      role: acc.role,
      stacTier: 'Standard Plan',
      quotaUsedGb: 840,
      quotaMaxGb: 2000
    };
    handleCompleteAuth(userProfile);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail) return;

    const name = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    const userProfile: UserProfile = {
      name,
      email: customGoogleEmail.trim(),
      organization: 'Google Workspace Research Lab',
      role: 'Satellite Analyst (Google Auth)',
      stacTier: 'Standard Plan',
      quotaUsedGb: 620,
      quotaMaxGb: 2000
    };
    handleCompleteAuth(userProfile);
  };

  const handleAuthorizeGithub = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      const username = customGithubUser.trim();
      const email = customGithubEmail.trim() || 'a.vance@github.com';
      const userProfile: UserProfile = {
        name: username ? username : 'Dr. Alex Vance',
        email,
        organization: 'GitHub Open Geospatial Collective',
        role: 'Satellite Specialist (GitHub Auth)',
        stacTier: 'Standard Plan',
        quotaUsedGb: 450,
        quotaMaxGb: 2000
      };
      handleCompleteAuth(userProfile);
    }, 600);
  };

  /* ========================================================================= */
  /* GOOGLE ACCOUNT CHOOSER / SIGN-IN FLOW                                      */
  /* ========================================================================= */
  const renderGoogleFlow = () => (
    <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200">
      {/* Google Header */}
      <div className="pt-8 pb-5 px-6 text-center border-b border-slate-100">
        <div className="flex justify-center mb-4">
          <svg className="w-10 h-10" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.89 0 12s.45 3.86 1.24 5.42l4.04-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-normal text-slate-900">
          Sign in with Google
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Choose an account to continue to <span className="font-semibold text-blue-600">SatQuery AI</span>
        </p>
      </div>

      {/* Body: Account List or Custom Input */}
      <div className="p-6">
        {!showCustomGoogle ? (
          <div className="space-y-2">
            {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectGoogleAccount(acc)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-150 flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${acc.avatarBg} text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                      {acc.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {acc.email}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}

            {/* Use Another Account Button */}
            <button
              type="button"
              onClick={() => setShowCustomGoogle(true)}
              className="w-full text-left p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-150 flex items-center gap-3 text-slate-700 group mt-3"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600 group-hover:text-blue-600">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Use another account</span>
            </button>
          </div>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
            <div className="text-xs text-slate-600 mb-1">
              Enter your Google email address to authenticate with SatQuery AI.
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                placeholder="Maya Chen"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300 focus:border-blue-600 outline-none transition-colors text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Google Email Address
              </label>
              <input
                type="email"
                required
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="analyst@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300 focus:border-blue-600 outline-none transition-colors text-slate-900"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowCustomGoogle(false)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
              >
                Back to accounts
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Google Consent & Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
          To continue, Google will share your name, email address, language preference, and profile picture with <strong>SatQuery AI</strong>.
        </div>
      </div>

      {/* Google Modal Footer */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span>English (United States)</span>
        <div className="flex items-center gap-3">
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  );

  /* ========================================================================= */
  /* GITHUB OAUTH AUTHORIZATION FLOW                                           */
  /* ========================================================================= */
  const renderGithubFlow = () => (
    <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200">
      {/* GitHub Top Authorization Badge */}
      <div className="pt-8 pb-5 px-6 text-center border-b border-slate-100">
        {/* Connected Badges */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shadow-xs">
            <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span className="text-xs font-medium">OAuth</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
          </div>

          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs text-blue-600">
            <Satellite className="w-6 h-6" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Authorize SatQuery AI
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          <span className="font-semibold text-slate-900">SatQuery AI</span> wants to access your GitHub account.
        </p>
      </div>

      {/* Body: Account selection & Permissions */}
      <div className="p-6 space-y-4">
        {/* User Account Card */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex items-center justify-center">
              AV
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {customGithubUser ? customGithubUser : 'Dr. Alex Vance'}
              </div>
              <div className="text-[11px] text-slate-500">
                {customGithubEmail ? customGithubEmail : 'alex-vance (GitHub)'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomGithub(!showCustomGithub)}
            className="text-[11px] text-blue-600 hover:underline font-medium"
          >
            {showCustomGithub ? 'Use default' : 'Switch user'}
          </button>
        </div>

        {/* Optional Custom GitHub Handle Input */}
        {showCustomGithub && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">
                GitHub Username / Handle
              </label>
              <input
                type="text"
                value={customGithubUser}
                onChange={(e) => setCustomGithubUser(e.target.value)}
                placeholder="maya-chen"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">
                GitHub Email
              </label>
              <input
                type="email"
                value={customGithubEmail}
                onChange={(e) => setCustomGithubEmail(e.target.value)}
                placeholder="m.chen@example.com"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        )}

        {/* Permissions Requested */}
        <div className="space-y-2.5 pt-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Permissions Requested
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Personal user data:</span>
                <p className="text-[11px] text-slate-600">Read-only access to email addresses and profile info</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Organizations & Teams:</span>
                <p className="text-[11px] text-slate-600">Verify team memberships</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Saved Satellite Data:</span>
                <p className="text-[11px] text-slate-600">Access satellite image files and saved queries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Authorization Action Buttons */}
        <div className="pt-3 space-y-2">
          <button
            type="button"
            disabled={isAuthorizing}
            onClick={handleAuthorizeGithub}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] disabled:opacity-75"
          >
            {isAuthorizing ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                <span>Authorizing SatQuery AI...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Authorize SatQuery AI</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose || (() => window.close())}
            className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Security & Redirect Disclaimer */}
        <div className="pt-2 text-[10px] text-slate-500 text-center leading-relaxed">
          Authorizing will redirect to{' '}
          <span className="text-blue-600 font-mono">
            {typeof window !== 'undefined' ? window.location.origin : 'SatQuery AI'}
          </span>
          . Protected by standard OAuth 2.0.
        </div>
      </div>
    </div>
  );

  // If this is rendered inside a popup window (via `#oauth-google` or `#oauth-github`), render standalone layout
  if (isPopupPage) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        {provider === 'Google' ? renderGoogleFlow() : renderGithubFlow()}
      </div>
    );
  }

  // Otherwise, render as a clean in-page modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative">
        {/* Modal Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {provider === 'Google' ? renderGoogleFlow() : renderGithubFlow()}
      </div>
    </div>
  );
};
