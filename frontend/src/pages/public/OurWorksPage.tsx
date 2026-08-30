import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { MapPin, Eye } from 'lucide-react';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { LazyImage } from '../../components/common/LazyImage';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { Project, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const OurWorksPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res: any = await api.get('/projects');
        if (res.data) setProjects(res.data);
      } catch (err) {
        console.error('Failed loading projects portfolio', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <StudioLoader message="Loading Our Works Portfolio..." />;
  }

  return (
    <>
      <DynamicSEO 
        title="Our Works & Portfolio Projects" 
        description="Browse completed interior design, modern villa architecture, and commercial spaces designed by Dot Inspire Design Studio." 
        settings={settings} 
      />

      <div className="pt-32 pb-16 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-sans">
            Studio Portfolio
          </span>
          <h1 className="text-4xl sm:text-6xl font-sans font-bold text-white tracking-tight mb-6">
            Completed Works & Projects
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
            Explore our showcase of completed residential villas, luxury apartments, and commercial sanctuaries across Kerala.
          </p>
        </div>
      </div>

      <section className="pb-24 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-20 bg-charcoal-900 border border-neutral-800 rounded-lg p-8 space-y-3">
              <span className="text-sm font-semibold uppercase tracking-widest text-gold-500 font-sans block">
                No Projects Yet
              </span>
              <p className="text-neutral-400 text-sm font-light">
                No completed portfolio projects have been published by the admin yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/our-works/${project.slug}`}
                  className="group relative aspect-[16/10] rounded-lg overflow-hidden border border-neutral-800 hover:border-gold-500/60 transition-all duration-500 shadow-2xl"
                >
                  <LazyImage
                    src={project.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-0 inset-x-0 p-8 flex items-end justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{project.location || 'Kerala, India'}</span>
                        {project.projectType && <span>• {project.projectType}</span>}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white group-hover:text-gold-300 transition-colors">
                        {project.name}
                      </h3>
                      {project.servicesInvolved && (
                        <p className="text-xs text-neutral-400 font-light line-clamp-1">
                          Services: {project.servicesInvolved}
                        </p>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-gold-500/20">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
