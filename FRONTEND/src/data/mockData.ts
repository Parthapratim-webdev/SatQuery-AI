import { 
  AOIPreset, 
  BenchmarkItem, 
  RecentAnalysis, 
  ApiKeyItem, 
  LayerConfig, 
  UserProfile, 
  ModelConfidenceSettings,
  ModelToolCardInfo,
  ReportItem,
  ErrorScenario
} from '../types';

export const MOCK_AOI_PRESETS: AOIPreset[] = [
  {
    id: 'godavari-flood',
    name: 'Godavari River Basin Flood Zone',
    location: 'Andhra Pradesh / Telangana, India',
    coordinates: [17.385, 81.785],
    bounds: [[17.1, 81.4], [17.7, 82.1]],
    areaKm2: 3420,
    recommendedSensor: 'sentinel-2',
    primaryMetric: 'Peak Flooded Area',
    metricValue: '71,105 ha (+23.4%)',
    description: 'Before-and-after flood analysis over the Godavari river basin comparing pre-monsoon baseline to peak flood water level.',
    beforeLabel: 'Before: Pre-Flood Baseline (t0_preFlood.tiff)',
    afterLabel: 'After: Post-Flood Inundation (t1_postFlood.tiff)',
    beforeVisual: '/api/inputs/uploads/t0_preFlood_preview.png',
    afterVisual: '/api/inputs/uploads/t1_postFlood_preview.png'
  },
  {
    id: 'sentinel1-godavari-sar',
    name: 'Godavari Radar Flood Mapping',
    location: 'Godavari Delta, India',
    coordinates: [17.012, 81.821],
    bounds: [[16.8, 81.5], [17.3, 82.1]],
    areaKm2: 2450,
    recommendedSensor: 'sentinel-1',
    primaryMetric: 'Water Surface Detection',
    metricValue: 'Water Confirmed (-18.4 dB)',
    description: 'Radar satellite imaging penetrating heavy cloud cover for clear flood mapping during storm seasons.',
    beforeLabel: 'Standard Optical Image',
    afterLabel: 'Radar Satellite Water Detection',
    beforeVisual: '/api/inputs/samples/sentinel2_godavari_pre_preview.png',
    afterVisual: '/api/inputs/samples/sentinel1_godavari_sar_preview.png'
  },
  {
    id: 'amazon-rondonia',
    name: 'Amazon Rainforest (Rondônia Track)',
    location: 'Rondônia, Brazil',
    coordinates: [-10.824, -62.923],
    bounds: [[-10.6, -63.2], [-11.0, -62.6]],
    areaKm2: 4820,
    recommendedSensor: 'sentinel-2',
    primaryMetric: 'Tree Loss Rate',
    metricValue: '-4.8% / 90 days',
    description: 'Multi-temporal rainforest monitoring detecting forest clearing and road expansion in Rondônia.',
    beforeLabel: 'Baseline (June 2024)',
    afterLabel: 'AI Forest Change Detection (Aug 2024)',
    beforeVisual: 'linear-gradient(135deg, #134e4a 0%, #064e3b 45%, #022c22 100%)',
    afterVisual: 'linear-gradient(135deg, #134e4a 0%, #b45309 45%, #991b1b 100%)'
  },
  {
    id: 'rhine-flood',
    name: 'Lower Rhine Flood Plain Basin',
    location: 'North Rhine-Westphalia, Germany',
    coordinates: [51.433, 6.762],
    bounds: [[51.2, 6.5], [51.6, 7.0]],
    areaKm2: 2450,
    recommendedSensor: 'sentinel-1',
    primaryMetric: 'Flooded Area Extent',
    metricValue: '312.4 km² submerged',
    description: 'Radar satellite detection through storm clouds to track river water crests and flooded banks.',
    beforeLabel: 'Normal River Level',
    afterLabel: 'Flooded Zone (Water Depth > 1.2m)',
    beforeVisual: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    afterVisual: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #075985 100%)'
  },
  {
    id: 'california-fire',
    name: 'Sierra Nevada Fire Complex',
    location: 'California, United States',
    coordinates: [39.759, -121.621],
    bounds: [[39.5, -121.9], [40.0, -121.3]],
    areaKm2: 1890,
    recommendedSensor: 'landsat-9',
    primaryMetric: 'Fire Damage Severity',
    metricValue: 'High Severity Detected',
    description: 'Infrared satellite comparison to evaluate burn damage, unburned zones, and post-wildfire recovery risks.',
    beforeLabel: 'Before: Healthy Forest',
    afterLabel: 'After: Fire Damage Area',
    beforeVisual: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
    afterVisual: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 45%, #ea580c 100%)'
  },
  {
    id: 'punjab-wheat',
    name: 'Punjab Agricultural Zone',
    location: 'Punjab, India',
    coordinates: [30.901, 75.857],
    bounds: [[30.6, 75.5], [31.2, 76.2]],
    areaKm2: 3600,
    recommendedSensor: 'planetscope',
    primaryMetric: 'Crop Health Index',
    metricValue: '0.82 (Healthy Growth)',
    description: 'High-frequency daily satellite scanning to track wheat crops, monitor irrigation, and detect stressed farmland.',
    beforeLabel: 'Early Crop Growth',
    afterLabel: 'Crop Health Map',
    beforeVisual: 'linear-gradient(135deg, #365314 0%, #4d7c0f 45%, #65a30d 100%)',
    afterVisual: 'linear-gradient(135deg, #15803d 0%, #eab308 60%, #dc2626 100%)'
  },
  {
    id: 'tokyo-port',
    name: 'Tokyo Bay Maritime & Port Terminal',
    location: 'Tokyo / Kanagawa, Japan',
    coordinates: [35.619, 139.781],
    bounds: [[35.4, 139.6], [35.8, 140.0]],
    areaKm2: 1200,
    recommendedSensor: 'worldview-3',
    primaryMetric: 'Ship & Port Activity',
    metricValue: '99.4% Verified',
    description: 'High-resolution satellite view tracking container docks, ship berthing, and marine traffic in Tokyo Bay.',
    beforeLabel: 'Standard Port Satellite Image',
    afterLabel: 'AI Ship & Cargo Detection',
    beforeVisual: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    afterVisual: 'linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #14b8a6 100%)'
  }
];

