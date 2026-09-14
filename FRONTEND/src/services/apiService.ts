/**
 * SatQuery AI — API Service
 * Central communication bridge between the React frontend, the Flask backend,
 * and the offline PyTorch neural reasoning specialists & physics verification engine.
 */

// Determine base API URL:
// 1. Explicit Vite environment variable (e.g. set on Vercel: VITE_API_BASE_URL)
// 2. In browser local development: relative '' (proxied by Vite to http://127.0.0.1:8000)
// 3. In production: relative '' (supports Vercel rewrites / reverse proxy)
// 4. Fallback: http://127.0.0.1:8000
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '';
    }
    return '';
  }
  return 'http://127.0.0.1:8000';
};

const API_BASE_URL = getApiBaseUrl();

export interface BackendHealth {
  status: string;
  engine: string;
  version: string;
  device: string;
  specialists_ready: string[];
  physics_verifier: string;
  paths?: Record<string, string>;
}

export interface BackendModel {
  id: string;
  name: string;
  badge: string;
  status: string;
  description: string;
  supportedInput: string;
  architecture: string;
  precision: string;
  parameters: string;
  benchmarkMetric: string;
  latencyMs: number;
  taskType: string;
  device?: string;
}

export interface BackendSample {
  id: string;
  name: string;
  label: string;
  modality: string;
  description: string;
  recommendedTask: string;
  size_bytes: number;
  path: string;
  url: string;
  preview_url?: string;
}

export type SatelliteSample = BackendSample;

export interface AnalyzeParams {
  queryText: string;
  imagePath?: string;
  secondaryImagePath?: string;
  file?: File;
  secondaryFile?: File;
  confidenceThreshold?: number;
  enablePhysicsVerification?: boolean;
}

export interface AnalyzeResult {
  success: boolean;
  query_text: string;
  task_type: string;
  summary_text: string;
  statistics: {
    detected_pixel_count: number;
    total_scene_pixels: number;
    coverage_percentage: number;
    area_hectares: number;
    mean_probability: number;
    bounding_boxes: Array<{
      id: string;
      box_2d: [number, number, number, number];
      label: string;
      confidence: number;
      area_hectares: number;
    }>;
  };
  bounding_boxes: Array<{
    id: string;
    box_2d: [number, number, number, number];
    label: string;
    confidence: number;
    area_hectares: number;
  }>;
  audit_trace: {
    trace_id: string;
    timestamp: string;
    specialist_model: string;
    verdict: string;
    execution_time_ms: number;
    preprocessing: string[];
  };
  geojson: Record<string, unknown>;
  artifacts?: {
    mask_image_path?: string;
    heatmap_image_path?: string;
    overlay_image_path?: string;
    geojson_path?: string;
    report_json_path?: string;
    report_markdown_path?: string;
  };
  urls?: {
    mask_url?: string;
    heatmap_url?: string;
    overlay_url?: string;
    geojson_url?: string;
    report_json_url?: string;
    report_markdown_url?: string;
  };
  primary_preview_url?: string;
  secondary_preview_url?: string;
}

export interface ChatResponse {
  reply: string;
  traces: Array<{
    id: string;
    title: string;
    status: 'completed' | 'processing' | 'pending' | 'failed';
    durationMs: number;
    details: string;
  }>;
  groundedStats?: Array<{
    label: string;
    value: string;
    unit?: string;
  }>;
  suggestedAction?: {
    label: string;
    actionType: 'open-workspace' | 'highlight-scar' | 'switch-ndvi' | 'export-geojson';
  };
  urls?: Record<string, string>;
  bounding_boxes?: Array<unknown>;
}

export interface ServerReport {
  id: string;
  title: string;
  query: string;
  date: string;
  task: string;
  confidence: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  answer: string;
  modelsUsed: string[];
  executionTime: string;
  status: string;
  inputSummary: string;
  evidenceVisual?: string;
  tags: string[];
  json_url: string;
  md_url: string;
  area_hectares?: number;
  verdict?: string;
}

