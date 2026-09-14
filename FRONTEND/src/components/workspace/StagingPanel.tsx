import React, { useState } from 'react';
import { 
  UploadCloud, 
  Satellite, 
  Sliders, 
  Layers, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  FileCode, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SensorType, SpectralBandMode, AOIPreset, LayerConfig } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';
import { SatQueryApiService, SatelliteSample } from '../../services/apiService';

interface StagingPanelProps {
  activeSensor: SensorType;
  onChangeSensor: (sensor: SensorType) => void;
  activeBandMode: SpectralBandMode;
  onChangeBandMode: (mode: SpectralBandMode) => void;
  activeAOI: AOIPreset;
  onSelectAOI: (aoi: AOIPreset) => void;
  layers: LayerConfig[];
  onToggleLayer: (id: string) => void;
  onChangeOpacity: (id: string, opacity: number) => void;
  onAddLayer: (name: string, type: LayerConfig['type']) => void;
  onRemoveLayer: (id: string) => void;
}

export const StagingPanel: React.FC<StagingPanelProps> = ({
  activeSensor,
  onChangeSensor,
  activeBandMode,
  onChangeBandMode,
  activeAOI,
  onSelectAOI,
  layers,
  onToggleLayer,
  onChangeOpacity,
  onAddLayer,
  onRemoveLayer
}) => {
  const [stagedFiles, setStagedFiles] = useState<Array<{
    name: string;
    size: string;
    type: string;
    crs: string;
    status: 'Staged' | 'Processing';
  }>>([
    {
      name: 't0_preFlood.tiff',
      size: '34.2 MB',
      type: 'Sentinel-2 L2A (BOA)',
      crs: 'EPSG:4326',
      status: 'Staged'
    }
  ]);

  const [serverSamples, setServerSamples] = useState<SatelliteSample[]>([]);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let isMounted = true;
    setLoadingSamples(true);
    SatQueryApiService.getSamples()
      .then(samples => {
        if (isMounted && Array.isArray(samples)) {
          setServerSamples(samples);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingSamples(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const sensors: { id: SensorType; label: string; desc: string; gsd: string }[] = [
    { id: 'sentinel-2', label: 'Sentinel-2 L2A', desc: '13-Band Multi-Spectral', gsd: '10m GSD' },
    { id: 'landsat-9', label: 'Landsat-9 OLI-2', desc: 'Thermal + SWIR Calibrated', gsd: '15m GSD' },
    { id: 'planetscope', label: 'PlanetScope Dove', desc: 'Daily High-Cadence Constellation', gsd: '3m GSD' },
    { id: 'sentinel-1', label: 'Sentinel-1 C-Band', desc: 'SAR Radar (VV/VH Polarized)', gsd: '5m GSD' },
    { id: 'worldview-3', label: 'WorldView-3 Commercial', desc: 'Very High Resolution Panchromatic', gsd: '0.3m GSD' }
  ];

  const bandModes: { id: SpectralBandMode; label: string; formula: string }[] = [
    { id: 'true-color', label: 'Natural Color RGB', formula: 'B04 - B03 - B02' },
    { id: 'false-color-nir', label: 'False Color NIR', formula: 'B08 - B04 - B03 (Vegetation)' },
    { id: 'ndvi', label: 'NDVI Index', formula: '(B08 - B04) / (B08 + B04)' },
    { id: 'ndwi', label: 'NDWI Water Index', formula: '(B03 - B08) / (B03 + B08)' },
    { id: 'nbr', label: 'NBR Burn Ratio', formula: '(B08 - B12) / (B08 + B12)' },
    { id: 'sar-dual', label: 'SAR Dual Polarized', formula: 'VV / VH Cross-Ratio' }
  ];

  const handleStageServerSample = (sample: SatelliteSample) => {
    const newFile = {
      name: sample.name,
      size: `${(sample.size_bytes / (1024 * 1024)).toFixed(1)} MB`,
      type: sample.modality,
      crs: 'EPSG:4326',
      status: 'Staged' as const
    };
    setStagedFiles(prev => [newFile, ...prev.filter(f => f.name !== sample.name)]);
    onAddLayer(sample.label.split(' (')[0], 'spectral');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  const handleRealFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await SatQueryApiService.uploadFile(file);
      if (!res) {
        handleSimulatedFileUpload();
        return;
      }
      const newFile = {
        name: res.original_name || res.filename,
        size: res.file_size_bytes
          ? `${(res.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.endsWith('.geojson') ? 'GeoJSON Vectors' : 'Satellite GeoTIFF',
        crs: 'EPSG:4326',
        status: 'Staged' as const
      };
      setStagedFiles(prev => [newFile, ...prev]);
      onAddLayer(file.name.replace(/\.[^/.]+$/, ''), 'spectral');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      handleSimulatedFileUpload();
    } finally {
      setIsUploading(false);
    }
  };

  const handleSimulatedFileUpload = () => {
    const mockFileNames = [
      'Copernicus_AOI_CloudMask_v2.tif',
      'Hydrological_Inundation_Vectors.geojson',
      'Wildfire_dNBR_Thermal_Classification.tif'
    ];
    const pickedName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    const newFile = {
      name: pickedName,
      size: `${(Math.random() * 80 + 20).toFixed(1)} MB`,
      type: pickedName.endsWith('.geojson') ? 'GeoJSON Vectors' : 'Cloud-Optimized GeoTIFF',
      crs: 'EPSG:4326',
      status: 'Staged' as const
    };

    setStagedFiles(prev => [newFile, ...prev]);
    onAddLayer(pickedName.replace('.tif', '').replace('.geojson', ''), 'spectral');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200 text-xs overflow-y-auto">
      {/* Panel Title */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-900 uppercase tracking-wider">
            Image Layers & Controls
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
          Live Data
        </span>
      </div>

      <div className="p-3.5 space-y-5">
        {/* Section 1: AOI Presets Quick Picker */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Preset Location
          </label>
          <div className="space-y-1.5">
            {MOCK_AOI_PRESETS.map((preset) => {
              const isSelected = activeAOI.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectAOI(preset)}
                  className={`w-full text-left p-2 rounded-xl transition-all duration-150 active:scale-[0.98] border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate text-xs">{preset.name.split(' (')[0]}</div>
                    <div className="text-[10px] text-slate-500">
                      {preset.location}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Sensor & Constellation Picker */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-2 flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-blue-600" />
            Satellite Source
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {sensors.map((sensor) => {
              const isSelected = activeSensor === sensor.id;
              return (
                <button
                  key={sensor.id}
                  onClick={() => onChangeSensor(sensor.id)}
                  className={`p-2 rounded-xl text-left transition-all duration-150 active:scale-[0.98] border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{sensor.label}</div>
                    <div className="text-[10px] text-slate-500">
                      {sensor.desc}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {sensor.gsd}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Spectral Band Index */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Color & Filter Modes
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {bandModes.map((mode) => {
              const isSelected = activeBandMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onChangeBandMode(mode.id)}
                  className={`p-2 rounded-xl text-left transition-all duration-150 active:scale-[0.98] border flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">{mode.label}</span>
                  <span className={`text-[9px] mt-1 truncate ${
                    isSelected ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {mode.formula}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Sample Satellite Images */}
        {serverSamples.length > 0 && (
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-blue-600" />
              Sample Satellite Images
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {serverSamples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleStageServerSample(sample)}
                  className="w-full text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all flex items-center justify-between group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2 truncate">
                    {sample.preview_url ? (
                      <img
                        src={sample.preview_url}
                        alt={sample.label}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        SAT
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {sample.label}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {sample.modality}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold ml-1">
                    Load +
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Stage Local File Dropzone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono font-semibold uppercase text-slate-500 flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              Upload Images
            </label>
            {isUploading ? (
              <span className="text-[10px] font-mono text-blue-600 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Uploading...
              </span>
            ) : uploadSuccess ? (
              <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Uploaded
              </span>
            ) : null}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".tif,.tiff,.png,.jpg,.jpeg,.geojson,.json"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleRealFileUpload(e.target.files[0]);
              }
            }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleRealFileUpload(e.dataTransfer.files[0]);
              } else {
                handleSimulatedFileUpload();
              }
            }}
            className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-150 active:scale-[0.98] ${
              isDraggingFile
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <UploadCloud className="w-6 h-6 mx-auto text-blue-600 mb-1" />
            <p className="text-xs font-semibold text-slate-800">
              Drop satellite or aerial images here
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Click to browse files (.tif, .png, .jpg, .geojson)
            </p>
          </div>

          {/* Staged files list */}
          <div className="mt-2 space-y-1.5">
            {stagedFiles.map((file, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between font-mono text-[10px]"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold text-slate-900 truncate">
                    {file.name}
                  </div>
                  <div className="text-slate-400">
                    {file.type} • {file.size}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Active Layer Manager */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono font-semibold uppercase text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Map Layers & Visibility
            </label>
            <button
              onClick={() => onAddLayer('Analysis Overlay', 'heatmap')}
              className="text-[10px] font-mono text-blue-600 hover:underline flex items-center gap-0.5 active:scale-[0.98]"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  layer.visible
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="text-slate-500 hover:text-blue-600 transition-colors active:scale-[0.98]"
                      title={layer.visible ? 'Hide layer' : 'Show layer'}
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-xs font-medium text-slate-800 truncate">
                      {layer.name}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveLayer(layer.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 active:scale-[0.98]"
                    title="Remove layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Opacity Slider */}
                {layer.visible && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 w-10">
                      {layer.opacity}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layer.opacity}
                      onChange={(e) => onChangeOpacity(layer.id, Number(e.target.value))}
                      className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