export const MOCK_BENCHMARKS: BenchmarkItem[] = [
  {
    id: 'b-1',
    model: 'SatQuery-High-Accuracy Detector',
    task: 'Land Cover Detection',
    dataset: 'Satellite Ground Truth',
    mIoU: 89.4,
    f1Score: 0.942,
    latencyMs: 18.2,
    resolutionGSD: '0.5m – 10m',
    hardware: 'High-Performance Engine'
  },
  {
    id: 'b-2',
    model: 'SatQuery-Change Detector',
    task: 'Tree Cover Loss',
    dataset: 'Amazon Satellite Records',
    mIoU: 92.1,
    f1Score: 0.958,
    latencyMs: 24.6,
    resolutionGSD: '10m (Sentinel-2)',
    hardware: 'High-Performance Engine'
  }
];

export const MOCK_ANALYSES: RecentAnalysis[] = [
  {
    id: 'AN-2024-0981',
    title: 'Rondônia Forest Survey',
    aoiName: 'Amazon Rainforest (Rondônia Track)',
    sensor: 'sentinel-2',
    date: '2026-09-05 18:42 UTC',
    areaKm2: 4820,
    confidence: 97.8,
    status: 'Completed',
    anomalyCount: 14,
    spectralIndex: 'ndvi'
  },
  {
    id: 'AN-2024-0980',
    title: 'Rhine River Flood Scan',
    aoiName: 'Lower Rhine Flood Plain Basin',
    sensor: 'sentinel-1',
    date: '2026-09-05 14:15 UTC',
    areaKm2: 2450,
    confidence: 96.2,
    status: 'Completed',
    anomalyCount: 8,
    spectralIndex: 'sar-dual'
  },
  {
    id: 'AN-2024-0979',
    title: 'Sierra Nevada Fire Assessment',
    aoiName: 'Sierra Nevada Fire Complex',
    sensor: 'landsat-9',
    date: '2026-09-05 09:20 UTC',
    areaKm2: 1890,
    confidence: 94.5,
    status: 'Completed',
    anomalyCount: 22,
    spectralIndex: 'nbr'
  },
  {
    id: 'AN-2024-0978',
    title: 'Punjab Farmland Growth Assessment',
    aoiName: 'Punjab Agricultural Zone',
    sensor: 'planetscope',
    date: '2026-09-04 22:04 UTC',
    areaKm2: 3600,
    confidence: 98.4,
    status: 'Completed',
    anomalyCount: 6,
    spectralIndex: 'false-color-nir'
  },
  {
    id: 'AN-2024-0977',
    title: 'Tokyo Bay Port Activity',
    aoiName: 'Tokyo Bay Maritime & Port Terminal',
    sensor: 'worldview-3',
    date: '2026-09-04 16:30 UTC',
    areaKm2: 1200,
    confidence: 89.1,
    status: 'Flagged',
    anomalyCount: 3,
    spectralIndex: 'true-color'
  },
  {
    id: 'AN-2024-0976',
    title: 'Congo Basin Forest Tracking',
    aoiName: 'Central Congo Core Zone',
    sensor: 'sentinel-2',
    date: '2026-09-04 11:10 UTC',
    areaKm2: 5200,
    confidence: 93.7,
    status: 'Processing',
    anomalyCount: 0,
    spectralIndex: 'ndvi'
  }
];

export const INITIAL_LAYERS: LayerConfig[] = [
  { id: 'l-base', name: 'Sentinel-2 Satellite Image', type: 'base', visible: true, opacity: 100, blendMode: 'normal' },
  { id: 'l-mask', name: 'AI Detection Overlay', type: 'mask', visible: true, opacity: 75, blendMode: 'overlay' },
  { id: 'l-cloud', name: 'Cloud and Shadow Mask', type: 'spectral', visible: false, opacity: 50, blendMode: 'multiply' },
  { id: 'l-contours', name: 'Terrain Elevation Lines', type: 'vector', visible: true, opacity: 60, blendMode: 'screen' }
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production Pipeline - US-East-1',
    keyMasked: 'satq_live_948a20d4...4f1e',
    role: 'Admin',
    created: '2026-08-12',
    lastUsed: '4 minutes ago',
    requestsCount: 248190
  },
  {
    id: 'key-2',
    name: 'Earth Engine & STAC Ingestion Worker',
    keyMasked: 'satq_stac_7b99c104...8e21',
    role: 'Read/Analyze',
    created: '2026-08-20',
    lastUsed: '1 hour ago',
    requestsCount: 94210
  },
  {
    id: 'key-3',
    name: 'Jupyter Research Notebook Sandbox',
    keyMasked: 'satq_test_1f44a339...cc02',
    role: 'Inference-Only',
    created: '2026-09-01',
    lastUsed: 'Yesterday',
    requestsCount: 1420
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Dr. Maya Chen',
  email: 'm.chen@earthobservatory.org',
  organization: 'Planetary Dynamics Institute & ESA Earth Science',
  role: 'Principal Geospatial Research Lead',
  stacTier: 'Enterprise STAC Planetary Dedicated',
  quotaUsedGb: 840,
  quotaMaxGb: 2000
};

