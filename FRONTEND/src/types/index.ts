export type Theme = 'dark' | 'light';

export type Screen = 'landing' | 'showcase' | 'dashboard' | 'workspace' | 'settings' | 'chat' | 'auth' | 'login' | 'signup' | 'forgot-password';

export type SensorType = 
  | 'sentinel-2' 
  | 'landsat-9' 
  | 'planetscope' 
  | 'sentinel-1' 
  | 'worldview-3';

export type SpectralBandMode = 
  | 'true-color' 
  | 'false-color-nir' 
  | 'ndvi' 
  | 'ndwi' 
  | 'nbr' 
  | 'sar-dual';

export interface AOIPreset {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  bounds: [[number, number], [number, number]];
  areaKm2: number;
  recommendedSensor: SensorType;
  primaryMetric: string;
  metricValue: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  beforeVisual: string;
  afterVisual: string;
}

export interface LayerConfig {
  id: string;
  name: string;
  type: 'base' | 'spectral' | 'mask' | 'vector' | 'heatmap';
  visible: boolean;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export interface ExecutionTraceStep {
  id: string;
  title: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  durationMs: number;
  details: string;
  payload?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  traces?: ExecutionTraceStep[];
  groundedStats?: {
    label: string;
    value: string;
    unit?: string;
  }[];
  suggestedAction?: {
    label: string;
    actionType: 'highlight-scar' | 'switch-ndvi' | 'export-geojson' | 'zoom-anomaly' | 'open-workspace';
    targetAOIId?: string;
  };
}

export interface BenchmarkItem {
  id: string;
  model: string;
  task: string;
  dataset: string;
  mIoU: number;
  f1Score: number;
  latencyMs: number;
  resolutionGSD: string;
  hardware: string;
}

export interface RecentAnalysis {
  id: string;
  title: string;
  aoiName: string;
  sensor: SensorType;
  date: string;
  areaKm2: number;
  confidence: number;
  status: 'Completed' | 'Processing' | 'Flagged';
  anomalyCount: number;
  spectralIndex: SpectralBandMode;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  fullKey?: string;
  role: 'Admin' | 'Read/Analyze' | 'Inference-Only';
  created: string;
  lastUsed: string;
  requestsCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  organization: string;
  role: string;
  stacTier: string;
  quotaUsedGb: number;
  quotaMaxGb: number;
  avatarUrl?: string;
}

export interface ModelConfidenceSettings {
  detectionThreshold: number; // 0 to 100
  cloudMaskStrictness: 'loose' | 'balanced' | 'aggressive';
  superResolution: boolean;
  driftSensitivity: number; // 0 to 100
  preferredProjection: 'EPSG:4326' | 'EPSG:3857' | 'UTM-Auto';
  autoCogOptimization: boolean;
}

/* ========================================================================= */
/* SATQUERY AI DESIGN.MD SPECIFICATION TYPES                                 */
/* ========================================================================= */

export type DashboardView = 
  | 'new-analysis' 
  | 'models'
  | 'chat'
  | 'workspace'
  | 'history' 
  | 'reports' 
  | 'settings';

export type AnalysisTaskType = 
  | 'vqa' 
  | 'captioning' 
  | 'grounding' 
  | 'change-analysis' 
  | 'change-vqa' 
  | 'optical-sar';

export type ImageAnalysisMode = 
  | 'single' 
  | 'bi-temporal' 
  | 'optical-sar';

export interface UploadedImageMeta {
  id: string;
  name: string;
  format: 'GeoTIFF' | 'TIFF' | 'PNG' | 'JPEG';
  dimensions: string;
  modality: 'Optical' | 'Radar' | 'Optical BOA' | 'SAR VV/VH' | 'Panchromatic' | 'SWIR / NBR' | string;
  acquisitionDate: string;
  sizeMb: number;
  validationStatus: 'Valid Satellite Image' | 'Valid Radar Image' | 'Valid Image' | 'Valid GeoTIFF' | 'Valid SAR C-Band' | 'Valid Benchmark Image' | 'Error' | string;
  previewVisual?: string;
  previewUrl?: string;
  fileObject?: File;
  serverPath?: string;
}


export interface AgentProcessStep {
  id: string;
  title: string;
  detail?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface AnalysisResultData {
  id: string;
  query: string;
  task: string;
  taskType: AnalysisTaskType;
  mode: ImageAnalysisMode;
  answer: string;
  confidence: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  timestamp: string;
  modelsUsed: string[];
  executionSummary: {
    task: string;
    inputSummary: string;
    selectedTools: string[];
    pipeline: string[];
    latencyMs: number;
    status: 'Completed' | 'Failed';
    details?: string;
  };
  evidence: {
    type: AnalysisTaskType;
    imageA?: { visual: string; label: string; date?: string; bounds?: string };
    imageB?: { visual: string; label: string; date?: string; bounds?: string };
    changeMap?: { visual: string; label: string; legend?: string };
    fusedResult?: { visual: string; label: string; details?: string };
    boundingBoxes?: Array<{
      id: string;
      label: string;
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      confidence: number;
    }>;
    stats?: Array<{ label: string; value: string; delta?: string }>;
  };
  artifacts?: Record<string, string>;
  urls?: Record<string, string>;
}


export interface ModelToolCardInfo {
  id: string;
  name: string;
  taskType: AnalysisTaskType;
  description: string;
  status: 'Ready' | 'Active' | 'Optimized';
  supportedInput: string;
  architecture: string;
  precision: string;
  latencyMs: number;
  benchmarkMetric: string;
  badge: string;
}

export interface ReportItem {
  id: string;
  title: string;
  query: string;
  date: string;
  task: string;
  confidence: number;
  answer: string;
  modelsUsed: string[];
  executionTime: string;
  status: 'Archived' | 'Generated';
  inputSummary: string;
  evidenceVisual?: string;
  tags: string[];
  fullAnalysis?: AnalysisResultData;
}

export interface ErrorScenario {
  id: string;
  title: string;
  type: 
    | 'invalid-file' 
    | 'unsupported-format' 
    | 'wrong-image-count' 
    | 'incompatible-pair' 
    | 'missing-metadata' 
    | 'model-unavailable' 
    | 'analysis-failure';
  errorMessage: string;
  diagnosticDetail: string;
  suggestedFix: string;
  remediationAction: string;
}

