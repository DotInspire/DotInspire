import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface MultiImageUploadInputProps {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  showGalleryToggle?: boolean;
  addToGallery?: boolean;
  onToggleGallery?: (enabled: boolean) => void;
}

export const MultiImageUploadInput: React.FC<MultiImageUploadInputProps> = ({
  label = 'Item Media Photos',
  values = [],
  onChange,
  showGalleryToggle = true,
  addToGallery = true,
  onToggleGallery,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate image files
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not a valid image`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 10MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      // Upload files concurrently to /upload/images (or fallback sequentially if batch error)
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append('images', file);
      });

      let uploadedList: string[] = [];

      try {
        const res: any = await api.post('/upload/images', formData);
        uploadedList = 
          res?.data?.urls || 
          res?.urls || 
          (Array.isArray(res?.data) ? res.data : []) || 
          (Array.isArray(res) ? res : []);
      } catch (batchErr) {
        console.warn('Batch upload route fallback to parallel single uploads:', batchErr);
        // Fallback: Upload each file individually in parallel
        const individualPromises = validFiles.map(async (file) => {
          const singleForm = new FormData();
          singleForm.append('image', file);
          const singleRes: any = await api.post('/upload/image', singleForm);
          return singleRes?.data?.url || singleRes?.url || '';
        });
        const singleResults = await Promise.all(individualPromises);
        uploadedList = singleResults.filter(Boolean);
      }

      if (uploadedList && uploadedList.length > 0) {
        onChange([...values, ...uploadedList]);
        toast.success(`Attached ${uploadedList.length} photo(s) successfully`);
      } else {
        toast.error('No image URLs returned from server');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-neutral-400 uppercase tracking-wider text-[11px] font-semibold">
          {label} ({values.length} attached)
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
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        className="hidden"
      />

      {/* Upload Dropzone / Button */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
          uploading
            ? 'border-gold-500/50 bg-gold-500/5'
            : 'border-neutral-800 hover:border-gold-500/50 bg-charcoal-950/60'
        }`}
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-gold-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading multiple photos to Cloudinary...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-gold-500">
              <UploadCloud className="w-5 h-5" />
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs text-neutral-300 font-medium">
              Click to select & upload multiple photos
            </span>
            <span className="text-[10px] text-neutral-500">Select one or multiple images (PNG, JPG, WEBP)</span>
          </>
        )}
      </div>

      {/* Uploaded Images Grid Gallery */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
          {values.map((url, idx) => (
            <div 
              key={idx} 
              className="relative group rounded-lg border border-neutral-800 overflow-hidden bg-charcoal-950 aspect-video shadow-md"
            >
              <img
                src={url}
                alt={`Item Photo ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-transform active:scale-90"
                  title="Remove this photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-gold-500/90 text-charcoal-950 font-bold text-[8px] px-1 rounded uppercase">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