export const DEFAULT_CONFIDENCE_SETTINGS: ModelConfidenceSettings = {
  detectionThreshold: 85,
  cloudMaskStrictness: 'balanced',
  superResolution: true,
  driftSensitivity: 70,
  preferredProjection: 'EPSG:4326',
  autoCogOptimization: true
};

/* ========================================================================= */
/* DESIGN.MD SPECIFICATION MOCK BENCHMARK SCENARIOS                          */
/* ========================================================================= */

export interface AnalysisScenario {
  id: string;
  title: string;
  category: string;
  mode: 'single' | 'bi-temporal' | 'optical-sar';
  taskType: 'vqa' | 'captioning' | 'grounding' | 'change-analysis' | 'change-vqa' | 'optical-sar';
  defaultQuery: string;
  images: Array<{
    id: string;
    name: string;
    format: 'GeoTIFF' | 'TIFF';
    dimensions: string;
    modality: 'Optical BOA' | 'SAR VV/VH' | 'Panchromatic' | 'SWIR / NBR';
    acquisitionDate: string;
    sizeMb: number;
    validationStatus: 'Valid GeoTIFF' | 'Valid SAR C-Band' | 'Error';
    previewVisual: string;
  }>;
  result: {
    answer: string;
    confidence: number;
    confidenceLevel: 'High' | 'Medium' | 'Low';
    modelsUsed: string[];
    selectedTask: string;
    executionSummary: {
      task: string;
      inputSummary: string;
      selectedTools: string[];
      pipeline: string[];
      latencyMs: number;
      status: 'Completed';
      details: string;
    };
    evidence: {
      type: 'vqa' | 'captioning' | 'grounding' | 'change-analysis' | 'change-vqa' | 'optical-sar';
      imageA?: { visual: string; label: string; date?: string; bounds?: string };
      imageB?: { visual: string; label: string; date?: string; bounds?: string };
      changeMap?: { visual: string; label: string; legend?: string };
      fusedResult?: { visual: string; label: string; details?: string };
      boundingBoxes?: Array<{ id: string; label: string; x: number; y: number; width: number; height: number; color: string; confidence: number }>;
      stats?: Array<{ label: string; value: string; delta?: string }>;
    };
  };
}

