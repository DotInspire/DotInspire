import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '../../types';
import { LazyImage } from '../common/LazyImage';

interface ServiceGridProps {
  services: Service[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ 
  services, 
  title = "Our Core Offerings", 
  subtitle = "Tailored interior design and finishing services designed to transform empty spaces into living masterpieces.",
  showHeader = true,
}) => {
  return (
    <section className={showHeader ? "py-20 bg-charcoal-950 text-white" : "text-white"}>
      <div className={showHeader ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : ""}>
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-800 pb-6 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-sans">
                Design Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-neutral-400 text-sm sm:text-base mt-2 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors group"
            >
              <span>View All Services</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        )}

        {services.length === 0 ? (
          <div className="text-center py-20 bg-charcoal-900 border border-neutral-800/80 rounded-lg p-8 space-y-3">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold-500 font-serif block">
              No Content Yet
            </span>
            <p className="text-neutral-400 text-sm font-light">
              No services have been published by the admin yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group flex flex-col bg-charcoal-900 border border-neutral-800/80 rounded overflow-hidden hover:border-gold-500/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <LazyImage
                    src={service.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal-950/80 text-gold-500 flex items-center justify-center border border-neutral-700 group-hover:bg-gold-500 group-hover:text-charcoal-950 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-white group-hover:text-gold-400 transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 group-hover:text-gold-500 transition-colors">
                    <span>Explore Items</span>
                    <span className="font-semibold">{service._count?.items ?? 0} Cataloged</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
