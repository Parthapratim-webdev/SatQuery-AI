import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ChatMessage, AOIPreset, Screen } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';
import { OrbitMascot } from '../mascot/OrbitMascot';
import { SatQueryApiService } from '../../services/apiService';

interface FloatingChatWidgetProps {
  onNavigateToWorkspace: (aoi?: AOIPreset) => void;
  onNavigate: (screen: Screen) => void;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  onNavigateToWorkspace,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'f-init',
      sender: 'agent',
      timestamp: 'Just now',
      text: 'Hi there! I am **Orbit**, your satellite analysis AI assistant. Ask me anything about satellite locations, vegetation health (NDVI), or detecting landscape changes over time.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQueries = [
    'Show Amazon forest changes',
    'How does vegetation index work?',
    'Find recent river flood zones'
  ];

  const hasStartedChatting = messages.some(m => m.sender === 'user');

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isExpanded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExpanded]);

  const handleSend = (text?: string) => {
    const query = text || inputQuery;
    if (!query.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    const livePromise = SatQueryApiService.sendChat(query);

    setTimeout(async () => {
      const liveRes = await livePromise;
      if (liveRes && liveRes.reply) {
        const agentMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: 'agent',
          timestamp: 'Just now',
          text: liveRes.reply,
          traces: (liveRes.traces as any) || [],
          groundedStats: liveRes.groundedStats,
          suggestedAction: (liveRes.suggestedAction as any) || {
            label: 'Open in Satellite Viewer',
            actionType: 'open-workspace',
            targetAOIId: MOCK_AOI_PRESETS[0].id
          }
        };
        setMessages(prev => [...prev, agentMsg]);
        setIsProcessing(false);
        return;
      }

      const isAmazon = query.toLowerCase().includes('amazon') || query.toLowerCase().includes('canopy') || query.toLowerCase().includes('forest');
      const isFormula = query.toLowerCase().includes('ndvi') || query.toLowerCase().includes('formula') || query.toLowerCase().includes('vegetation');

      let reply = `Analyzed query: "${query}". Connected to satellite archive. Ready to explore details in the viewer.`;
      let targetPreset = MOCK_AOI_PRESETS[0];

      if (isAmazon) {
        reply = `**Amazon Basin**: Detected **48.2 hectares** of tree cover loss between June and August with **98.6% confidence**.`;
        targetPreset = MOCK_AOI_PRESETS[0];
      } else if (isFormula) {
        reply = `**Vegetation Index (NDVI)** compares near-infrared and red light reflectance. Healthy green trees reflect high values between 0.75 and 0.88, while dry soil or water reflects lower values.`;
      }

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        timestamp: 'Just now',
        text: reply,
        suggestedAction: {
          label: 'Open in Satellite Viewer',
          actionType: 'open-workspace',
          targetAOIId: targetPreset.id
        }
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <>
      {/* Dimming Backdrop for In-Page Expanded View */}
      {isOpen && isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 transition-opacity duration-200 animate-in fade-in"
          aria-label="Collapse full conversation"
        />
      )}

      {/* Floating Chatbox Widget / Launcher Container */}
      <div
        className={
          isOpen && isExpanded
            ? 'fixed inset-x-3 bottom-4 sm:inset-auto sm:bottom-5 sm:right-5 z-50 select-none flex justify-end pointer-events-none'
            : 'fixed bottom-5 right-5 z-50 select-none'
        }
      >
        {/* Floating Chatbox Window */}
        {isOpen && (
          <div
            className={`bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 transition-all duration-300 ease-out pointer-events-auto ${
              isExpanded
                ? 'w-full sm:w-[500px] md:w-[550px] h-[540px] max-h-[78vh] rounded-2xl'
                : 'mb-0 w-[315px] sm:w-[340px] h-[435px] rounded-2xl animate-in slide-in-from-bottom-5 duration-200'
            }`}
          >
            {/* Blue Top Accent Trim */}
            <div className="h-1 w-full bg-blue-600 shrink-0"></div>

            {/* Header */}
            <div className="px-3 py-2.5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-2.5">
                <OrbitMascot size="sm" mood={isProcessing ? 'analyzing' : 'idle'} showHalo={true} />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>AI Assistant</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {isExpanded && (
                      <span className="ml-1 text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        Full
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    Satellite AI Helper
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* View Full Conversation option in header (when user started chatting & not expanded) */}
                {hasStartedChatting && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-150 active:scale-[0.98]"
                    title="View Full Conversation within this page"
                  >
                    <Maximize2 className="w-3 h-3 text-blue-600" />
                    <span>Expand</span>
                  </button>
                )}

                {/* Return to Compact View option when expanded */}
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all duration-150 active:scale-[0.98]"
                    title="Return to compact chatbox"
                  >
                    <Minimize2 className="w-3 h-3 text-slate-600" />
                    <span>Compact</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150 active:scale-[0.98]"
                  title="Close Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs bg-slate-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {m.sender !== 'user' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5 px-1">
                      <OrbitMascot size="xs" mood="idle" showHalo={false} />
                      <span className="text-blue-600 font-semibold">Orbit</span>
                    </div>
                  )}
                  <div
                    className={`p-2.5 rounded-2xl ${isExpanded ? 'max-w-[82%]' : 'max-w-[88%]'} text-[11.5px] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-tr-sm shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {m.suggestedAction && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            const target = MOCK_AOI_PRESETS.find(p => p.id === m.suggestedAction?.targetAOIId) || MOCK_AOI_PRESETS[0];
                            setIsOpen(false);
                            setIsExpanded(false);
                            onNavigateToWorkspace(target);
                          }}
                          className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-semibold flex items-center gap-1 active:scale-[0.98] transition-colors"
                        >
                          <Compass className="w-3 h-3 text-blue-600" />
                          <span>{m.suggestedAction.label}</span>
                          <ArrowRight className="w-3 h-3 text-blue-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 px-2 py-1">
                  <OrbitMascot size="xs" mood="analyzing" showHalo={true} />
                  <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span>Analyzing query...</span>
                </div>
              )}

              {/* Option banner in conversation stream after chatting starts (compact mode) */}
              {hasStartedChatting && !isExpanded && !isProcessing && (
                <div className="pt-1.5 pb-0.5">
                  <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-[10.5px] text-slate-700 font-medium truncate">
                        Need more space?
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] shrink-0 flex items-center gap-1 active:scale-[0.98] transition-colors shadow-xs"
                    >
                      <span>Continue Chat</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Chips */}
            <div className="py-1.5 px-2 border-t border-slate-200 bg-white overflow-x-auto flex gap-1.5 text-[10px] shrink-0">
              {quickQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={isProcessing}
                  className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 whitespace-nowrap active:scale-[0.98] transition-all shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2 px-2.5 border-t border-slate-200 bg-white flex items-center gap-1.5 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about satellite images..."
                disabled={isProcessing}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isProcessing}
                className="p-1.5 sm:p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs active:scale-[0.98] disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Floating Launcher Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group pl-2.5 pr-4 py-2 rounded-full bg-white text-slate-900 font-semibold text-xs shadow-lg hover:shadow-xl border border-slate-200 flex items-center gap-2.5 transition-all duration-150 active:scale-[0.98] focus:outline-none hover:-translate-y-0.5 hover:border-blue-400"
            aria-label="Open SatQuery AI Chat"
          >
            <OrbitMascot size="sm" mood="idle" showHalo={true} />
            <span className="text-slate-900 font-semibold">Chat with AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        )}
      </div>
    </>
  );
};
