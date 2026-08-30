import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { ContactFormSection } from '../../components/common/ContactFormSection';
import { LazyImage } from '../../components/common/LazyImage';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { Service, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const AboutPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/services')
      .then((res: any) => {
        if (res.data) setServices(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <StudioLoader message="Loading Studio Profile..." />;
  }

  return (
    <>
      <DynamicSEO 
        title="About Dot Inspire Interior Design Studio" 
        description="Learn about Dot Inspire Interior Design Studio LLP, our design philosophy, craftsmanship standards, and studio location in Paingotoor, Kerala." 
        settings={settings} 
      />

      <div className="pt-32 pb-20 bg-charcoal-950 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-sans">
            Studio Profile & Philosophy
          </span>
          <h1 className="text-4xl sm:text-6xl font-sans font-bold tracking-tight mb-6">
            Dot Inspire Interior Design Studio
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg font-normal leading-relaxed">
            Registered as <strong>Dot Inspire Interior Design Studio LLP</strong>, we build spaces through seamless interior design harmony.
          </p>
        </div>
      </div>

      <section className="py-24 bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold font-sans">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
                Crafting Practical & <br />
                <span className="text-gold-500">Thoughtful Spaces.</span>
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed font-light">
                Founded with a conviction that luxury interior design should remain minimal, functional, and deeply personal, Dot Inspire offers an end-to-end service scope.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                Our Paingotoor design facility integrates material displays for imported wallpapers, custom motorized blind systems, luxury velvet curtains, biophilic indoor plant design, and artisan Venetian wall plasters.
              </p>
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500" />
                  <span className="text-sm font-medium">360° VR Rendering & Headset/Goggles Walkthroughs</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500" />
                  <span className="text-sm font-medium">Turnkey Residential & Commercial Execution</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500" />
                  <span className="text-sm font-medium">Custom CAD Furniture Modeling & Prototyping</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500" />
                  <span className="text-sm font-medium">Exterior Elevation & Facade Landscaping</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 shadow-2xl">
              <LazyImage
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="Dot Inspire Studio Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <ContactFormSection services={services} settings={settings} />
    </>
  );
};
