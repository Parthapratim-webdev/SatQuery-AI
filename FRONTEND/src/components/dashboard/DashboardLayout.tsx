import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { DashboardSidebar } from './DashboardSidebar';
import { NewAnalysisWorkspace } from './NewAnalysisWorkspace';
import { AnalysisHistoryView } from './AnalysisHistoryView';
import { ReportsView } from './ReportsView';
import { ModelsAndToolsView } from './ModelsAndToolsView';
import { SettingsView } from '../settings/SettingsView';
import { DedicatedChatView } from '../chat/DedicatedChatView';
import { WorkspaceView } from '../workspace/WorkspaceView';
import { 
  DashboardView, 
  UserProfile, 
  ReportItem 
} from '../../types';
import { AnalysisScenario, MOCK_SCENARIOS } from '../../data/mockData';
import { Footer } from '../layout/Footer';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

interface DashboardLayoutProps {
  user: UserProfile;
  onBackToLanding: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  initialView?: DashboardView;
  onSignOut?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onBackToLanding,
  onUpdateProfile,
  initialView = 'new-analysis',
  onSignOut
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>(initialView);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedScenario] = useState<AnalysisScenario>(MOCK_SCENARIOS[0]);
  const [savedReports, setSavedReports] = useState<ReportItem[]>([]);

  const handleSaveReport = (report: ReportItem) => {
    setSavedReports(prev => [report, ...prev]);
  };

  const handleViewReportInHistory = (_report: ReportItem) => {
    setCurrentView('reports');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Workspace Top Header Bar with Toggle Menu Button */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* Menu button that opens and closes sidebar */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-xs"
            title={isSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
            aria-label={isSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
          >
            <Menu className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold">
              {isSidebarOpen ? 'Close Menu' : 'Menu'}
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <ModernSatelliteAiLogo size="sm" showText={true} />
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs font-semibold text-blue-600 capitalize hidden sm:inline">
              {currentView === 'new-analysis' ? 'New Analysis' : currentView === 'models' ? 'Models & Tools' : currentView === 'chat' ? 'AI Assistant' : currentView === 'workspace' ? 'Satellite Viewer' : currentView === 'history' ? 'Analysis History' : currentView === 'reports' ? 'Saved Reports' : 'Settings'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>AI System Ready</span>
          </div>
        </div>
      </header>

      {/* Main Row: Collapsible Sidebar + Workspace */}
      <div className="flex-1 flex flex-row relative min-w-0">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 top-[53px] bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Collapsible Sidebar Container */}
        <div
          className={`fixed inset-y-0 left-0 top-[53px] z-40 lg:static transition-all duration-300 ease-in-out flex-shrink-0 ${
            isSidebarOpen
              ? 'w-64 lg:w-72 translate-x-0 opacity-100'
              : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0 overflow-hidden opacity-0 pointer-events-none'
          }`}
        >
          <DashboardSidebar
            currentView={currentView}
            onSelectView={(view) => {
              setCurrentView(view);
              if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
              }
            }}
            onCloseSidebar={() => setIsSidebarOpen(false)}
            onBackToLanding={onBackToLanding}
            user={user}
            systemStatus="AI System Ready"
            onSignOut={onSignOut}
          />
        </div>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-[calc(100vh-53px)]">
          <div className="flex-1">
            {/* View 1: New Analysis */}
            {currentView === 'new-analysis' && (
              <NewAnalysisWorkspace
                initialScenario={selectedScenario}
                onSaveReport={handleSaveReport}
                onViewReports={() => setCurrentView('reports')}
              />
            )}

            {/* View 2: Models & Tools */}
            {currentView === 'models' && (
              <ModelsAndToolsView
                onSelectModelTask={() => {
                  setCurrentView('new-analysis');
                }}
              />
            )}

            {/* View 3: Orbit AI Copilot Chat */}
            {currentView === 'chat' && (
              <DedicatedChatView
                onNavigateToWorkspace={() => setCurrentView('workspace')}
                onNavigate={(screen) => {
                  if (screen === 'dashboard') setCurrentView('new-analysis');
                }}
              />
            )}

            {/* View 4: Geospatial Canvas / Workspace */}
            {currentView === 'workspace' && (
              <WorkspaceView />
            )}

            {/* View 5: Analysis History */}
            {currentView === 'history' && (
              <AnalysisHistoryView
                onViewReport={handleViewReportInHistory}
                onOpenInWorkspace={(_rep) => {
                  setCurrentView('new-analysis');
                }}
              />
            )}

            {/* View 6: Saved Reports */}
            {currentView === 'reports' && (
              <ReportsView customReports={savedReports} />
            )}

            {/* View 7: Settings Page */}
            {currentView === 'settings' && (
              <SettingsView
                user={user}
                onUpdateProfile={onUpdateProfile}
                initialTab="profile"
                onSignOut={onSignOut}
              />
            )}
          </div>

          {/* Workspace Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};
