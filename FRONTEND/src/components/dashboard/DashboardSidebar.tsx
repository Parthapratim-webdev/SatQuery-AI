import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Compass, 
  History, 
  FileText, 
  Settings, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Menu,
  Cpu,
  Bot,
  Layers
} from 'lucide-react';
import { DashboardView, UserProfile } from '../../types';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';
import { SatQueryApiService, BackendHealth } from '../../services/apiService';

interface DashboardSidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  onBackToLanding?: () => void;
  onCloseSidebar?: () => void;
  user: UserProfile | null;
  systemStatus?: string;
  onSignOut?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentView,
  onSelectView,
  onCloseSidebar,
  user,
  systemStatus = 'AI System Ready',
  onSignOut
}) => {
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  useEffect(() => {
    let mounted = true;
    const pollHealth = async () => {
      const health = await SatQueryApiService.checkHealth();
      if (mounted) setBackendHealth(health);
    };
    pollHealth();
    const interval = setInterval(pollHealth, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const menuItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'new-analysis',
      label: 'New Analysis',
      icon: Compass,
      badge: 'Core'
    },
    {
      id: 'models',
      label: 'Models & Tools',
      icon: Cpu,
      badge: '6 AI'
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      icon: Bot,
      badge: 'Live'
    },
    {
      id: 'workspace',
      label: 'Satellite Viewer',
      icon: Layers
    },
    {
      id: 'history',
      label: 'Analysis History',
      icon: History
    },
    {
      id: 'reports',
      label: 'Saved Reports',
      icon: FileText
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 lg:w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-53px)] sticky top-[53px] select-none z-30 flex-shrink-0 overflow-y-auto">
      {/* Top Section: Brand & Navigation */}
      <div>
        {/* Top Accent Strip */}
        <div className="h-1 w-full bg-blue-600" />

        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center">
            <ModernSatelliteAiLogo size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-1">
            {/* Menu Toggle Button */}
            {onCloseSidebar && (
              <button
                type="button"
                onClick={onCloseSidebar}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                title="Close Sidebar Menu"
                aria-label="Close Sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-3 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Operations Menu
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] group ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 group-hover:text-blue-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Active User & "AI System Ready" */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
        {/* User Card */}
        {user && (
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {user.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded transition-colors"
                  title="Sign Out / Switch Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Requirement: AI System Ready */}
        <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[11px] font-mono font-medium text-emerald-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>
              {backendHealth
                ? `SatQuery Core: ${backendHealth.device.toUpperCase()}`
                : systemStatus}
            </span>
          </div>
          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
            {backendHealth ? 'Connected' : 'Ready'}
          </span>
        </div>
      </div>
    </aside>
  );
};

