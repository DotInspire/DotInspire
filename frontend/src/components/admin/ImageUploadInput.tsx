import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  showGalleryToggle?: boolean;
  addToGallery?: boolean;
  onToggleGallery?: (enabled: boolean) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label = 'Image',
  value,
  onChange,
  required = false,
  showGalleryToggle = true,
  addToGallery = true,
  onToggleGallery,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be under 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res: any = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.url) {
        onChange(res.data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-neutral-400 uppercase tracking-wider text-[11px] font-semibold">
          {label} {required && '*'}
        </label>
        
        {/* Toggle to include in Visual Gallery (default checked) */}
        {showGalleryToggle && onToggleGallery && (
          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gold-400 select-none hover:text-gold-300 transition-colors">
            <input
              type="checkbox"
              checked={addToGallery}
              onChange={(e) => onToggleGallery(e.target.checked)}
              className="accent-gold-500 rounded cursor-pointer w-3.5 h-3.5"
            />
            <span>Show in Gallery</span>
          </label>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 sm:gap-2 ${
          uploading
            ? 'border-gold-500/50 bg-gold-500/5'
            : 'border-neutral-800 hover:border-gold-500/50 bg-charcoal-950/60'
        }`}
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-gold-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading image to Cloudinary...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500" />
            <span className="text-xs text-neutral-300 font-medium">
              Click to select & upload image
            </span>
            <span className="text-[10px] text-neutral-500">PNG, JPG, WEBP up to 10MB</span>
          </>
        )}
      </div>

      {/* Live Image Preview */}
      {value && value.trim() !== '' && (
        <div className="relative inline-block mt-1 group rounded-lg border border-neutral-800 overflow-hidden bg-charcoal-950 shadow-md">
          <img
            src={value}
            alt="Uploaded Preview"
            className="h-16 sm:h-20 w-28 sm:w-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full transition-transform active:scale-90"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
