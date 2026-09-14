import React, { useState } from 'react';
import { WorkspaceHeader } from './WorkspaceHeader';
import { StagingPanel } from './StagingPanel';
import { GeospatialCanvas } from './GeospatialCanvas';
import { AgentChatbox } from './AgentChatbox';
import { AOIPreset, SensorType, SpectralBandMode, LayerConfig } from '../../types';
import { INITIAL_LAYERS, MOCK_AOI_PRESETS } from '../../data/mockData';
import { CheckCircle2, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface WorkspaceViewProps {
  initialAOI?: AOIPreset;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ initialAOI }) => {
  const [activeAOI, setActiveAOI] = useState<AOIPreset>(initialAOI || MOCK_AOI_PRESETS[0]);
  const [activeSensor, setActiveSensor] = useState<SensorType>(activeAOI.recommendedSensor);
  const [activeBandMode, setActiveBandMode] = useState<SpectralBandMode>('true-color');
  const [layers, setLayers] = useState<LayerConfig[]>(INITIAL_LAYERS);
  const [zoom, setZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'overlay'>('split');

  // Pane collapse states for maximum geospatial canvas flexibility
  const [leftPaneOpen, setLeftPaneOpen] = useState(true);
  const [rightPaneOpen, setRightPaneOpen] = useState(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectAOI = (aoi: AOIPreset) => {
    setActiveAOI(aoi);
    setActiveSensor(aoi.recommendedSensor);
    showToast(`Staged AOI: ${aoi.name}`);
  };

  const handleToggleLayer = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const handleChangeOpacity = (id: string, opacity: number) => {
    setLayers(layers.map(l => l.id === id ? { ...l, opacity } : l));
  };

  const handleAddLayer = (name: string, type: LayerConfig['type']) => {
    const newLayer: LayerConfig = {
      id: `l-${Date.now()}`,
      name,
      type,
      visible: true,
      opacity: 80,
      blendMode: 'normal'
    };
    setLayers([...layers, newLayer]);
    showToast(`Added layer: ${name}`);
  };

  const handleRemoveLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  const handleExportReport = () => {
    const reportData = {
      aoi: activeAOI.name,
      location: activeAOI.location,
      sensor: activeSensor,
      spectralIndex: activeBandMode,
      timestamp: new Date().toISOString(),
      layersStaged: layers.filter(l => l.visible).map(l => l.name),
      summary: activeAOI.description
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SatQuery_Report_${activeAOI.id}_${Date.now()}.json`;
    a.click();
    showToast('Exported complete geospatial briefing JSON');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-53px)] w-full overflow-hidden bg-white text-slate-900">
      {/* Top Header */}
      <WorkspaceHeader
        activeAOI={activeAOI}
        activeSensor={activeSensor}
        zoom={zoom}
        onZoomIn={() => setZoom(prev => Math.min(4, Number((prev + 0.25).toFixed(2))))}
        onZoomOut={() => setZoom(prev => Math.max(0.5, Number((prev - 0.25).toFixed(2))))}
        onResetView={() => setZoom(1)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onExportReport={handleExportReport}
      />

      {/* 3-Pane Geospatial Workspace Body */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* PANE 1: LEFT STAGING PANEL */}
        <div
          className={`transition-all duration-200 h-full relative z-20 flex-shrink-0 ${
            leftPaneOpen ? 'w-[320px] lg:w-[350px]' : 'w-0'
          }`}
        >
          {leftPaneOpen && (
            <StagingPanel
              activeSensor={activeSensor}
              onChangeSensor={setActiveSensor}
              activeBandMode={activeBandMode}
              onChangeBandMode={setActiveBandMode}
              activeAOI={activeAOI}
              onSelectAOI={handleSelectAOI}
              layers={layers}
              onToggleLayer={handleToggleLayer}
              onChangeOpacity={handleChangeOpacity}
              onAddLayer={handleAddLayer}
              onRemoveLayer={handleRemoveLayer}
            />
          )}

          {/* Toggle Button for Left Pane */}
          <button
            onClick={() => setLeftPaneOpen(!leftPaneOpen)}
            className="absolute -right-3 top-4 z-30 w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-600 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title={leftPaneOpen ? 'Collapse Panel' : 'Expand Panel'}
          >
            {leftPaneOpen ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* PANE 2: CENTER INTERACTIVE GEOSPATIAL CANVAS */}
        <div className="flex-1 h-full relative overflow-hidden flex">
          <GeospatialCanvas
            activeAOI={activeAOI}
            activeSensor={activeSensor}
            activeBandMode={activeBandMode}
            layers={layers}
            zoom={zoom}
            viewMode={viewMode}
          />
        </div>

        {/* PANE 3: RIGHT AGENT CHATBOX */}
        <div
          className={`transition-all duration-200 h-full relative z-20 flex-shrink-0 ${
            rightPaneOpen ? 'w-[360px] lg:w-[410px]' : 'w-0'
          }`}
        >
          {/* Toggle Button for Right Pane */}
          <button
            onClick={() => setRightPaneOpen(!rightPaneOpen)}
            className="absolute -left-3 top-4 z-30 w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-600 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title={rightPaneOpen ? 'Collapse Chat' : 'Expand Chat'}
          >
            {rightPaneOpen ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>

          {rightPaneOpen && (
            <AgentChatbox
              activeAOI={activeAOI}
              onHighlightFeature={() => showToast('Highlighted active area in viewer')}
              onExportGeoJSON={() => {
                const geoJsonData = {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {
                        id: 'anomaly-01',
                        aoi: activeAOI.name,
                        area_ha: 48.2,
                        confidence: 0.986,
                        class: 'Canopy Loss Area'
                      },
                      geometry: {
                        type: 'Polygon',
                        coordinates: [
                          [
                            [activeAOI.coordinates[1] - 0.02, activeAOI.coordinates[0] - 0.02],
                            [activeAOI.coordinates[1] + 0.02, activeAOI.coordinates[0] - 0.02],
                            [activeAOI.coordinates[1] + 0.02, activeAOI.coordinates[0] + 0.02],
                            [activeAOI.coordinates[1] - 0.02, activeAOI.coordinates[0] + 0.02],
                            [activeAOI.coordinates[1] - 0.02, activeAOI.coordinates[0] - 0.02]
                          ]
                        ]
                      }
                    }
                  ]
                };
                const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `SatQuery_${activeAOI.id}_Features.geojson`;
                a.click();
                showToast('Exported GeoJSON feature data');
              }}
            />
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
