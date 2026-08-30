import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId?: string;
  url?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

export const extractYouTubeId = (urlOrId: string): string => {
  if (!urlOrId) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
};

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  videoId, 
  url, 
  title = 'Video player', 
  className = '',
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const cleanId = extractYouTubeId(videoId || url || '');

  const thumbnailUrl = `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;

  if (!cleanId) {
    return (
      <div className={`relative aspect-video w-full rounded-lg bg-charcoal-900 border border-neutral-800 flex items-center justify-center p-4 text-center ${className}`}>
        <p className="text-xs text-neutral-400">Invalid YouTube video</p>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div 
        className={`relative aspect-video w-full rounded-lg overflow-hidden bg-charcoal-900 group cursor-pointer border border-neutral-800 hover:border-gold-500/50 transition-all duration-300 ${className}`}
        onClick={() => setIsPlaying(true)}
      >
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${cleanId}/default.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center pl-1 shadow-xl shadow-gold-500/30 group-hover:scale-110 active:scale-95 transition-transform">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
          </div>
        </div>
        {title && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
            <p className="text-white text-xs sm:text-sm font-semibold line-clamp-1">{title}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-neutral-800 ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      ></iframe>
    </div>
  );
};
