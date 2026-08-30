import React, { useState } from 'react';
import { Video, Plus, X, Film } from 'lucide-react';
import { YouTubeEmbed } from '../common/YouTubeEmbed';

interface MultiYouTubeInputProps {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
}

export const MultiYouTubeInput: React.FC<MultiYouTubeInputProps> = ({
  label = 'YouTube Video Tours / Showcases',
  values = [],
  onChange,
}) => {
  const [currentUrl, setCurrentUrl] = useState('');

  const addUrl = () => {
    const trimmed = currentUrl.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setCurrentUrl('');
  };

  const removeUrl = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-gold-400 font-semibold uppercase tracking-wider text-[10px] flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-gold-500" />
          {label} ({values.length} attached)
        </span>
      </label>

      {/* URL Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Video className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Paste YouTube video link (e.g. https://youtu.be/...)"
            className="w-full bg-charcoal-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-white text-xs focus:border-gold-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          disabled={!currentUrl.trim()}
          className="px-3 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-charcoal-950 font-bold text-xs rounded flex items-center gap-1 shrink-0 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Video
        </button>
      </div>

      {/* Attached Video Previews Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {values.map((url, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden border border-neutral-800 bg-black group shadow-md">
              <YouTubeEmbed url={url} autoPlay={false} />
              <button
                type="button"
                onClick={() => removeUrl(idx)}
                className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full transition-transform active:scale-90 shadow-lg z-10"
                title="Remove video"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
