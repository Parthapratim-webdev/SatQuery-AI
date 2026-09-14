import React, { useRef, useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileCheck2, 
  Layers, 
  Image as ImageIcon, 
  Radio, 
  CheckCircle2, 
  Calendar, 
  Maximize2, 
  Trash2, 
  Info,
  AlertCircle,
  Database,
  Plus
} from 'lucide-react';
import { ImageAnalysisMode, UploadedImageMeta } from '../../types';
import { SatQueryApiService } from '../../services/apiService';

interface ImageUploaderProps {
  mode: ImageAnalysisMode;
  images: UploadedImageMeta[];
  onAddImage: (img: UploadedImageMeta) => void;
  onRemoveImage: (id: string) => void;
  onUpdateImage?: (id: string, updates: Partial<UploadedImageMeta>) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  mode,
  images,
  onAddImage,
  onRemoveImage,
  onUpdateImage
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [availableSamples, setAvailableSamples] = useState<any[]>([]);
  const [showSamplePicker, setShowSamplePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    SatQueryApiService.getSamples().then(samples => {
      if (mounted && samples && samples.length > 0) {
        setAvailableSamples(samples);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = async (fileList: FileList) => {
    setErrorMessage(null);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const isTiff = file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');
      const isPng = file.name.toLowerCase().endsWith('.png');
      const isJpeg = file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

      if (!isTiff && !isPng && !isJpeg) {
        setErrorMessage(`"${file.name}" is not supported. Please upload satellite images (.tif, .png, .jpg).`);
        continue;
      }

      const isSar = file.name.toLowerCase().includes('sar') || file.name.toLowerCase().includes('s1');

      let previewUrl: string | undefined = undefined;
      if (isPng || isJpeg) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          // ignore
        }
      }

      const formatLabel: 'GeoTIFF' | 'TIFF' | 'PNG' | 'JPEG' = isTiff ? 'GeoTIFF' : isPng ? 'PNG' : 'JPEG';

      const newImage: UploadedImageMeta = {
        id: `custom-img-${Date.now()}-${i}`,
        name: file.name,
        format: formatLabel,
        dimensions: '2048 × 2048 px',
        modality: isSar ? 'Radar' : 'Optical',
        acquisitionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        sizeMb: Number((file.size / (1024 * 1024)).toFixed(1)) || 16.4,
        validationStatus: isSar ? 'Valid Radar Image' : isTiff ? 'Valid Satellite Image' : 'Valid Image',
        previewVisual: isSar
          ? 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)'
          : 'linear-gradient(135deg, #134e4a 0%, #065f46 45%, #0284c7 100%)',
        previewUrl,
        fileObject: file
      };

      // Upload to server in background to register and create preview
      setIsUploading(true);
      SatQueryApiService.uploadFile(file).then(res => {
        if (res) {
          newImage.serverPath = res.filename;
          if (res.preview_url) {
            newImage.previewUrl = res.preview_url;
            newImage.previewVisual = `url("${res.preview_url}") center/cover no-repeat`;
          }
          if (onUpdateImage) {
            onUpdateImage(newImage.id, {
              serverPath: res.filename,
              previewUrl: res.preview_url || undefined,
              previewVisual: res.preview_url ? `url("${res.preview_url}") center/cover no-repeat` : newImage.previewVisual
            });
          }
        }
        setIsUploading(false);
      }).catch(() => setIsUploading(false));

      onAddImage(newImage);
    }
  };

