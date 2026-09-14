import React, { useState, useRef, useEffect } from 'react';
import { 
  Sliders, 
  Target, 
  MapPin, 
  Eye, 
  Layers, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Compass, 
  Maximize2,
  Crosshair
} from 'lucide-react';
import { AOIPreset, SensorType, SpectralBandMode, LayerConfig } from '../../types';

interface GeospatialCanvasProps {
  activeAOI: AOIPreset;
  activeSensor: SensorType;
  activeBandMode: SpectralBandMode;
  layers: LayerConfig[];
  zoom: number;
  viewMode: 'split' | 'side-by-side' | 'overlay';
}

export const GeospatialCanvas: React.FC<GeospatialCanvasProps> = ({
  activeAOI,
  activeSensor,
  activeBandMode,
  layers,
  zoom,
  viewMode
}) => {
  const [splitPos, setSplitPos] = useState(50); // percentage (0-100)
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Cursor coordinates HUD
  const [cursorCoords, setCursorCoords] = useState({
    lat: activeAOI.coordinates[0],
    lng: activeAOI.coordinates[1],
    elev: 142,
    reflectance: 0.742
  });

  // Inspection tool state
  const [inspectedPoint, setInspectedPoint] = useState<{
    x: number;
    y: number;
    lat: number;
    lng: number;
    ndvi: number;
    classification: string;
    confidence: number;
    spectralBands: { name: string; val: number }[];
  } | null>({
    x: 42,
    y: 38,
    lat: activeAOI.coordinates[0] + 0.014,
    lng: activeAOI.coordinates[1] - 0.021,
    ndvi: 0.82,
    classification: 'Dense Equatorial Canopy',
    confidence: 98.4,
    spectralBands: [
      { name: 'B02 (Blue)', val: 0.041 },
      { name: 'B03 (Green)', val: 0.082 },
      { name: 'B04 (Red)', val: 0.038 },
      { name: 'B08 (NIR)', val: 0.584 },
      { name: 'B11 (SWIR)', val: 0.122 }
    ]
  });

  const [activeTimestamp, setActiveTimestamp] = useState<'T0' | 'T1'>('T1');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 1200, height: 800 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getCanvasBackgroundStyle = (visual: string): React.CSSProperties => {
    if (!visual) return { background: '#FFFFFF' };
    if (
      visual.startsWith('/') ||
      visual.startsWith('http') ||
      visual.startsWith('data:') ||
      visual.includes('.png') ||
      visual.includes('.tif') ||
      visual.includes('.jpg')
    ) {
      return {
        backgroundImage: `url(${visual})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return { background: visual };
  };

  // Update HUD coordinates on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingSplit) {
      const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSplitPos(Math.round(percent));
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }

    // Calculate simulated Lat/Lon from canvas bounds
    const latDelta = (y / rect.height - 0.5) * 0.1;
    const lngDelta = (x / rect.width - 0.5) * 0.1;

    setCursorCoords({
      lat: Number((activeAOI.coordinates[0] - latDelta).toFixed(4)),
      lng: Number((activeAOI.coordinates[1] + lngDelta).toFixed(4)),
      elev: Math.round(120 + ((x + y) % 90)),
      reflectance: Number((0.4 + (Math.sin(x * 0.02) * 0.3)).toFixed(3))
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current || isDraggingSplit || isPanning) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setInspectedPoint({
      x,
      y,
      lat: cursorCoords.lat,
      lng: cursorCoords.lng,
      ndvi: Number((Math.random() * 0.6 + 0.3).toFixed(2)),
      classification: x > 50 ? 'Detected Change Area' : 'Vegetation',
      confidence: Number((Math.random() * 8 + 91).toFixed(1)),
      spectralBands: [
        { name: 'Blue Band', val: Number((Math.random() * 0.05 + 0.02).toFixed(3)) },
        { name: 'Green Band', val: Number((Math.random() * 0.06 + 0.04).toFixed(3)) },
        { name: 'Red Band', val: Number((Math.random() * 0.08 + 0.03).toFixed(3)) },
        { name: 'Near-Infrared', val: Number((Math.random() * 0.4 + 0.4).toFixed(3)) },
        { name: 'Shortwave-IR', val: Number((Math.random() * 0.15 + 0.05).toFixed(3)) }
      ]
    });
  };

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
      className="relative flex-1 h-full w-full bg-white overflow-hidden select-none cursor-crosshair"
    >
      {/* Background Geospatial Canvas World with simulated Pan/Zoom */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-75 origin-center"
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`
        }}
      >
        {/* Layer 1: After / AI Inference Layer (Full width underneath) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={getCanvasBackgroundStyle(activeTimestamp === 'T0' ? activeAOI.beforeVisual : activeAOI.afterVisual)}
        >
          {/* Detailed synthetic geospatial textures */}
          <div className="absolute inset-0 geo-grid-pattern opacity-25"></div>

          {/* AI Segmentation Feature Polygons & Vector Bounding Boxes */}
          {activeAOI.id === 'godavari-flood' || activeAOI.id === 'sentinel1-godavari-sar' ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Anomaly Box 1 - Godavari Inundation Zone */}
              <div className="absolute top-[22%] left-[26%] w-[320px] h-[220px] border-2 border-blue-600 bg-blue-600/10 rounded-xl p-3 flex flex-col justify-between shadow-md backdrop-blur-[1px]">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-bold">
                    Flooded Area Detected
                  </span>
                  <span className="text-blue-800 font-bold">71,105 ha</span>
                </div>
                <div className="space-y-0.5 text-[10px] font-mono text-slate-800">
                  <div>Confidence: 99.1% • AI Verified</div>
                  <div className="text-emerald-700 font-semibold">Water Index Confirmed</div>
                </div>
              </div>

              {/* Anomaly Box 2 - Submerged Cropland Risk */}
              <div className="absolute bottom-[20%] right-[22%] w-[260px] h-[160px] border-2 border-amber-500 bg-amber-500/10 rounded-xl p-3 flex flex-col justify-between shadow-md backdrop-blur-[1px]">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-800 text-white font-bold">
                    Flooded Farmland Risk
                  </span>
                  <span className="text-amber-800 font-semibold">24,380 ha</span>
                </div>
                <div className="text-[10px] font-mono text-slate-800">
                  Water Depth &gt; 1.4m
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Anomaly Box 1 */}
              <div className="absolute top-[28%] left-[34%] w-[250px] h-[160px] border-2 border-blue-600 bg-blue-600/10 rounded-xl p-3 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-blue-900 text-white font-bold">
                    Tree Cover Loss Area
                  </span>
                  <span className="text-blue-800 font-semibold">48.2 ha</span>
                </div>
                <div className="text-[10px] font-mono text-slate-800">
                  Confidence: 98.6% • High Accuracy Model
                </div>
              </div>

              {/* Anomaly Box 2 */}
              <div className="absolute bottom-[22%] right-[28%] w-[220px] h-[130px] border-2 border-amber-500 bg-amber-500/10 rounded-xl p-3 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-800 text-white font-bold">
                    Flooded Zone
                  </span>
                  <span className="text-amber-800 font-semibold">112 ha</span>
                </div>
                <div className="text-[10px] font-mono text-slate-800">
                  Water Depth &gt; 1.2m
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Layer 2: Before / Baseline Imagery (Clipped if in split mode) */}
        {viewMode !== 'overlay' && (
          <div
            className="absolute inset-0 h-full overflow-hidden pointer-events-none z-10"
            style={{
              width: viewMode === 'split' ? `${splitPos}%` : '50%'
            }}
          >
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: canvasDimensions.width || '100%',
                ...getCanvasBackgroundStyle(activeAOI.beforeVisual)
              }}
            >
              <div className="absolute inset-0 geo-grid-pattern opacity-20"></div>
              {/* Natural terrain river vectors */}
              <svg className="absolute inset-0 w-full h-full opacity-30 stroke-blue-400 fill-none" strokeWidth="2">
                <path d="M 0 300 Q 250 350 450 200 T 900 350 T 1400 250" />
                <path d="M 100 0 Q 300 220 500 450 T 700 800" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        )}

        {/* Draggable Split Slider Handle in Split Mode */}
        {viewMode === 'split' && (
          <div
            onPointerDown={(e) => {
              setIsDraggingSplit(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
              setIsDraggingSplit(false);
              try {
                e.currentTarget.releasePointerCapture(e.pointerId);
              } catch {
                // ignore
              }
            }}
            className="absolute top-0 bottom-0 w-1 bg-blue-600 z-30 shadow-md cursor-ew-resize"
            style={{ left: `${splitPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
              <Sliders className="w-4 h-4 rotate-90" />
            </div>
          </div>
        )}

        {/* Ground Inspection Tooltip */}
        {inspectedPoint && (
          <div
            className="absolute z-40 p-3 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xl pointer-events-auto font-mono text-xs w-64 animate-in fade-in"
            style={{
              left: `${inspectedPoint.x}%`,
              top: `${inspectedPoint.y}%`,
              transform: 'translate(-50%, -115%)'
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
              <span className="font-bold text-blue-600 flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" />
                Area Details
              </span>
              <span className="text-[10px] px-1 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {inspectedPoint.confidence}%
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                  {inspectedPoint.classification}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vegetation Index:</span>
                <span className="font-bold text-emerald-600">{inspectedPoint.ndvi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coordinates:</span>
                <span>{inspectedPoint.lat}°, {inspectedPoint.lng}°</span>
              </div>
            </div>

            {/* Band distribution bars */}
            <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">
                Color & Light Values
              </div>
              {inspectedPoint.spectralBands.map((band, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-20 truncate text-slate-600">{band.name}</span>
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(100, band.val * 120)}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right font-mono text-slate-700">{band.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY HUD CONTROLS */}

      {/* Top Left: Active Sensor & Band HUD */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-800 flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>{activeSensor.toUpperCase()}</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-semibold">{activeBandMode.toUpperCase()}</span>
          <span className="text-slate-300">|</span>
          <span>Map Coords</span>
        </div>
      </div>

      {/* Top Right: Live Cursor Readout HUD */}
      <div className="absolute top-3 right-3 z-30 pointer-events-none">
        <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-800 space-y-0.5 shadow-sm">
          <div className="flex items-center gap-3">
            <span>LAT: <strong className="text-slate-900">{cursorCoords.lat}°</strong></span>
            <span>LON: <strong className="text-slate-900">{cursorCoords.lng}°</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span>ELEV: {cursorCoords.elev}m</span>
            <span>Reflectance: {cursorCoords.reflectance}</span>
            <span>Res: 0.5m</span>
          </div>
        </div>
      </div>

      {/* Bottom Left: Visual Classification Legend */}
      <div className="absolute bottom-3 left-3 z-30 p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800 shadow-sm space-y-1.5 pointer-events-auto">
        <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
          <Layers className="w-3 h-3 text-blue-600" />
          Map Legend
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span>
            <span>Dense Forest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
            <span>Tree Disturbance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
            <span>Open Water</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-600"></span>
            <span>Burn Area</span>
          </div>
        </div>
      </div>

      {/* Bottom Center: Multi-Temporal Scrubber */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 p-1 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-1 text-xs font-mono pointer-events-auto">
        <button
          onClick={() => setActiveTimestamp('T0')}
          className={`px-3 py-1 rounded-lg transition-all duration-150 active:scale-[0.98] ${
            activeTimestamp === 'T0'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Before: June Image
          </span>
        </button>

        <button
          onClick={() => setActiveTimestamp('T1')}
          className={`px-3 py-1 rounded-lg transition-all duration-150 active:scale-[0.98] ${
            activeTimestamp === 'T1'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            After: August Image
          </span>
        </button>
      </div>
    </div>
  );
};