export const MOCK_SCENARIOS: AnalysisScenario[] = [
  {
    id: 'sc-visual-grounding',
    title: 'Visual Grounding & Water Body Localization',
    category: 'Visual Grounding',
    mode: 'single',
    taskType: 'grounding',
    defaultQuery: 'Highlight the water body.',
    images: [
      {
        id: 'img-water-grounding',
        name: 'Sentinel2_Reservoir_Reflectance.tif',
        format: 'GeoTIFF',
        dimensions: '2048 × 2048 px',
        modality: 'Optical BOA',
        acquisitionDate: 'September 01, 2025',
        sizeMb: 16.8,
        validationStatus: 'Valid GeoTIFF',
        previewVisual: 'linear-gradient(135deg, #134e4a 0%, #065f46 40%, #0284c7 100%)'
      }
    ],
    result: {
      answer: 'Located primary inland water reservoir and tributary outflow channels. The open surface water body covers 412.8 km² in the southern quadrant with well-defined shoreline boundaries. Water index analysis (NDWI = +0.68) confirms high clarity and absence of heavy algal bloom.',
      confidence: 95,
      confidenceLevel: 'High',
      selectedTask: 'Visual Grounding & Object Localization',
      modelsUsed: ['RS-Grounder Zero-Shot Grounding Model', 'NDWI Water Index Segmenter'],
      executionSummary: {
        task: 'Visual Grounding',
        inputSummary: '1 Single Sentinel-2 Multi-Spectral Surface Reflectance Tile',
        selectedTools: ['RS-Grounder Model', 'Spectral NDWI Filter'],
        pipeline: [
          'Raster Ingestion & Band 3/8 Reflectance Normalization',
          'Natural Language Text Query Parsing ("water body")',
          'Zero-Shot Coordinate Grounding & Bounding Box Generation',
          'Polygon Mask Vectorization & GeoJSON Extraction'
        ],
        latencyMs: 19.4,
        status: 'Completed',
        details: 'Threshold calculated using McFeeters Modified Normalized Difference Water Index (MNDWI).'
      },
      evidence: {
        type: 'grounding',
        imageA: {
          visual: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #0284c7 100%)',
          label: 'Calibrated True Color BOA (Band 4-3-2)',
          date: '2025-09-01',
          bounds: '24.12°N, 78.34°E [EPSG:32644]'
        },
        boundingBoxes: [
          { id: 'bb-1', label: 'Primary Reservoir (412.8 km²)', x: 22, y: 35, width: 56, height: 48, color: '#38bdf8', confidence: 0.98 },
          { id: 'bb-2', label: 'Spillway Outflow Channel', x: 74, y: 60, width: 18, height: 26, color: '#2dd4bf', confidence: 0.92 }
        ],
        stats: [
          { label: 'Surface Water Extent', value: '412.8 km²', delta: 'Nominal Level' },
          { label: 'Mean NDWI Index', value: '+0.68', delta: 'Clear Water' },
          { label: 'Perimeter Length', value: '184.2 km', delta: 'Digitized' },
          { label: 'Grounding IoU', value: '94.8%', delta: 'High Overlap' }
        ]
      }
    }
  },
  {
    id: 'sc-urban-expansion',
    title: 'Urban Expansion Change Analysis',
    category: 'Change-based VQA',
    mode: 'bi-temporal',
    taskType: 'change-vqa',
    defaultQuery: 'Has the built-up area increased?',
    images: [
      {
        id: 'img-urban-2022',
        name: 'Sentinel2_Bengaluru_T0_2022.tif',
        format: 'GeoTIFF',
        dimensions: '2048 × 2048 px',
        modality: 'Optical BOA',
        acquisitionDate: 'June 14, 2022',
        sizeMb: 18.4,
        validationStatus: 'Valid GeoTIFF',
        previewVisual: 'linear-gradient(135deg, #1e293b 0%, #334155 45%, #475569 100%)'
      },
      {
        id: 'img-urban-2025',
        name: 'Sentinel2_Bengaluru_T1_2025.tif',
        format: 'GeoTIFF',
        dimensions: '2048 × 2048 px',
        modality: 'Optical BOA',
        acquisitionDate: 'August 28, 2025',
        sizeMb: 19.1,
        validationStatus: 'Valid GeoTIFF',
        previewVisual: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #b45309 100%)'
      }
    ],
    result: {
      answer: 'Yes, the built-up area increased significantly in the selected northwest peri-urban corridor between June 2022 and August 2025. Total impervious surface expanded by +28.4% (+412.5 hectares), replacing previously fallow agricultural land and scrub vegetation. 14 major logistics and high-density residential structures were newly detected.',
      confidence: 91,
      confidenceLevel: 'High',
      selectedTask: 'Change-based VQA',
      modelsUsed: ['Siamese Change Detection Model', 'Remote-Sensing Vision-Language Model (RS-VLM)'],
      executionSummary: {
        task: 'Change-based VQA',
        inputSummary: '2 Dual Sentinel-2 L2A BOA Orthorectified Scenes (2022 vs 2025)',
        selectedTools: ['Change Detection Model', 'Remote-Sensing VQA Model'],
        pipeline: [
          'Validation & Radiometric Co-Registration',
          'Deep Siamese Difference Extraction',
          'Spatial Change Map Interpretation',
          'Evidence-Grounded Natural Language Answer Generation'
        ],
        latencyMs: 24.6,
        status: 'Completed',
        details: 'Radiometric calibration confirmed RMSE < 0.18 pixels. Difference threshold established at Otsu optimum + 0.15.'
      },
      evidence: {
        type: 'change-vqa',
        imageA: {
          visual: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          label: 'Baseline Image (June 2022)',
          date: '2022-06-14',
          bounds: '12.97°N, 77.59°E [EPSG:32643]'
        },
        imageB: {
          visual: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
          label: 'Post-Period Image (August 2025)',
          date: '2025-08-28',
          bounds: '12.97°N, 77.59°E [EPSG:32643]'
        },
        changeMap: {
          visual: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)',
          label: 'AI Difference Heatmap (Built-up Gain Highlighted in Amber/Red)',
          legend: 'Red: High-Confidence Built-up Gain (+28.4%) | Green: Unchanged Vegetated Area | Black: No Significant Drift'
        },
        stats: [
          { label: 'Built-up Area Growth', value: '+412.5 ha', delta: '+28.4%' },
          { label: 'Converted Farmland', value: '348.0 ha', delta: '-19.2%' },
          { label: 'Classification Confidence', value: '91.2%', delta: 'High Precision' },
          { label: 'Co-Registration RMSE', value: '0.14 px', delta: 'Sub-Pixel Accurate' }
        ]
      }
    }
  },
  {
    id: 'sc-optical-sar-flood',
    title: 'Cross-Modal Optical + SAR Flood Inundation',
    category: 'Optical + SAR Fusion',
    mode: 'optical-sar',
    taskType: 'optical-sar',
    defaultQuery: 'Identify built-up and water-covered regions using both images.',
    images: [
      {
        id: 'img-optical-flood',
        name: 'Sentinel2_Optical_RGB.tif',
        format: 'GeoTIFF',
        dimensions: '2048 × 2048 px',
        modality: 'Optical BOA',
        acquisitionDate: 'September 03, 2025',
        sizeMb: 17.5,
        validationStatus: 'Valid GeoTIFF',
        previewVisual: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
      },
      {
        id: 'img-sar-flood',
        name: 'Sentinel1_SAR_C_Band_VV_VH.tif',
        format: 'TIFF',
        dimensions: '2048 × 2048 px',
        modality: 'SAR VV/VH',
        acquisitionDate: 'September 03, 2025',
        sizeMb: 24.2,
        validationStatus: 'Valid SAR C-Band',
        previewVisual: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)'
      }
    ],
    result: {
      answer: 'By combining Sentinel-2 optical spectral bands with cloud-penetrating Sentinel-1 C-Band SAR backscatter, SatQuery AI identified 312.4 km² of active flood inundation across low-lying floodplains. Optical imagery confirmed 184 km² of impervious urban structures, while SAR detected submerged transport arterials hidden underneath dense storm cloud cover.',
      confidence: 94,
      confidenceLevel: 'High',
      selectedTask: 'Cross-Modal Optical + SAR Analysis',
      modelsUsed: ['Cross-Modal Radar-Optical Fusion Transformer', 'InSAR Flood Inundation Detector'],
      executionSummary: {
        task: 'Optical + SAR Analysis',
        inputSummary: '1 Optical Sentinel-2 Tile + 1 Synthetic Aperture Radar Sentinel-1 GRD Scene',
        selectedTools: ['Optical+SAR Fusion Engine', 'Radar InSAR Hydrology Model'],
        pipeline: [
          'SAR Speckle Lee Filtering & Range-Doppler Terrain Correction',
          'Cross-Modal Radiometric Normalization & Co-Registration',
          'Double-Bounce Corner Reflector Urban Detection (SAR)',
          'Specular Reflectance Water Surface Isolation',
          'Joint Dual-Branch Feature Fusion & Semantic Mapping'
        ],
        latencyMs: 31.8,
        status: 'Completed',
        details: 'SAR Polarization ratio (VH/VV) computed to separate inundated vegetation from open water standing basins.'
      },
      evidence: {
        type: 'optical-sar',
        imageA: {
          visual: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          label: 'Optical Modality: Sentinel-2 L2A (Cloud-affected BOA)',
          date: '2025-09-03',
          bounds: '51.43°N, 6.76°E'
        },
        imageB: {
          visual: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)',
          label: 'SAR Radar Modality: Sentinel-1 C-Band (Cloud-Penetrating VV/VH)',
          date: '2025-09-03',
          bounds: '51.43°N, 6.76°E'
        },
        fusedResult: {
          visual: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #f59e0b 80%, #b45309 100%)',
          label: 'Fused Cross-Modal Classification Map (Blue: Inundated | Amber: Built-Up)',
          details: 'Combines optical color fidelity with SAR surface roughness backscatter coefficient (-18.4 dB specular water).'
        },
        stats: [
          { label: 'Total Inundation Extent', value: '312.4 km²', delta: 'Peak Crest' },
          { label: 'Identified Built-up Area', value: '184.6 km²', delta: 'Infrastructure' },
          { label: 'Submerged Roadways', value: '42.8 km', delta: 'Critical Cutoff' },
          { label: 'Radar Cloud Penetration', value: '100%', delta: 'All-Weather' }
        ]
      }
    }
  },
  {
    id: 'sc-scene-description',
    title: 'Scene Description & Environmental VQA',
    category: 'Scene Description & VQA',
    mode: 'single',
    taskType: 'vqa',
    defaultQuery: 'Describe the land-cover in this image.',
    images: [
      {
        id: 'img-landcover-single',
        name: 'Sentinel2_Punjab_MultiSpectral.tif',
        format: 'GeoTIFF',
        dimensions: '2048 × 2048 px',
        modality: 'Optical BOA',
        acquisitionDate: 'August 19, 2025',
        sizeMb: 15.2,
        validationStatus: 'Valid GeoTIFF',
        previewVisual: 'linear-gradient(135deg, #15803d 0%, #4d7c0f 45%, #ca8a04 100%)'
      }
    ],
    result: {
      answer: 'The scene depicts an agricultural agro-hydrological basin with high canopy productivity. Land cover composition breakdown: 62% irrigated seasonal cereal croplands (high chlorophyll vigour, NDVI ~0.76), 18% agro-forestry and orchard plots, 12% rural settlements and paved transport grid, and 8% canal waterways and containment ponds.',
      confidence: 93,
      confidenceLevel: 'High',
      selectedTask: 'Scene Description & Categorical VQA',
      modelsUsed: ['Remote-Sensing Vision-Language Model (RS-VLM)', 'Multi-Spectral Land Cover Classifier'],
      executionSummary: {
        task: 'Scene Description',
        inputSummary: '1 Single Sentinel-2 Multi-Spectral BOA Reflectance Scene',
        selectedTools: ['Remote-Sensing VQA Model', 'Crop Phenology Classifier'],
        pipeline: [
          'Multi-Spectral Band Calibration (B2, B3, B4, B8, B11)',
          'Semantic Feature Pyramid Extraction',
          'Land-Cover Fractional Area Estimation',
          'Descriptive Report Text Generation'
        ],
        latencyMs: 18.2,
        status: 'Completed',
        details: 'Atmospheric correction level 2A verified; cloud obstruction index < 0.8%.'
      },
      evidence: {
        type: 'vqa',
        imageA: {
          visual: 'linear-gradient(135deg, #15803d 0%, #4d7c0f 45%, #ca8a04 100%)',
          label: 'Calibrated Multi-Spectral Scene (Punjab Basin)',
          date: '2025-08-19',
          bounds: '30.90°N, 75.85°E'
        },
        stats: [
          { label: 'Active Croplands', value: '62.4%', delta: 'High Biomass' },
          { label: 'Agro-Forestry', value: '18.1%', delta: 'Stable' },
          { label: 'Built-up / Rural', value: '11.8%', delta: 'Low Density' },
          { label: 'Canals & Water', value: '7.7%', delta: 'Adequate Reserve' }
        ]
      }
    }
  },
  {
    id: 'sc-change-deforestation',
    title: 'Multi-Temporal Canopy Disturbance Analysis',
    category: 'Change Analysis',
    mode: 'bi-temporal',
    taskType: 'change-analysis',
    defaultQuery: 'What changed between these two dates?',
    images: [
      {
        id: 'img-forest-2022',
        name: 'Landsat9_Amazon_PreDisturbance_2022.tif',
        format: 'GeoTIFF',
        dimensions: '2048 × 2048 px',
        modality: 'SWIR / NBR',
        acquisitionDate: 'July 10, 2022',
        sizeMb: 17.8,
        validationStatus: 'Valid GeoTIFF',
        previewVisual: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)'
      },
      {
        id: 'img-forest-2025',
        name: 'Landsat9_Amazon_PostDisturbance_2025.tif',
        format: 'GeoTIFF',
        dimensions: '2048 × 2048 px',
        modality: 'SWIR / NBR',
        acquisitionDate: 'August 15, 2025',
        sizeMb: 18.2,
        validationStatus: 'Valid GeoTIFF',
        previewVisual: 'linear-gradient(135deg, #14532d 0%, #78350f 45%, #991b1b 100%)'
      }
    ],
    result: {
      answer: 'Multi-temporal radiometric analysis reveals 48.2 hectares of new primary forest canopy loss along newly bulldozed access corridors. Canopy density decreased sharply from 88% in 2022 down to 14% in 2025 within the flagged perimeter. Normalized Burn Ratio (dNBR = 0.58) indicates mechanical felling followed by biomass burning.',
      confidence: 96,
      confidenceLevel: 'High',
      selectedTask: 'Change Analysis & Canopy Tracking',
      modelsUsed: ['Temporal Siamese ResNet Change Detector', 'Spectral Canopy Index Engine'],
      executionSummary: {
        task: 'Change Analysis',
        inputSummary: '2 Landsat-9 Multi-Spectral Scenes (2022 vs 2025)',
        selectedTools: ['Change Detection Model', 'Spectral Biomass Index Engine'],
        pipeline: [
          'Radiometric Cross-Calibration & Pixel Normalization',
          'dNBR and dNDVI Multi-Temporal Difference Math',
          'Disturbance Perimeter Clustering & Morphological Filtering',
          'Severity Classification & GeoJSON Vectorization'
        ],
        latencyMs: 22.4,
        status: 'Completed',
        details: 'Confidence exceeds 95% with zero false alarms along non-disturbed primary forest control baselines.'
      },
      evidence: {
        type: 'change-analysis',
        imageA: {
          visual: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
          label: 'Pre-Disturbance Forest Canopy (July 2022)',
          date: '2022-07-10',
          bounds: '-10.82°S, -62.92°W'
        },
        imageB: {
          visual: 'linear-gradient(135deg, #14532d 0%, #78350f 45%, #991b1b 100%)',
          label: 'Post-Disturbance Scene (August 2025)',
          date: '2025-08-15',
          bounds: '-10.82°S, -62.92°W'
        },
        changeMap: {
          visual: 'linear-gradient(135deg, #14532d 0%, #b91c1c 45%, #ea580c 100%)',
          label: 'Deforestation Disturbance Vector Map',
          legend: 'Red: High-Severity Canopy Loss (48.2 ha) | Yellow: Selective Logging Buffer | Green: Intact Canopy'
        },
        stats: [
          { label: 'Canopy Deforestation Area', value: '48.2 ha', delta: 'Verified' },
          { label: 'Canopy Density Shift', value: '88% → 14%', delta: '-74.0%' },
          { label: 'dNBR Burn Severity', value: '0.58', delta: 'Severe Loss' },
          { label: 'Change Confidence', value: '96.4%', delta: 'P < 0.001' }
        ]
      }
    }
  }
];

