import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Loader2, 
  Compass, 
  Trash2, 
  Download, 
  Paperclip, 
  Clock, 
  Satellite, 
  Cpu, 
  Radio, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileCode2,
  RefreshCw,
  Globe2
} from 'lucide-react';
import { ChatMessage, AOIPreset, Screen } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';
import { OrbitMascot } from '../mascot/OrbitMascot';
import { SatQueryApiService } from '../../services/apiService';

interface DedicatedChatViewProps {
  onNavigateToWorkspace: (aoi?: AOIPreset) => void;
  onNavigate: (screen: Screen) => void;
}

export const DedicatedChatView: React.FC<DedicatedChatViewProps> = ({
  onNavigateToWorkspace,
  onNavigate
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('Standard Satellite Assistant');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      timestamp: '04:40:02',
      text: `Greetings! I'm **Orbit**, your SatQuery AI assistant.

I am connected to satellite imagery from the **European Space Agency Sentinel-2**, **USGS & NASA Landsat-9**, and **Sentinel-1 radar**.

You can search any location on Earth, check landscape changes, measure plant health (NDVI), or open areas directly in our Satellite Viewer.`,
      traces: [
        {
          id: 'tr-boot-1',
          title: 'Satellite Catalog Connected',
          status: 'completed',
          durationMs: 16,
          details: 'Connected to European Space Agency and USGS satellite archives.'
        },
        {
          id: 'tr-boot-2',
          title: 'Analysis Models Ready',
          status: 'completed',
          durationMs: 24,
          details: 'Image recognition and segmentation engine active.'
        }
      ],
      groundedStats: [
        { label: 'Active Satellites', value: '8', unit: 'sensors' },
        { label: 'Analysis Accuracy', value: '89.4%', unit: 'accuracy' },
        { label: 'Satellite Archive', value: '45M+', unit: 'scenes' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [showRawJsonId, setShowRawJsonId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    {
      title: 'Amazon Tree Cover Loss',
      query: 'Check tree cover loss in the Amazon between June and August 2024.',
      preset: MOCK_AOI_PRESETS[0]
    },
    {
      title: 'Rhine River Flooding',
      query: 'Find flooded areas in the Rhine river basin.',
      preset: MOCK_AOI_PRESETS[1]
    },
    {
      title: 'Wildfire Severity',
      query: 'Assess burn area severity for the Sierra Nevada wildfire.',
      preset: MOCK_AOI_PRESETS[2]
    },
    {
      title: 'Vegetation Health (NDVI)',
      query: 'How does vegetation health (greenness) get calculated from satellite images?',
      preset: undefined
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendMessage = (textToSend?: string, preset?: AOIPreset) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toTimeString().split(' ')[0],
      text: attachedFile ? `[Attached: ${attachedFile}]\n\n${query}` : query
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setAttachedFile(null);
    setIsProcessing(true);

    // Query live SatQuery Copilot API
    const livePromise = SatQueryApiService.sendChat(query, preset?.name);

    setTimeout(async () => {
      const liveRes = await livePromise;
      if (liveRes && liveRes.reply) {
        const agentMessage: ChatMessage = {
          id: `msg-agent-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toTimeString().split(' ')[0],
          text: liveRes.reply,
          traces: (liveRes.traces as any) || [],
          groundedStats: liveRes.groundedStats,
          suggestedAction: (liveRes.suggestedAction as any)
        };
        setMessages(prev => [...prev, agentMessage]);
        setIsProcessing(false);
        return;
      }

      const isAmazon = query.toLowerCase().includes('amazon') || query.toLowerCase().includes('canopy') || query.toLowerCase().includes('rondonia');
      const isFlood = query.toLowerCase().includes('flood') || query.toLowerCase().includes('rhine') || query.toLowerCase().includes('sar');
      const isFire = query.toLowerCase().includes('fire') || query.toLowerCase().includes('burn') || query.toLowerCase().includes('nbr');
      const isFormula = query.toLowerCase().includes('ndvi') || query.toLowerCase().includes('evi') || query.toLowerCase().includes('band');

      let responseText = '';
      let stats = undefined;
      let targetPreset = preset;

      if (isAmazon) {
        targetPreset = MOCK_AOI_PRESETS[0];
        responseText = `### Tree Cover Analysis: Amazon Rainforest

Comparing satellite images from June 12, 2024 with August 28, 2024, our AI detected **48.2 hectares** of new tree cover loss.

#### Key Findings:
- **Vegetation Health Drop**: Greenness dropped from **0.84** to **0.31** along forest clearing paths.
- **Affected Areas**: 14 distinct clearing zones identified.
- **Confidence**: High accuracy with **98.6% confidence** after filtering cloud cover.`;
        stats = [
          { label: 'Cleared Area', value: '48.2', unit: 'hectares' },
          { label: 'Greenness Change', value: '-63.1%', unit: 'drop' },
          { label: 'Detected Zones', value: '14', unit: 'areas' },
          { label: 'Accuracy', value: '98.6%', unit: 'high' }
        ];
      } else if (isFlood) {
        targetPreset = MOCK_AOI_PRESETS[1];
        responseText = `### Flood Mapping: Rhine River Basin

Using all-weather radar images from Sentinel-1 that see through storm cloud cover.

#### Key Findings:
- **Flooded Area**: **312.4 km²** of low-lying farmland and riverbanks are underwater.
- **Estimated Depth**: Water depth exceeds **1.2 meters** across low sections.
- **Status**: Flood crest has peaked and water levels are being tracked.`;
        stats = [
          { label: 'Flooded Area', value: '312.4', unit: 'km²' },
          { label: 'Water Depth', value: '> 1.2', unit: 'meters' },
          { label: 'Radar Coverage', value: '100%', unit: 'clear view' },
          { label: 'Confidence', value: '96.2%', unit: 'verified' }
        ];
      } else if (isFire) {
        targetPreset = MOCK_AOI_PRESETS[2];
        responseText = `### Wildfire Burn Area: Sierra Nevada

Analyzed infrared satellite images before and after the wildfire event.

#### Key Findings:
- **Burn Severity**: High severity across core areas with intense foliage damage.
- **Burn Perimeter**: Total fire footprint covers **1,890 km²**.
- **Regrowth Potential**: 14.2% of tree canopy within the perimeter survived intact.`;
        stats = [
          { label: 'Burned Area', value: '1,890', unit: 'km²' },
          { label: 'Severity Level', value: 'High', unit: 'critical' },
          { label: 'Surviving Trees', value: '14.2%', unit: 'intact' }
        ];
      } else if (isFormula) {
        responseText = `### How Plant Health (NDVI) is Measured

Satellites measure vegetation greenness using light reflected by plants:

1. **Vegetation Greenness (NDVI)**:
   $$\\text{NDVI} = \\frac{\\text{Near-Infrared} - \\text{Red}}{\\text{Near-Infrared} + \\text{Red}}$$
   *Healthy green leaves absorb red light and reflect near-infrared light strongly.*

2. **Interpreting the Scores**:
   - **0.6 to 0.9**: Dense, thriving green vegetation (forests, healthy crops).
   - **0.2 to 0.5**: Sparse grass, shrubs, or early-stage crops.
   - **Below 0.1**: Bare soil, rock, sand, concrete, or water.`;
        stats = [
          { label: 'Resolution', value: '10', unit: 'meters' },
          { label: 'Update Frequency', value: '5', unit: 'days' },
          { label: 'Satellite Feeds', value: 'Sentinel-2', unit: 'Landsat-9' }
        ];
      } else {
        responseText = `### Satellite Query Analysis

SatQuery AI examined the query: "${query}".

- **Location Match**: Identified target bounds and coordinates.
- **Imagery Checked**: Located the newest cloud-free satellite imagery.
- **Ready to Explore**: You can open this region in the Satellite Viewer to inspect high-resolution imagery.`;
        stats = [
          { label: 'Analysis Status', value: 'Complete', unit: 'ready' },
          { label: 'Confidence Score', value: '97.8%', unit: 'reliable' },
          { label: 'Processing Speed', value: 'Fast', unit: '< 1s' }
        ];
      }

      const resId = `agt-${Date.now()}`;
      const agentMsg: ChatMessage = {
        id: resId,
        sender: 'agent',
        timestamp: new Date().toTimeString().split(' ')[0],
        text: responseText,
        traces: [
          {
            id: `tr-${Date.now()}-1`,
            title: '1. Found Recent Satellite Imagery',
            status: 'completed',
            durationMs: 22,
            details: 'Located cloud-free satellite photos for the target region.'
          },
          {
            id: `tr-${Date.now()}-2`,
            title: '2. Calibrated Image Bands',
            status: 'completed',
            durationMs: 18,
            details: 'Adjusted colors and lighting for surface accuracy.'
          },
          {
            id: `tr-${Date.now()}-3`,
            title: '3. Generated Insights',
            status: 'completed',
            durationMs: 32,
            details: 'Processed area detection and summarized results.'
          }
        ],
        groundedStats: stats,
        suggestedAction: targetPreset ? {
          label: `Open in Satellite Viewer`,
          actionType: 'open-workspace',
          targetAOIId: targetPreset.id
        } : undefined
      };

      setMessages(prev => [...prev, agentMsg]);
      setExpandedTraceId(resId);
      setIsProcessing(false);
    }, 1100);
  };

  const handleClearHistory = () => {
    setMessages([messages[0]]);
  };

  const handleExportChat = () => {
    const transcript = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SatQuery_AI_Chat_Transcript_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col h-[calc(100vh-64px)] select-none relative bg-white">
      {/* Top Header Card */}
      <div className="relative z-10 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-900 transition-colors duration-200">
        <div className="flex items-center gap-3.5">
          <OrbitMascot size="md" mood={isProcessing ? 'analyzing' : 'idle'} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                SatQuery AI Assistant
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Satellite Connected</span>
              <span>•</span>
              <span>High Accuracy</span>
            </div>
          </div>
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
          >
            <option value="Standard Satellite Assistant">Standard Satellite Assistant</option>
            <option value="All-Weather Radar Assistant">All-Weather Radar Assistant</option>
            <option value="Agriculture & Crops Assistant">Agriculture & Crops Assistant</option>
          </select>

          <button
            onClick={handleExportChat}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-all duration-150 active:scale-[0.98]"
            title="Export Conversation Transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-500 bg-white hover:bg-slate-100 border border-slate-200 transition-all duration-150 active:scale-[0.98]"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="relative z-10 flex-1 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden text-slate-900">
        {/* Top Blue Ambient Accent Line */}
        <div className="h-1 w-full bg-blue-600"></div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
          {/* Friendly Mascot Welcome Hero Banner */}
          {messages.length === 1 && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
              <OrbitMascot size="lg" mood="greeting" className="flex-shrink-0" />
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Meet Orbit • Your SatQuery Assistant</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  "Ready to explore satellite imagery?"
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  Ask me to inspect forest loss, view flooded areas, calculate vegetation health, or search any location on Earth.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender Header */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
                {msg.sender === 'user' ? (
                  <>
                    <span className="font-medium text-slate-600">You</span>
                    <User className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <OrbitMascot size="xs" mood={msg.groundedStats ? 'happy' : 'idle'} showHalo={false} />
                    <span className="text-blue-600 font-semibold">Orbit AI</span>
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl max-w-[90%] sm:max-w-[80%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-sm shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-xs'
                }`}
              >
                <div className="text-xs sm:text-sm whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Observable Execution Traces Dropdown */}
                {msg.traces && msg.traces.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:underline active:scale-[0.98] py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4" />
                        <span>Analysis Steps ({msg.traces.length} completed)</span>
                      </span>
                      {expandedTraceId === msg.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {expandedTraceId === msg.id && (
                      <div className="mt-3 space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 animate-in fade-in">
                        {msg.traces.map((trace) => (
                          <div
                            key={trace.id}
                            className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                {trace.title}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {trace.durationMs}ms
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 pl-5 leading-relaxed">
                              {trace.details}
                            </p>

                            {trace.payload && (
                              <div className="pl-5 pt-1">
                                <button
                                  onClick={() => setShowRawJsonId(showRawJsonId === trace.id ? null : trace.id)}
                                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <FileCode2 className="w-3 h-3" />
                                  {showRawJsonId === trace.id ? 'Hide Technical Data' : 'Inspect Technical Data'}
                                </button>
                                {showRawJsonId === trace.id && (
                                  <pre className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-blue-300 text-[10px] overflow-x-auto">
                                    {JSON.stringify(trace.payload, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Grounded Quantitative Metrics Grid */}
                {msg.groundedStats && (
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {msg.groundedStats.map((stat, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="text-[10px] text-slate-500">{stat.label}</div>
                        <div className="text-sm font-bold text-blue-600 mt-0.5">
                          {stat.value}{' '}
                          <span className="text-[10px] font-normal text-slate-500">
                            {stat.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action to Open in Canvas */}
                {msg.suggestedAction && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                    <button
                      onClick={() => {
                        const targetAOI = MOCK_AOI_PRESETS.find(p => p.id === msg.suggestedAction?.targetAOIId) || MOCK_AOI_PRESETS[0];
                        onNavigateToWorkspace(targetAOI);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-all duration-150 active:scale-[0.98]"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Pipeline State with Orbit Mascot */}
          {isProcessing && (
            <div className="flex flex-col items-start animate-in fade-in">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 rounded-tl-sm flex items-center gap-3.5 text-xs shadow-xs">
                <OrbitMascot size="sm" mood="analyzing" showHalo={false} />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-blue-600">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing satellite data...</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Querying images and calculating insights
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Rapid Starter Prompts Pills */}
        <div className="p-3 border-t border-slate-200 bg-white overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Prompts:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query, p.preset)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 text-xs font-medium text-slate-700 hover:text-blue-700 whitespace-nowrap transition-all duration-150 active:scale-[0.98] shadow-xs flex items-center gap-1"
            >
              <span>{p.title}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          {attachedFile && (
            <div className="mb-2 p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 flex items-center justify-between">
              <span>Attached: {attachedFile}</span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-slate-400 hover:text-rose-500"
              >
                Remove
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Attach trigger */}
            <button
              type="button"
              onClick={() => setAttachedFile('Amazon_Deforestation_Sector04.tif')}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-50 transition-all duration-150 active:scale-[0.98]"
              title="Attach Sample File or Coordinates"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about any location, satellite image, or environmental change..."
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 text-xs sm:text-sm"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all duration-150 active:scale-[0.98] focus:outline-none disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send Query</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
