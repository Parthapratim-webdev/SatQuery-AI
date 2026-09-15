import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sliders, 
  Download
} from 'lucide-react';
import { AnalysisResultData } from '../../types';
import { SatQueryApiService } from '../../services/apiService';

interface EvidenceViewerProps {
  result: AnalysisResultData;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ result }) => {
  const [zoom, setZoom] = useState(1);
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'mask-overlay'>('split');
  const [maskVisible, setMaskVisible] = useState(true);
  const [maskOpacity, setMaskOpacity] = useState(80);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const evidence = result.evidence;

  const getVisualBackground = (visual?: string, fallback: string = 'linear-gradient(135deg, #0f172a, #1e293b)') => {
    if (!visual) return fallback;
    const resolved = visual.startsWith('/api/') ? SatQueryApiService.getFullUrl(visual) : visual;
    if (resolved.startsWith('http') || resolved.startsWith('/') || resolved.startsWith('data:')) {
      return `url("${resolved}") center/cover no-repeat`;
    }
    return resolved;
  };

  const getFullArtifactUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return SatQueryApiService.getFullUrl(url);
  };


  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(rect.width - 5, e.clientX - rect.left));
    const percent = (x / rect.width) * 100;
    setSplitPos(Math.round(percent));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handleDownloadEvidence = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SatQuery_Evidence_${result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Evidence Viewer Controls Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Comparison Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Split Slider
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('mask-overlay')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'mask-overlay'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mask Overlay
          </button>
        </div>

        {/* Zoom & Layer Toggles */}
        <div className="flex items-center gap-2">
          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
            <button
              onClick={() => setZoom(prev => Math.min(3, Number((prev + 0.25).toFixed(2))))}
              className="p-1.5 rounded text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-bold text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.max(0.5, Number((prev - 0.25).toFixed(2))))}
              className="p-1.5 rounded text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 rounded text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mask Visibility Toggle */}
          <button
            onClick={() => setMaskVisible(!maskVisible)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              maskVisible
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {maskVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Highlight Mask</span>
          </button>

          {/* Download Evidence JSON */}
          <button
            onClick={handleDownloadEvidence}
            className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            title="Download Evidence"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* VIEWPORT CANVAS (Depending on Task Type & viewMode) */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        {/* SPLIT SLIDER VIEW */}
        {viewMode === 'split' && (
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative h-[420px] sm:h-[480px] w-full select-none overflow-hidden cursor-ew-resize group"
          >
            {/* Background Layer: After / Result Image */}
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-75"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                background: getVisualBackground(
                  evidence.changeMap?.visual ||
                  result.urls?.overlay_url ||
                  result.urls?.mask_url ||
                  result.urls?.heatmap_url ||
                  evidence.fusedResult?.visual ||
                  evidence.imageB?.visual ||
                  evidence.imageA?.visual
                )
              }}
            >
              <div className="absolute inset-0 geo-grid-pattern opacity-40" />

              {/* Bounding Boxes if Grounding */}
              {maskVisible && evidence.boundingBoxes && (
                <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center">
                  {evidence.boundingBoxes.map(bb => (
                    <div
                      key={bb.id}
                      style={{
                        position: 'absolute',
                        left: `${bb.x}%`,
                        top: `${bb.y}%`,
                        width: `${bb.width}%`,
                        height: `${bb.height}%`,
                        borderColor: bb.color,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        backgroundColor: `${bb.color}22`
                      }}
                      className="rounded-lg transition-all pointer-events-auto group/box"
                    >
                      <span
                        style={{ backgroundColor: bb.color }}
                        className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold text-slate-950 font-mono shadow-md"
                      >
                        {bb.label} ({bb.confidence}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Right Tag Label */}
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-lg backdrop-blur-sm pointer-events-none">
                <span className="font-bold">
                  {evidence.changeMap?.label || evidence.fusedResult?.label || evidence.imageB?.label || 'AI Analysis Output'}
                </span>
              </div>
            </div>

            {/* Foreground Layer: Baseline / Raw Image */}
            <div
              className="absolute inset-0 h-full overflow-hidden pointer-events-none transition-transform duration-75"
              style={{
                width: `${splitPos}%`,
                transform: `scale(${zoom})`,
                transformOrigin: 'left center'
              }}
            >
              <div
                className="absolute inset-0 h-full"
                style={{
                  width: `${containerWidth}px`,
                  background: getVisualBackground(evidence.imageA?.visual, 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)')
                }}
              >
                <div className="absolute inset-0 geo-grid-pattern opacity-30" />

                <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 text-slate-300 font-mono text-xs shadow-lg backdrop-blur-sm">
                  <span className="font-bold">
                    {evidence.imageA?.label || 'Baseline Raw Imagery'}
                  </span>
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-blue-600 z-30 shadow-sm"
              style={{ left: `${splitPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-white shadow-md flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Top Chip */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[11px] text-slate-300 backdrop-blur-sm pointer-events-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Split: {splitPos}% / {100 - splitPos}%</span>
              <span>•</span>
              <span>Zoom: {Math.round(zoom * 100)}%</span>
            </div>
          </div>
        )}

        {/* SIDE-BY-SIDE VIEW */}
        {viewMode === 'side-by-side' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-[420px] sm:h-[480px]">
            {/* Left Image */}
            <div
              className="h-full rounded-xl relative overflow-hidden border border-slate-700 flex flex-col justify-between p-4"
              style={{ background: getVisualBackground(evidence.imageA?.visual, 'linear-gradient(135deg, #1e293b, #334155)') }}
            >
              <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />
              <span className="relative z-10 px-2.5 py-1 rounded bg-slate-950/80 text-xs text-slate-300 self-start">
                {evidence.imageA?.label || 'Input Image A'}
              </span>
              <span className="relative z-10 text-[11px] text-slate-400">
                Date: {evidence.imageA?.date || 'Historical Baseline'}
              </span>
            </div>

            {/* Right Image */}
            <div
              className="h-full rounded-xl relative overflow-hidden border border-blue-300 flex flex-col justify-between p-4"
              style={{
                background: getVisualBackground(
                  evidence.changeMap?.visual ||
                  result.urls?.overlay_url ||
                  result.urls?.mask_url ||
                  result.urls?.heatmap_url ||
                  evidence.fusedResult?.visual ||
                  evidence.imageB?.visual ||
                  evidence.imageA?.visual,
                  'linear-gradient(135deg, #0f172a, #0369a1)'
                )
              }}
            >
              <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />

              {/* Bounding Boxes in Side-by-Side View */}
              {maskVisible && evidence.boundingBoxes && (
                <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex items-center justify-center">
                  {evidence.boundingBoxes.map(bb => (
                    <div
                      key={bb.id}
                      style={{
                        position: 'absolute',
                        left: `${bb.x}%`,
                        top: `${bb.y}%`,
                        width: `${bb.width}%`,
                        height: `${bb.height}%`,
                        borderColor: bb.color,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        backgroundColor: `${bb.color}25`
                      }}
                      className="rounded-lg transition-all pointer-events-auto group/box"
                    >
                      <span
                        style={{ backgroundColor: bb.color }}
                        className="absolute -top-5 left-0 px-2 py-0.5 rounded text-[10px] font-bold text-slate-950 font-mono shadow-md whitespace-nowrap"
                      >
                        {bb.label} {bb.confidence && !bb.label.includes('%') ? `(${bb.confidence}%)` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <span className="relative z-10 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-xs text-blue-700 font-bold self-start">
                {evidence.changeMap?.label || evidence.fusedResult?.label || evidence.imageB?.label || (result.urls?.overlay_url ? 'AI Detection Overlay' : 'Evidence Mask')}
              </span>
              <span className="relative z-10 text-[11px] text-blue-600 font-semibold">
                Confidence: {result.confidence}% Verified
              </span>
            </div>
          </div>
        )}

        {/* MASK OVERLAY VIEW */}
        {viewMode === 'mask-overlay' && (
          <div
            className="relative h-[420px] sm:h-[480px] w-full overflow-hidden p-6 flex flex-col justify-between"
            style={{ background: getVisualBackground(evidence.imageA?.visual, 'linear-gradient(135deg, #1e293b, #334155)') }}
          >
            <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />

            {/* Overlay Mask */}
            {maskVisible && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                style={{
                  background: getVisualBackground(
                    evidence.changeMap?.visual ||
                    result.urls?.overlay_url ||
                    result.urls?.mask_url ||
                    result.urls?.heatmap_url ||
                    evidence.fusedResult?.visual,
                    'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(245,158,11,0.3))'
                  ),
                  opacity: maskOpacity / 100
                }}
              />
            )}

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-slate-950/80 text-xs text-slate-300">
                Overlay Mode
              </span>

              {/* Opacity slider */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/90 border border-slate-700 text-xs text-slate-300">
                <span>Opacity: {maskOpacity}%</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={maskOpacity}
                  onChange={(e) => setMaskOpacity(Number(e.target.value))}
                  className="w-20 accent-blue-600"
                />
              </div>
            </div>

            <div className="relative z-10 p-3 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-slate-300">
              {evidence.changeMap?.legend || 'AI Detection Mask displayed over satellite imagery'}
            </div>
          </div>
        )}
      </div>

      {/* Quantitative Findings Stats Row */}
      {evidence.stats && evidence.stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {evidence.stats.map((st, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white border border-slate-200 text-xs"
            >
              <div className="text-[10px] uppercase text-slate-400 font-semibold">{st.label}</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {st.value}
              </div>
              {st.delta && (
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                  {st.delta}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Generated Prediction Artifacts & Deliverables */}
      {(result.urls || result.artifacts) && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Generated Analysis Files:</span>
            <span className="text-[10px] text-slate-500">Ready for download</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {result.urls?.overlay_url && (
              <a
                href={getFullArtifactUrl(result.urls.overlay_url)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>🖼️</span> <span>Visual Overlay</span>
              </a>
            )}
            {result.urls?.heatmap_url && (
              <a
                href={getFullArtifactUrl(result.urls.heatmap_url)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>🔥</span> <span>Confidence Heatmap</span>
              </a>
            )}
            {result.urls?.mask_url && (
              <a
                href={getFullArtifactUrl(result.urls.mask_url)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>⬛</span> <span>Detection Mask</span>
              </a>
            )}
            {result.urls?.report_markdown_url && (
              <a
                href={getFullArtifactUrl(result.urls.report_markdown_url)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>📄</span> <span>Inspection Report (.md)</span>
              </a>
            )}
            {result.urls?.geojson_url && (
              <a
                href={getFullArtifactUrl(result.urls.geojson_url)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>🗺️</span> <span>GeoJSON Map Data</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>

  );
};
