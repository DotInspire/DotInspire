import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, MapPin, Sparkles, MessageSquare } from 'lucide-react';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { LazyImage } from '../../components/common/LazyImage';
import { YouTubeEmbed } from '../../components/common/YouTubeEmbed';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { Project, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const whatsapp = settings?.whatsapp || '7591953607';

  useEffect(() => {
    const fetchProjectDetail = async () => {
      setLoading(true);
      try {
        const res: any = await api.get(`/projects/${slug}`);
        if (res.data) setProject(res.data);
      } catch (err) {
        console.error('Error fetching project details', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProjectDetail();
  }, [slug]);

  if (loading) {
    return <StudioLoader message="Loading Portfolio Project..." />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-3xl font-serif font-bold mb-4">Project Not Found</h2>
        <Link to="/our-works" className="text-gold-500 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const projectImages = project.media?.filter((m) => m.type === 'IMAGE') || [];
  const projectVideos = project.media?.filter((m) => m.type === 'YOUTUBE') || [];

  return (
    <>
      <DynamicSEO 
        title={project.name} 
        description={project.description.slice(0, 150)} 
        settings={settings} 
      />

      <div className="relative pt-32 pb-24 bg-charcoal-950 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/our-works"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gold-500 hover:text-gold-400 uppercase tracking-widest mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Projects
          </Link>

          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gold-400 font-semibold">
              <MapPin className="w-4 h-4" />
              <span>{project.location || 'Kerala'}</span>
              {project.projectType && <span>• {project.projectType}</span>}
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight">
              {project.name}
            </h1>

            {project.servicesInvolved && (
              <p className="text-sm text-neutral-400 font-light">
                <strong className="text-white">Services Rendered:</strong> {project.servicesInvolved}
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="py-20 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {project.coverImage && (
            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-neutral-800 shadow-2xl">
              <LazyImage src={project.coverImage} alt={project.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <h2 className="text-2xl font-serif font-bold text-gold-400">Project Overview</h2>
            <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
            <div className="pt-4">
              <a
                href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent(`Hi Dot Inspire, I loved your project '${project.name}' and want a similar design.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded shadow-lg shadow-gold-500/20"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Discuss Similar Project</span>
              </a>
            </div>
          </div>

          {projectImages.length > 0 && (
            <div className="space-y-8 pt-12 border-t border-neutral-800">
              <h3 className="text-2xl font-serif font-bold text-white text-center">
                Project Gallery Showcase
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projectImages.map((img, idx) => (
                  <div 
                    key={img.id} 
                    className={`rounded-lg overflow-hidden border border-neutral-800 bg-charcoal-900 ${
                      idx % 3 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                    }`}
                  >
                    <LazyImage src={img.url} alt={img.title || project.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {projectVideos.length > 0 && (
            <div className="space-y-8 pt-12 border-t border-neutral-800">
              <h3 className="text-2xl font-serif font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-gold-500" /> Architectural Video Tour
              </h3>
              <div className="max-w-4xl mx-auto space-y-8">
                {projectVideos.map((vid) => (
                  <YouTubeEmbed key={vid.id} videoId={vid.youtubeVideoId || ''} title={vid.title || project.name} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
