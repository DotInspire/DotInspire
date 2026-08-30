import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ServiceGrid } from '../../components/common/ServiceGrid';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { Service, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const ServicesPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res: any = await api.get('/services');
        if (res.data) setServices(res.data);
      } catch (err) {
        console.error('Failed loading services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <StudioLoader message="Loading Services Catalog..." />;
  }

  return (
    <>
      <DynamicSEO 
        title="Services & Design Offerings" 
        description="Explore Dot Inspire Interior Design Studio's full range of services: interior design, curtains, wallpapers, Venetian plasters, and custom furniture modeling." 
        settings={settings} 
      />

      <div className="pt-32 pb-12 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-sans">
            Design Catalog
          </span>
          <h1 className="text-4xl sm:text-6xl font-sans font-bold text-white tracking-tight mb-6">
            Services & Interior Design Solutions
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
            Select a service to view specialized item catalogs, material specifications, gallery showcases, and customized solutions.
          </p>
        </div>
      </div>

      <ServiceGrid 
        services={services} 
        title="All Design Departments" 
        subtitle="Every department is backed by experienced craftsmen and high-grade materials." 
      />
    </>
  );
};
