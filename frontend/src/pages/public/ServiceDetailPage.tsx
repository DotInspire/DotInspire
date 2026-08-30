import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MessageSquare, Layers } from 'lucide-react';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { LazyImage } from '../../components/common/LazyImage';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { Service, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const whatsapp = settings?.whatsapp || '7591953607';

  useEffect(() => {
    const fetchServiceDetail = async () => {
      setLoading(true);
      try {
        const res: any = await api.get(`/services/${slug}`);
        if (res.data) setService(res.data);
      } catch (err) {
        console.error('Error fetching service details', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchServiceDetail();
  }, [slug]);

  if (loading) {
    return <StudioLoader message="Loading Service Details..." />;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-3xl font-serif font-bold mb-4">Service Not Found</h2>
        <Link to="/services" className="text-gold-500 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <>
      <DynamicSEO 
        title={service.name} 
        description={service.shortDescription} 
        settings={settings} 
      />

      <div className="relative pt-32 pb-20 bg-charcoal-900 border-b border-neutral-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs font-semibold text-gold-500 hover:text-gold-400 uppercase tracking-widest mb-6">
            <ArrowLeft className="w-4 h-4" /> All Services
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-serif">
                Department Overview
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                {service.name}
              </h1>
              <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed mb-6">
                {service.description}
              </p>
              <a
                href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent(`Hi Dot Inspire, I am interested in inquiring about ${service.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider rounded shadow-lg shadow-gold-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire About {service.name}</span>
              </a>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded overflow-hidden border border-neutral-800 shadow-2xl">
                <LazyImage
                  src={service.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-gold-500" />
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Cataloged Items in {service.name}
              </h2>
            </div>
            <span className="text-xs text-neutral-400">{service.items?.length || 0} Items</span>
          </div>

          {!service.items || service.items.length === 0 ? (
            <div className="text-center py-16 bg-charcoal-900 border border-neutral-800 rounded p-8">
              <p className="text-neutral-400 font-light mb-4">No specific items cataloged under this service yet.</p>
              <a
                href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent(`Hi, I would like custom catalog details for ${service.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-500 font-semibold text-xs uppercase tracking-wider hover:underline"
              >
                Request Custom Consultation via WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.items.map((item) => {
                const coverMedia = item.media?.find((m) => m.type === 'IMAGE') || item.media?.[0];
                return (
                  <Link
                    key={item.id}
                    to={`/items/${item.slug}`}
                    className="group bg-charcoal-900 border border-neutral-800 rounded overflow-hidden hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] w-full overflow-hidden relative">
                        <LazyImage
                          src={coverMedia?.url || service.coverImage || 'https://images.unsplash.com/photo-1540518614846-7ede433c5172?auto=format&fit=crop&w=800&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.category && (
                          <span className="absolute top-3 left-3 bg-charcoal-950/80 text-gold-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded border border-neutral-800">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold-400 transition-colors mb-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-neutral-400 font-light line-clamp-3 leading-relaxed mb-4">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-neutral-800/80 bg-charcoal-950/50 flex items-center justify-between text-xs text-gold-500 font-semibold uppercase tracking-wider">
                      <span>View Specifications</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