export class SatQueryApiService {
  public static getFullUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  }

  /**
   * Health check to detect if SatQuery backend engine is online.
   */
  static async checkHealth(): Promise<BackendHealth | null> {
    try {
      const res = await fetch(this.getFullUrl('/api/health'), {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Fetch all 6 neural specialist models & tools from the master core engine.
   */
  static async getModels(): Promise<BackendModel[]> {
    try {
      const res = await fetch(this.getFullUrl('/api/models'));
      if (!res.ok) return [];
      const data = await res.json();
      return data.models || [];
    } catch {
      return [];
    }
  }

  /**
   * Fetch pre-bundled sample datasets with pre-generated previews.
   */
  static async getSamples(): Promise<BackendSample[]> {
    try {
      const res = await fetch(this.getFullUrl('/api/samples'));
      if (!res.ok) return [];
      const data = await res.json();
      return (data.samples || []).map((s: BackendSample) => ({
        ...s,
        preview_url: s.preview_url ? this.getFullUrl(s.preview_url) : undefined,
        url: this.getFullUrl(s.url),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Fetch all uploaded rasters and datasets in data/inputs/uploads.
   */
  static async getUploads(): Promise<Array<{
    name: string;
    relative_path?: string;
    folder?: string;
    size_bytes: number;
    path: string;
    url: string;
    preview_url?: string;
  }>> {
    try {
      const res = await fetch(this.getFullUrl('/api/uploads'));
      if (!res.ok) return [];
      const data = await res.json();
      return (data.uploads || []).map((u: any) => ({
        ...u,
        preview_url: u.preview_url ? this.getFullUrl(u.preview_url) : undefined,
        url: this.getFullUrl(u.url),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Upload an image directly to the backend.
   */
  static async uploadFile(file: File): Promise<{
    filename: string;
    file_path: string;
    url: string;
    preview_url?: string;
    original_name?: string;
    file_size_bytes?: number;
  } | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(this.getFullUrl('/api/upload'), {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) return null;
      const data = await res.json();
      return {
        ...data,
        preview_url: data.preview_url ? this.getFullUrl(data.preview_url) : undefined,
        url: this.getFullUrl(data.url),
      };
    } catch {
      return null;
    }
  }

  /**
   * Execute an end-to-end analytical query across input rasters.
   */
  static async runAnalysis(params: AnalyzeParams): Promise<AnalyzeResult | null> {
    try {
      const formData = new FormData();
      formData.append('query_text', params.queryText);
      formData.append('confidence_threshold', String(params.confidenceThreshold ?? 0.45));
      formData.append('enable_physics_verification', String(params.enablePhysicsVerification ?? true));

      if (params.file) {
        formData.append('file', params.file);
      } else if (params.imagePath) {
        formData.append('image_path', params.imagePath);
      }

      if (params.secondaryFile) {
        formData.append('secondary_file', params.secondaryFile);
      } else if (params.secondaryImagePath) {
        formData.append('secondary_image_path', params.secondaryImagePath);
      }

      const res = await fetch(this.getFullUrl('/api/analyze'), {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) return null;
      const data = await res.json();

      // Convert relative artifact URLs to absolute URLs
      if (data.urls) {
        Object.keys(data.urls).forEach((k) => {
          if (data.urls[k]) {
            data.urls[k] = this.getFullUrl(data.urls[k]);
          }
        });
      }
      if (data.primary_preview_url) {
        data.primary_preview_url = this.getFullUrl(data.primary_preview_url);
      }
      if (data.secondary_preview_url) {
        data.secondary_preview_url = this.getFullUrl(data.secondary_preview_url);
      }

      return data;
    } catch {
      return null;
    }
  }

  /**
   * Send chat prompt to Orbit Earth Observation AI Copilot.
   */
  static async sendChat(message: string, aoi?: string): Promise<ChatResponse | null> {
    try {
      const res = await fetch(this.getFullUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, aoi }),
      });

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Fetch all saved analytical reports from the backend outputs.
   */
  static async getReports(): Promise<ServerReport[]> {
    try {
      const res = await fetch(this.getFullUrl('/api/reports'));
      if (!res.ok) return [];
      const data = await res.json();
      return (data.reports || []).map((rep: ServerReport) => ({
        ...rep,
        evidenceVisual: rep.evidenceVisual ? this.getFullUrl(rep.evidenceVisual) : undefined,
        json_url: this.getFullUrl(rep.json_url),
        md_url: this.getFullUrl(rep.md_url),
      }));
    } catch {
      return [];
    }
  }
}