/* ========================================================================= */
/* DESIGN.MD SECTION 23: MODELS & TOOLS PAGE DATA                            */
/* ========================================================================= */

export const MOCK_MODEL_TOOLS: ModelToolCardInfo[] = [
  {
    id: 'tool-rs-vqa',
    name: 'Remote-Sensing VQA (RS-VLM)',
    taskType: 'vqa',
    description: 'Vision-language foundation model pre-trained on multi-spectral satellite imagery and geospatial reasoning corpuses. Answers questions on land-cover, object frequency, and spatial relationships.',
    status: 'Active',
    supportedInput: 'Single Multi-Spectral Optical Image (Sentinel-2, Landsat-8/9, PlanetScope)',
    architecture: 'Transformer Encoder-Decoder with Vision Perceiver Resampler',
    precision: 'FP16 / TensorRT-LLM',
    latencyMs: 18.2,
    benchmarkMetric: '89.4% Accuracy (RSVQA / EarthQA)',
    badge: 'Foundation VLM'
  },
  {
    id: 'tool-rs-caption',
    name: 'Remote-Sensing Image Captioning',
    taskType: 'captioning',
    description: 'Generates comprehensive textual descriptions of complex remote-sensing scenes, articulating urban density, agricultural topology, geomorphology, and hydrological systems.',
    status: 'Ready',
    supportedInput: 'Single Optical or Infrared Tile (0.3m – 30m GSD)',
    architecture: 'Swin-Transformer Backbone + Autoregressive Text Decoder',
    precision: 'FP16 Optimized',
    latencyMs: 15.6,
    benchmarkMetric: 'CIDEr 1.34 / BLEU-4 0.42',
    badge: 'Semantic Captioner'
  },
  {
    id: 'tool-rs-grounding',
    name: 'Visual Grounding Specialist (RS-Grounder)',
    taskType: 'grounding',
    description: 'Locates target objects, infrastructure, natural water reservoirs, or anomalies in response to natural-language referential expressions, outputting precise bounding boxes and polygon masks.',
    status: 'Active',
    supportedInput: 'Single Image (GeoTIFF with spatial coordinates)',
    architecture: 'Dual-Encoder Cross-Modal Attention with Vector Mask Head',
    precision: 'INT8 Quantized',
    latencyMs: 19.4,
    benchmarkMetric: '91.2% Top-1 IoU (GeoRef)',
    badge: 'Spatial Grounding'
  },
  {
    id: 'tool-change-detect',
    name: 'Bi-Temporal Change Analysis Engine',
    taskType: 'change-analysis',
    description: 'Compares two co-registered scenes acquired on different dates to isolate land-use transitions, urban construction sprawl, wildfire burn scars, and deforestation edges.',
    status: 'Active',
    supportedInput: '2 Bi-temporal Images (Image A: T0, Image B: T1)',
    architecture: 'Siamese ResNet-50 + Difference Attention Feature Pyramids',
    precision: 'FP16 / TensorRT',
    latencyMs: 22.4,
    benchmarkMetric: '92.1% F1-Score (OSCD / LEVIR-CD)',
    badge: 'Temporal Siamese'
  },
  {
    id: 'tool-change-vqa',
    name: 'Change-based VQA Controller',
    taskType: 'change-vqa',
    description: 'Answers comparative questions across multi-temporal image pairs (e.g., "Has the built-up area increased?"). Combines change mask detection with language reasoning to quantify trends.',
    status: 'Active',
    supportedInput: '2 Bi-temporal Images + Natural Language Query',
    architecture: 'Multi-Temporal Cross-Attention VLM with Difference Fusion',
    precision: 'FP16',
    latencyMs: 24.6,
    benchmarkMetric: '88.7% Accuracy (Change-VQA Benchmark)',
    badge: 'Agentic Controller'
  },
  {
    id: 'tool-optical-sar',
    name: 'Optical + SAR Cross-Modal Fusion Engine',
    taskType: 'optical-sar',
    description: 'Fuses complementary optical spectral reflectance (BOA) and radar backscatter (SAR C-Band VV/VH) to identify floodwater perimeters through dense clouds and extract structures.',
    status: 'Active',
    supportedInput: 'Co-registered Optical RGB/NIR + SAR Radar Pair',
    architecture: 'Multi-Modal Cross-Attention Fusion Transformer',
    precision: 'FP16 / TensorRT',
    latencyMs: 31.8,
    benchmarkMetric: '93.5% mIoU (SEN12-Flood / SpaceNet 8)',
    badge: 'Radar-Optical Fusion'
  }
];

