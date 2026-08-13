import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { api } from '../services/api';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Image',
  description = 'Upload an image from your device or paste a URL.',
  placeholder = 'https://...'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP, etc.).');
      return;
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('File size too large. Please select an image under 15MB.');
      return;
    }

    try {
      setError(null);
      setUploading(true);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        try {
          const res = await api.uploadImage(base64, file.name);
          onChange(res.url);
          setUploading(false);
        } catch (err: any) {
          console.error('Upload failed, using base64 fallback:', err);
          // If server fails, use base64 data URL
          onChange(base64);
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-stone-700">{label}</label>
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'upload' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'url' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {description && <p className="text-[11px] text-stone-500">{description}</p>}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="relative group rounded-2xl border border-stone-200 bg-stone-50 p-2 flex items-center gap-3 overflow-hidden">
          <img
            src={value}
            alt="Uploaded Preview"
            referrerPolicy="no-referrer"
            className="w-16 h-16 object-cover rounded-xl border border-stone-200 bg-white shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80';
            }}
          />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">Image Attached</span>
            </div>
            <p className="text-[10px] text-stone-500 font-mono truncate">{value}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-600 bg-emerald-50/50'
              : 'border-stone-200 hover:border-emerald-500 bg-stone-50/60 hover:bg-stone-50'
          }`}
        >
          {uploading ? (
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-emerald-700 animate-spin" />
              <p className="text-xs font-bold text-stone-700">Uploading image file...</p>
            </div>
          ) : (
            <div className="py-1 space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">
                  Click to browse or drag & drop image file
                </p>
                <p className="text-[10px] text-stone-400">PNG, JPG, WEBP, GIF up to 15MB</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
