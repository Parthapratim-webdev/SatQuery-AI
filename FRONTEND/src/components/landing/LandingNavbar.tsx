import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';

export interface ModernSatelliteAiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * Modern, minimal, and professional Satellite + AI brand logo.
 * Features an orbital ellipse path, geometric solar wings, diamond satellite core,
 * and central AI neural sensor pupil. Includes a subtle, non-excessive ambient glow on hover.
 */
export const ModernSatelliteAiLogo: React.FC<ModernSatelliteAiLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl'
  };

  const svgSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 h-5.5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7'
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-3xl font-black'
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 group/logo ${className}`}>
      {/* Logo Icon */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        {/* Icon Base Frame */}
        <div
          className={`relative ${containerSizes[size]} bg-blue-50 border border-blue-200 shadow-xs flex items-center justify-center transition-all duration-200`}
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${svgSizes[size]} transition-transform duration-200 group-hover/logo:scale-105`}
          >
            <defs>
              <linearGradient id="sqai-orbit-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>

            {/* Orbital Trajectory Ring */}
            <ellipse
              cx="16"
              cy="16"
              rx="12.5"
              ry="4.8"
              transform="rotate(-28 16 16)"
              stroke="url(#sqai-orbit-grad)"
              strokeWidth="1.4"
              strokeDasharray="24 6"
              strokeLinecap="round"
              className="opacity-90"
            />

            {/* Trajectory Orbital Pulse Particle */}
            <circle cx="26" cy="10.8" r="1.3" fill="#2563EB" />

            {/* Satellite Left Solar Wing */}
            <rect
              x="6.5"
              y="14.5"
              width="5"
              height="3"
              rx="0.6"
              transform="rotate(28 6.5 14.5)"
              fill="#FFFFFF"
              stroke="#2563EB"
              strokeWidth="0.9"
            />
            <line x1="8.2" y1="14.2" x2="9.8" y2="17.2" stroke="#2563EB" strokeWidth="0.6" opacity="0.7" />

            {/* Satellite Right Solar Wing */}
            <rect
              x="19.5"
              y="14.5"
              width="5"
              height="3"
              rx="0.6"
              transform="rotate(28 19.5 14.5)"
              fill="#FFFFFF"
              stroke="#2563EB"
              strokeWidth="0.9"
            />
            <line x1="21.2" y1="14.2" x2="22.8" y2="17.2" stroke="#2563EB" strokeWidth="0.6" opacity="0.7" />

            {/* Satellite Connecting Axle */}
            <line x1="11.5" y1="16.5" x2="20.5" y2="15.5" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />

            {/* Satellite Central Chassis */}
            <rect
              x="13.5"
              y="13.5"
              width="5"
              height="5"
              rx="1.2"
              transform="rotate(45 16 16)"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="1.3"
            />

            {/* AI Central Sensor Pupil */}
            <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="2.5" stroke="#2563EB" strokeWidth="0.5" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Brand Text: 'SatQuery' in slate-900, 'AI' in royal blue */}
      {showText && (
        <span className={`${textSizes[size]} tracking-tight leading-none select-none flex items-center`}>
          <span className="text-slate-900">SatQuery</span>
          <span className="text-blue-600 ml-0.5 font-black">
            AI
          </span>
        </span>
      )}
    </div>
  );
};

interface LandingNavbarProps {
  onLaunchApp: () => void;
  onOpenAuth?: (tab?: 'signin' | 'signup') => void;
  onNavigateToAuth?: (page: 'login' | 'signup') => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLaunchApp,
  onOpenAuth,
  onNavigateToAuth
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToAuth = (tab: 'login' | 'signup') => {
    setMobileMenuOpen(false);
    if (onNavigateToAuth) {
      onNavigateToAuth(tab);
    } else if (onOpenAuth) {
      onOpenAuth(tab === 'login' ? 'signin' : 'signup');
    } else {
      window.location.hash = tab;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs'
          : 'bg-white/90 backdrop-blur-xs border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between transition-all duration-200">
        {/* Left: Brand Logo & Title */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          title="SatQuery AI Home"
        >
          <ModernSatelliteAiLogo size="sm" showText={true} />
        </a>

        {/* Center: Clean Minimal Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1.5 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Auth Buttons & Launch SatQuery AI CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dedicated Sign In Button */}
          <button
            type="button"
            onClick={() => handleGoToAuth('login')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all active:scale-95"
            title="Sign In"
          >
            <LogIn className="w-3.5 h-3.5 text-blue-600" />
            <span>Sign In</span>
          </button>

          {/* Primary CTA: Launch SatQuery AI */}
          <button
            type="button"
            onClick={onLaunchApp}
            className="btn-gradient btn-shine px-4 py-1.5 sm:px-5 text-xs sm:text-sm"
          >
            <span>Launch SatQuery AI</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-blue-600"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-white border-b border-slate-200 shadow-lg space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-[#A8B6CF] hover:bg-slate-100 dark:hover:bg-[#101F38] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-[#263B5C] space-y-2.5">
            <button
              onClick={() => handleGoToAuth('login')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-[#263B5C] bg-slate-50 dark:bg-[#101F38]/60 text-slate-800 dark:text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-[#152A48]"
            >
              <LogIn className="w-4 h-4 text-[#5B8CFF]" />
              <span>Sign In / Register</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchApp();
              }}
              className="btn-gradient btn-shine w-full py-2.5 px-4 text-sm"
            >
              <span>Launch SatQuery AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