/* ========================================================================= */
/* DESIGN.MD SECTION 25: SAVED REPORTS PAGE DATA                             */
/* ========================================================================= */

export const MOCK_SAVED_REPORTS: ReportItem[] = [
  {
    id: 'rep-001',
    title: 'Bengaluru Peri-Urban Expansion Impact Briefing',
    query: 'Has the built-up area increased?',
    date: '2026-09-06 14:20 UTC',
    task: 'Change-based VQA',
    confidence: 91,
    answer: 'Built-up area expanded by +28.4% (+412.5 ha) in the northwest quadrant between June 2022 and August 2025. 14 major logistics and high-density residential structures were newly detected.',
    modelsUsed: ['Bi-Temporal Siamese Change Detection Model', 'Remote-Sensing Vision-Language Model (RS-VLM)'],
    executionTime: '24.6 ms',
    status: 'Generated',
    inputSummary: '2 Sentinel-2 L2A BOA GeoTIFF Scenes (2022 vs 2025)',
    evidenceVisual: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)',
    tags: ['Urban Planning', 'Bi-Temporal', 'Change Detection']
  },
  {
    id: 'rep-002',
    title: 'Lower Rhine Flash Flood Extent & Damaged Infrastructure',
    query: 'Identify built-up and water-covered regions using both images.',
    date: '2026-09-05 18:45 UTC',
    task: 'Optical + SAR Analysis',
    confidence: 94,
    answer: 'SAR cross-polarization penetration verified 312.4 km² of active flood inundation across low-lying floodplains. Optical imagery confirmed 184 km² of impervious urban structures, with 42.8 km of critical roadways submerged.',
    modelsUsed: ['Cross-Modal Radar-Optical Fusion Transformer', 'InSAR Flood Inundation Detector'],
    executionTime: '31.8 ms',
    status: 'Generated',
    inputSummary: '1 Sentinel-2 Optical RGB + 1 Sentinel-1 SAR C-Band Radar',
    evidenceVisual: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #f59e0b 80%, #b45309 100%)',
    tags: ['Disaster Management', 'SAR Radar', 'Emergency Response']
  },
  {
    id: 'rep-003',
    title: 'Lake Powell Reservoir Surface Extent & Shoreline Delineation',
    query: 'Highlight the water body.',
    date: '2026-09-04 11:30 UTC',
    task: 'Visual Grounding',
    confidence: 95,
    answer: 'Identified primary open water reservoir surface covering 412.8 km² in the southern quadrant. NDWI water index verified at +0.68 with digitized perimeter of 184.2 km.',
    modelsUsed: ['RS-Grounder Zero-Shot Grounding Model', 'NDWI Water Index Segmenter'],
    executionTime: '19.4 ms',
    status: 'Generated',
    inputSummary: '1 Sentinel-2 Multi-Spectral Reflectance Tile',
    evidenceVisual: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #0284c7 100%)',
    tags: ['Water Resources', 'Visual Grounding', 'Hydrology']
  },
  {
    id: 'rep-004',
    title: 'Rondônia Amazon Forest Corridor Logging Survey Q3',
    query: 'What changed between 2022 and 2025?',
    date: '2026-09-03 09:15 UTC',
    task: 'Change Analysis',
    confidence: 96,
    answer: 'Multi-temporal radiometric analysis reveals 48.2 hectares of new primary forest canopy loss along newly bulldozed access corridors. Canopy density decreased sharply from 88% down to 14%.',
    modelsUsed: ['Temporal Siamese ResNet Change Detector', 'Spectral Canopy Index Engine'],
    executionTime: '22.4 ms',
    status: 'Archived',
    inputSummary: '2 Landsat-9 Multi-Spectral Scenes (2022 vs 2025)',
    evidenceVisual: 'linear-gradient(135deg, #14532d 0%, #b91c1c 45%, #ea580c 100%)',
    tags: ['Forest Monitoring', 'Deforestation', 'Environmental']
  }
];

