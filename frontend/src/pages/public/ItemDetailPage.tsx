import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { LazyImage } from '../../components/common/LazyImage';
import { YouTubeEmbed } from '../../components/common/YouTubeEmbed';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { Item, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const ItemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [item, setItem] = useState<Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const whatsapp = settings?.whatsapp || '7591953607';

  useEffect(() => {
    const fetchItemDetail = async () => {
      setLoading(true);
      try {
        const res: any = await api.get(`/items/${slug}`);
        if (res.data) {
          setItem(res.data.item);
          setRelatedItems(res.data.relatedItems || []);
          const firstImage = res.data.item.media?.find((m: any) => m.type === 'IMAGE');
          if (firstImage) {
            setActiveMedia(firstImage.url);
          } else if (res.data.item.media?.length > 0) {
            setActiveMedia(res.data.item.media[0].url);
          }
        }
      } catch (err) {
        console.error('Error fetching item details', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchItemDetail();
  }, [slug]);

  if (loading) {
    return <StudioLoader message="Loading Catalog Item..." />;
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-3xl font-serif font-bold mb-4">Item Not Found</h2>
        <Link to="/services" className="text-gold-500 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>
    );
  }

  const youtubeVideos = item.media?.filter((m) => m.type === 'YOUTUBE') || [];
  const imageMedia = item.media?.filter((m) => m.type === 'IMAGE') || [];

  return (
    <>
      <DynamicSEO 
        title={item.name} 
        description={item.shortDescription} 
        settings={settings} 
      />

      <div className="pt-32 pb-20 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {item.service && (
            <Link
              to={`/services/${item.service.slug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-500 hover:text-gold-400 uppercase tracking-widest mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to {item.service.name}
            </Link>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 bg-charcoal-900 shadow-2xl relative">
                <LazyImage
                  src={activeMedia || 'https://images.unsplash.com/photo-1540518614846-7ede433c5172?auto=format&fit=crop&w=1200&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {imageMedia.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {imageMedia.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMedia(m.url)}
                      className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                        activeMedia === m.url ? 'border-gold-500 scale-95' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {youtubeVideos.length > 0 && (
                <div className="pt-6 border-t border-neutral-800 space-y-4">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold-500" /> Video Showcase
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {youtubeVideos.map((vid) => (
                      <YouTubeEmbed
                        key={vid.id}
                        videoId={vid.youtubeVideoId || ''}
                        title={vid.title || item.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-8 bg-charcoal-900 border border-neutral-800 p-8 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-gold-500" />
                  <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold font-serif">
                    {item.category || item.service?.name || 'Curated Specification'}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-4">
                  {item.name}
                </h1>
                <p className="text-neutral-300 text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-800">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white font-serif">
                  Material & Technical Details
                </h3>

                {item.material && (
                  <div className="flex justify-between py-2 border-b border-neutral-800/60 text-xs">
                    <span className="text-neutral-400">Material Composition</span>
                    <span className="text-white font-medium">{item.material}</span>
                  </div>
                )}

                {item.category && (
                  <div className="flex justify-between py-2 border-b border-neutral-800/60 text-xs">
                    <span className="text-neutral-400">Category / Type</span>
                    <span className="text-white font-medium">{item.category}</span>
                  </div>
                )}

                {item.specifications && (
                  <div className="pt-2 text-xs">
                    <span className="text-neutral-400 block mb-1">Additional Specifications</span>
                    <p className="text-neutral-300 font-light leading-relaxed whitespace-pre-line bg-charcoal-950 p-3 rounded border border-neutral-800">
                      {item.specifications}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Custom measurements & samples available across Kerala.</span>
                </div>
                <a
                  href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent(`Hi Dot Inspire, I am inquiring about the item: ${item.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Inquire Specs via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {relatedItems.length > 0 && (
            <div className="mt-24 pt-12 border-t border-neutral-800">
              <h2 className="text-2xl font-serif font-bold text-white mb-8">
                More in {item.service?.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedItems.map((rel) => {
                  const relCover = rel.media?.find((m) => m.type === 'IMAGE')?.url || 'https://images.unsplash.com/photo-1540518614846-7ede433c5172?auto=format&fit=crop&w=600&q=80';
                  return (
                    <Link
                      key={rel.id}
                      to={`/items/${rel.slug}`}
                      className="group bg-charcoal-900 border border-neutral-800 rounded overflow-hidden hover:border-gold-500/50 transition-all"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img src={relCover} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-serif font-bold text-white group-hover:text-gold-400 transition-colors">
                          {rel.name}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{rel.shortDescription}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
