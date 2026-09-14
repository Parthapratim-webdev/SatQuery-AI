import React from 'react';
import { 
  Compass, 
  Split, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Share2, 
  Sliders, 
  Check, 
  Maximize2
} from 'lucide-react';
import { AOIPreset, SensorType } from '../../types';

interface WorkspaceHeaderProps {
  activeAOI: AOIPreset;
  activeSensor: SensorType;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  viewMode: 'split' | 'side-by-side' | 'overlay';
  onChangeViewMode: (mode: 'split' | 'side-by-side' | 'overlay') => void;
  onExportReport: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  activeAOI,
  activeSensor,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  viewMode,
  onChangeViewMode,
  onExportReport
}) => {
  return (
    <div className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between gap-4 select-none">
      {/* Left: Active AOI Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {activeAOI.name}
            </h1>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200">
              {activeSensor}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {activeAOI.coordinates[0].toFixed(3)}°N, {activeAOI.coordinates[1].toFixed(3)}°W • {activeAOI.areaKm2.toLocaleString()} km²
          </p>
        </div>
      </div>

      {/* Center: View Mode Toggle */}
      <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
        <button
          onClick={() => onChangeViewMode('split')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
            viewMode === 'split'
              ? 'bg-white text-blue-600 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>Split Slider</span>
        </button>

        <button
          onClick={() => onChangeViewMode('side-by-side')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
            viewMode === 'side-by-side'
              ? 'bg-white text-blue-600 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Side-by-Side</span>
        </button>

        <button
          onClick={() => onChangeViewMode('overlay')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
            viewMode === 'overlay'
              ? 'bg-white text-blue-600 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Overlay</span>
        </button>
      </div>

      {/* Right: Map Controls & Export */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200 p-0.5">
          <button
            onClick={onZoomOut}
            className="p-1 rounded text-slate-600 hover:bg-white transition-all duration-150 active:scale-[0.98] cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[11px] text-slate-600 select-none font-semibold">
            {zoom}x
          </span>
          <button
            onClick={onZoomIn}
            className="p-1 rounded text-slate-600 hover:bg-white transition-all duration-150 active:scale-[0.98] cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onResetView}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-150 active:scale-[0.98] cursor-pointer"
          title="Reset View Position"
          aria-label="Reset View Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportReport}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Analysis</span>
        </button>
      </div>
    </div>
  );
};
