import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { LazyImage } from '../../components/common/LazyImage';
import { YouTubeEmbed } from '../../components/common/YouTubeEmbed';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { GalleryItem, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const GalleryPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        // Fetch randomly shuffled auto-populated gallery
        const res: any = await api.get('/gallery');
        if (res.data) setGallery(res.data);
      } catch (err) {
        console.error('Failed loading gallery items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return <StudioLoader message="Loading Visual Gallery..." />;
  }

  return (
    <>
      <DynamicSEO 
        title="Visual Gallery & Design Showcase" 
        description="Visual portfolio of high-end interior textures, curtains, furniture modeling, and architectural elevations by Dot Inspire." 
        settings={settings} 
      />

      <div className="pt-32 pb-16 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-sans">
            Visual Portfolio
          </span>
          <h1 className="text-4xl sm:text-6xl font-sans font-bold text-white tracking-tight mb-6">
            Curated Visual Gallery
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
            An editorial stream showcasing our craftsmanship, material finishes, fabric draping, and video walk-throughs. Click on any showcase image to explore the dedicated project or service.
          </p>
        </div>
      </div>

      <section className="pb-24 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {gallery.length === 0 ? (
            <div className="text-center py-20 bg-charcoal-900 border border-neutral-800 rounded-lg p-8 space-y-3">
              <span className="text-sm font-semibold uppercase tracking-widest text-gold-500 font-sans block">
                No Gallery Items Yet
              </span>
              <p className="text-neutral-400 text-sm font-light">
                Media assets uploaded to Services, Works, and Items will automatically appear in this visual gallery.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {gallery.map((item) => (
                <div 
                  key={item.id} 
                  className="break-inside-avoid rounded-xl overflow-hidden bg-charcoal-900 border border-neutral-800 hover:border-gold-500/50 transition-all group shadow-xl"
                >
                  {item.type === 'YOUTUBE' ? (
                    <div>
                      <YouTubeEmbed videoId={item.youtubeVideoId || ''} url={item.url} title={item.title || 'Gallery Video'} />
                      <div className="p-4 bg-charcoal-900 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-sans font-semibold text-white">{item.title}</h4>
                          {item.description && <p className="text-xs text-neutral-400 mt-0.5 font-light">{item.description}</p>}
                        </div>
                        {item.targetUrl && (
                          <Link 
                            to={item.targetUrl}
                            className="p-2 bg-charcoal-950 hover:bg-gold-500 hover:text-charcoal-950 text-gold-400 rounded-lg transition-colors shrink-0 ml-2"
                            title="Explore Page"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : item.targetUrl ? (
                    <Link to={item.targetUrl} className="block relative group">
                      <LazyImage 
                        src={item.url} 
                        alt={item.title || 'Gallery showcase image'} 
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="text-[10px] text-gold-400 font-mono uppercase tracking-widest block mb-0.5 font-semibold">
                              {item.sourceName || 'Explore'}
                            </span>
                            <h4 className="text-sm font-sans font-bold text-white leading-snug">{item.title}</h4>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center font-bold shrink-0 ml-3">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      {item.title && (
                        <div className="p-4 bg-charcoal-900 group-hover:hidden">
                          <h4 className="text-sm font-sans font-semibold text-white">{item.title}</h4>
                          {item.description && <p className="text-xs text-neutral-400 mt-1 font-light line-clamp-2">{item.description}</p>}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div className="relative group">
                      <LazyImage src={item.url} alt={item.title || 'Gallery showcase image'} className="w-full h-auto object-cover" />
                      {item.title && (
                        <div className="p-4 bg-charcoal-900">
                          <h4 className="text-sm font-sans font-semibold text-white">{item.title}</h4>
                          {item.description && <p className="text-xs text-neutral-400 mt-1 font-light">{item.description}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