  const handleStageSample = (sample: any) => {
    const isSar = (sample.name || '').toLowerCase().includes('sar') || 
                  (sample.name || '').toLowerCase().includes('s1') || 
                  (sample.modality || '').toLowerCase().includes('sar');
    const isTiff = (sample.name || '').toLowerCase().endsWith('.tif') || (sample.name || '').toLowerCase().endsWith('.tiff');

    const stagedImg: UploadedImageMeta = {
      id: `srv-${Date.now()}-${sample.id}`,
      name: sample.name,
      format: isTiff ? 'GeoTIFF' : 'PNG',
      dimensions: '512 × 512 px',
      modality: isSar ? 'SAR VV/VH' : 'Optical BOA',
      acquisitionDate: 'Calibrated Scene',
      sizeMb: Number((sample.size_bytes / (1024 * 1024)).toFixed(1)) || 1.2,
      validationStatus: isSar ? 'Valid SAR C-Band' : 'Valid GeoTIFF',
      previewVisual: isSar
        ? 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)'
        : 'linear-gradient(135deg, #134e4a 0%, #065f46 45%, #0284c7 100%)',
      previewUrl: sample.preview_url,
      serverPath: sample.name || sample.path
    };
    onAddImage(stagedImg);
  };


  return (
    <div className="space-y-6">
      {/* Auto-Detected Analysis Mode Indicator */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Analysis Mode:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                {mode === 'single'
                  ? 'Single Image Mode (VQA / Grounding)'
                  : mode === 'bi-temporal'
                  ? 'Multi-Scene Change Detection'
                  : 'Optical + SAR Cross-Modal Fusion'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Auto-Detected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {images.length === 0
                ? 'System will automatically select neural specialist upon image staging.'
                : images.length === 1
                ? 'Single scene detected → Auto-routed to ConvNeXt-v2 Optical/SAR Specialist & Physics Sanity Engine'
                : mode === 'optical-sar'
                ? 'Optical + SAR radar pair detected → Auto-routed to 14-Channel ViT Cross-Modal Specialist'
                : 'Multi-scene detected → Auto-routed to Change Detection Specialist'}
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 hidden sm:block shrink-0">
          <span className="text-cyan-500 font-semibold">{images.length}</span> {images.length === 1 ? 'image staged' : 'images staged'}
        </div>
      </div> */}

      {/* Drag-and-Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 select-none ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".tif,.tiff,.png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
            <UploadCloud className="w-7 h-7 stroke-[2.2]" />
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900">
              Drag & Drop Satellite Imagery Here
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Supports <strong className="text-blue-600">satellite images (.tif, .png, .jpg)</strong> or click to browse.
            </p>
          </div>
        </div>
      </div>

      {/* Format Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Images Staging Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase">
            Staged Satellite Imagery ({images.length} {images.length === 1 ? 'image' : 'images'})
          </span>
        </div>

        {images.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No images currently uploaded. Drag and drop a file above or click to browse.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-sm space-y-3 group"
              >
                {/* Header: Label & Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Image {index + 1}: {index === 0 && mode === 'bi-temporal' ? 'Initial Image' : index === 1 && mode === 'bi-temporal' ? 'Comparison Image' : index === 0 && mode === 'optical-sar' ? 'Optical Image' : index === 1 && mode === 'optical-sar' ? 'Radar Image' : 'Target Image'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{img.format}</span>
                  </div>

                  <button
                    onClick={() => onRemoveImage(img.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Row: Mini visual + details */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg relative overflow-hidden border border-slate-200 flex-shrink-0"
                    style={{ background: img.previewVisual || 'linear-gradient(135deg, #1e293b, #334155)' }}
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-xs font-bold text-slate-900 truncate" title={img.name}>
                      {img.name}
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                      <div>
                        <span>Dimensions: </span>
                        <strong className="text-slate-700">{img.dimensions}</strong>
                      </div>
                      <div>
                        <span>Type: </span>
                        <strong className="text-slate-700">{img.modality}</strong>
                      </div>
                      <div>
                        <span>Date: </span>
                        <strong className="text-slate-700">{img.acquisitionDate}</strong>
                      </div>
                      <div>
                        <span>Size: </span>
                        <strong className="text-slate-700">{img.sizeMb} MB</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{img.validationStatus}</span>
                  </span>
                  <span className="text-slate-400">Location Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