/* ========================================================================= */
/* DESIGN.MD SECTION 26: ERROR STATES DEFINITIONS                            */
/* ========================================================================= */

export const MOCK_ERROR_SCENARIOS: ErrorScenario[] = [
  {
    id: 'err-invalid-file',
    title: 'Invalid File Upload',
    type: 'invalid-file',
    errorMessage: 'Corrupted File Header or Non-Raster Input',
    diagnosticDetail: 'The uploaded file does not contain valid raster magic bytes (TIFF header 0x49492A00 or 0x4D4D002A expected). File could be corrupted during transfer or is an unsupported vector container.',
    suggestedFix: 'Verify the file integrity on your local machine. Ensure you are uploading a valid GeoTIFF or CEOS SAR TIFF file.',
    remediationAction: 'Re-upload Valid GeoTIFF'
  },
  {
    id: 'err-unsupported-format',
    title: 'Unsupported Coordinate Reference System (CRS)',
    type: 'unsupported-format',
    errorMessage: 'Unrecognized Spatial Projection [CRS: Custom-Local-GRID]',
    diagnosticDetail: 'The embedded GeoTIFF tags specify an unprojected local coordinate grid without WKT/EPSG definitions. SatQuery AI requires EPSG:4326 (WGS84), EPSG:3857 (Web Mercator), or recognized UTM projection zones.',
    suggestedFix: 'Reproject the imagery using GDAL: gdalwarp -t_srs EPSG:4326 input.tif output_wgs84.tif before uploading.',
    remediationAction: 'Auto-Reproject to EPSG:4326'
  },
  {
    id: 'err-wrong-count',
    title: 'Wrong Number of Images for Selected Task',
    type: 'wrong-image-count',
    errorMessage: 'Expected 2 Images for Change Analysis (Found 1)',
    diagnosticDetail: 'The query "Has the built-up area increased?" requires a bi-temporal comparison (Baseline T0 and Comparison T1). Only 1 image has been uploaded into the staging bucket.',
    suggestedFix: 'Switch the analysis mode to "Single Image" for standard VQA / Grounding, or upload a second image from a different acquisition date to perform Change Analysis.',
    remediationAction: 'Add Second Image (T1)'
  },
  {
    id: 'err-incompatible-pair',
    title: 'Incompatible Image Pair (Bounding Box Mismatch)',
    type: 'incompatible-pair',
    errorMessage: 'Non-Overlapping Spatial Extents in Bi-Temporal Pair',
    diagnosticDetail: 'Image A covers bounding box [12.9°N, 77.5°E] (Bengaluru) while Image B covers [28.6°N, 77.2°E] (Delhi). Overlap area is 0.0%. Change detection requires co-registered spatial intersection > 80%.',
    suggestedFix: 'Ensure both uploaded scenes represent the same Area of Interest (AOI) with aligned geographic coordinates.',
    remediationAction: 'Select Matching AOI Pair'
  },
  {
    id: 'err-missing-metadata',
    title: 'Missing Acquisition Date & Sensor Metadata',
    type: 'missing-metadata',
    errorMessage: 'STAC Metadata Incomplete: Acquisition Timestamp Missing',
    diagnosticDetail: 'The TIFF metadata does not contain the EXIF/TIFF DateTime tag or STAC properties "datetime" attribute required to order the bi-temporal sequence chronologically.',
    suggestedFix: 'Manually specify the acquisition dates in the Dynamic Configuration panel or upload a standard Sentinel/Landsat product containing metadata JSON/MTL.',
    remediationAction: 'Manually Assign Dates'
  },
  {
    id: 'err-model-unavailable',
    title: 'Specialist AI Model Worker Offline',
    type: 'model-unavailable',
    errorMessage: 'GPU Worker Node Timeout (RS-Grounder Engine)',
    diagnosticDetail: 'The dedicated TensorRT inference server for Visual Grounding timed out after 30,000ms. High cluster load or warm-up queue.',
    suggestedFix: 'The orchestration controller will automatically reroute the query to the fallback general Vision-Language Model, or you can retry in 10 seconds.',
    remediationAction: 'Reroute to Fallback Model'
  },
  {
    id: 'err-analysis-failure',
    title: 'Analysis Execution Interrupted',
    type: 'analysis-failure',
    errorMessage: 'Excessive Cloud Cover Obstruction (>92%)',
    diagnosticDetail: 'Optical scene analysis aborted: Atmospheric cloud and shadow mask (s2cloudless) detected 94.2% obstruction over the target region. Ground reflectance cannot be reliably inferred from optical bands alone.',
    suggestedFix: 'Switch to the "Optical + SAR" mode to utilize Sentinel-1 C-Band synthetic aperture radar, which penetrates through clouds and precipitation.',
    remediationAction: 'Switch to SAR Radar Mode'
  }
];

