import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Compass, Palette, ShieldCheck, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { HeroSection } from '../../components/common/HeroSection';
import { ServiceGrid } from '../../components/common/ServiceGrid';
import { ContactFormSection } from '../../components/common/ContactFormSection';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { LazyImage } from '../../components/common/LazyImage';
import { YouTubeEmbed } from '../../components/common/YouTubeEmbed';
import type { Service, Project, GalleryItem, WebsiteSettings } from '../../types';
import { StudioLoader } from '../../components/common/StudioLoader';
import { api } from '../../services/api';

export const HomePage: React.FC = () => {
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [services, setServices] = useState<Service[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Studio Profile & Story dedicated slideshow images (different from hero)
  const aboutSlides = [
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      title: 'Artisan Venetian Plastering & Finishes',
    },
    {
      url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
      title: 'Bespoke Tailored Furniture & Material Library',
    },
    {
      url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
      title: 'Imported Metallic & Textured Wallpapers',
    },
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      title: 'Custom Motorized Drapes & Velvet Curtains',
    },
  ];

  const [aboutIndex, setAboutIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAboutIndex((prev) => (prev + 1) % aboutSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [aboutSlides.length]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servRes, projRes, gallRes]: any = await Promise.all([
          api.get('/services'),
          api.get('/projects?featured=true'),
          api.get('/gallery'),
        ]);
        if (servRes.data) setServices(servRes.data);
        if (projRes.data) setFeaturedProjects(projRes.data);
        if (gallRes.data) setGalleryItems(gallRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <StudioLoader message="Loading Studio Homepage..." />;
  }

  return (
    <>
      <DynamicSEO settings={settings} />

      {/* 1. HERO SECTION */}
      <HeroSection settings={settings} />

      {/* 2. ABOUT US (STUDIO PROFILE & STORY) SECTION WITH MULTI-IMAGE AUTO-SLIDESHOW */}
      <section className="py-16 sm:py-24 bg-white dark:bg-charcoal-900 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Side: Compact Multi-Image Slideshow Frame (Mobile Optimized) */}
            <div className="lg:col-span-6 relative w-full">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 group">
                {aboutSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      idx === aboutIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <LazyImage
                      src={slide.url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white bg-charcoal-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center justify-between">
                      <span className="truncate">{slide.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dot Indicators Matching Image Count */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {aboutSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAboutIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === aboutIndex ? 'w-6 bg-gold-500' : 'w-2 bg-neutral-400 dark:bg-neutral-700 hover:bg-neutral-600 dark:hover:bg-neutral-500'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Text & Quote */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-500 font-semibold font-sans block">
                Studio Profile & Story
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold text-neutral-900 dark:text-white tracking-tight leading-tight">
                Where Design Mastery <br />
                Meets <span className="text-gold-500">Tactile Quality.</span>
              </h2>

              <blockquote className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-base font-normal italic border-l-2 border-gold-500 pl-3.5 py-1">
                "Building spaces that inspire daily living through seamless interior harmony."
              </blockquote>

              <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal">
                Registered as <strong>Dot Inspire Interior Design Studio LLP</strong>, we operate as a premier interior design studio based in Paingotoor, Kerala.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal">
                We integrate material displays for imported wallpapers, custom motorized blinds, luxury velvet curtains, biophilic indoor plants, and artisan Venetian wall plasters under one roof.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 px-6 py-3 sm:px-7 sm:py-3.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-gold-500/20 active:scale-95"
                >
                  <span>Read Full About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION WITH QUOTE & DEDICATED REDIRECT BUTTON */}
      <section className="py-24 bg-slate-50 dark:bg-charcoal-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8 gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-500 font-semibold block font-sans">
                Our Services & Craftsmanship
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-bold text-neutral-900 dark:text-white tracking-tight">
                Interior Design Solutions
              </h2>
              <blockquote className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal italic border-l-2 border-gold-500 pl-4 py-1 mt-2">
                "Design is not just what it looks like and feels like. Design is how it works and elevates everyday living."
              </blockquote>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-gold-500/20 shrink-0 self-start md:self-end"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ServiceGrid services={services} showHeader={false} />
        </div>
      </section>

      {/* 4. OUR WORKS SECTION WITH QUOTE & DEDICATED REDIRECT BUTTON */}
      <section className="py-24 bg-white dark:bg-charcoal-900 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8 gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-500 font-semibold block font-sans">
                Completed Portfolio
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-bold text-neutral-900 dark:text-white tracking-tight">
                Our Signature Works
              </h2>
              <blockquote className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal italic border-l-2 border-gold-500 pl-4 py-1 mt-2">
                "Every space tells a story of precision, balance, and fine materiality crafted across Kerala."
              </blockquote>
            </div>

            <Link
              to="/our-works"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-gold-500/20 shrink-0 self-start md:self-end"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/our-works/${project.slug}`}
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-neutral-800 hover:border-gold-500/50 transition-all duration-500 shadow-2xl"
                >
                  <LazyImage
                    src={project.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8 flex items-end justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block mb-1">
                        {project.location || 'Kerala'} • {project.projectType || 'Residential'}
                      </span>
                      <h3 className="text-2xl font-sans font-bold text-white group-hover:text-gold-300 transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition-transform">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-charcoal-900 rounded-xl border border-neutral-800 space-y-4">
              <Sparkles className="w-10 h-10 text-gold-500 mx-auto" />
              <h3 className="text-xl font-bold text-white">Explore Completed Interior Projects</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                Visit our dedicated portfolio section to browse residential villas, apartment suites, and commercial designs.
              </p>
              <Link
                to="/our-works"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 text-gold-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition-colors"
              >
                <span>Go to Our Works</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. GALLERY SHOWCASE SECTION WITH QUOTE & DEDICATED REDIRECT BUTTON */}
      <section className="py-24 bg-slate-50 dark:bg-charcoal-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8 gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-500 font-semibold block font-sans">
                Visual Showcase
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-bold text-neutral-900 dark:text-white tracking-tight">
                Studio Visual Gallery
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal border-l-2 border-gold-500 pl-4 py-1 mt-2 leading-relaxed">
                Fine details make the room. Browse high-resolution texture finishes, custom velvet draping, imported wallpapers, and video walk-throughs.
              </p>
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-gold-500/20 shrink-0 self-start md:self-end"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Studio Gallery Live Slider Container (Right to Left Sliding Animation) */}
          {galleryItems.length > 0 ? (
            <div className="relative w-full overflow-hidden py-4 -mx-4 sm:mx-0">
              {/* Subtle Side Vignette Gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-50 dark:from-charcoal-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-50 dark:from-charcoal-950 to-transparent z-10 pointer-events-none" />

              {/* Infinite Right-to-Left Sliding Marquee Track */}
              <div className="animate-gallery-slide gap-6 flex">
                {/* Render Duplicated Stream for Seamless Infinite Loop */}
                {[...galleryItems, ...galleryItems].map((g, idx) => (
                  <div 
                    key={`${g.id || idx}-${idx}`} 
                    className="w-[290px] sm:w-[360px] md:w-[400px] shrink-0 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group shadow-xl bg-white dark:bg-charcoal-900 transition-all hover:scale-[1.02] hover:border-gold-500/60"
                  >
                    {g.type === 'YOUTUBE' ? (
                      <div>
                        <YouTubeEmbed videoId={g.youtubeVideoId || ''} url={g.url} title={g.title || 'Dot Inspire Video Showcase'} />
                        <div className="p-4 bg-white dark:bg-charcoal-900 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white truncate max-w-[200px]">
                              {g.title || 'Studio Video Showcase'}
                            </h4>
                            {g.sourceName && <span className="text-[10px] text-gold-600 dark:text-gold-400 font-mono block mt-0.5 font-bold">{g.sourceName}</span>}
                          </div>
                          {g.targetUrl && (
                            <Link 
                              to={g.targetUrl} 
                              className="p-1.5 bg-slate-100 dark:bg-charcoal-950 hover:bg-gold-500 hover:text-charcoal-950 text-gold-600 dark:text-gold-400 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold"
                            >
                              <span>Explore</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link to={g.targetUrl || '/gallery'} className="block relative aspect-[4/3] group overflow-hidden">
                        <LazyImage
                          src={g.url}
                          alt={g.title || 'Studio Visual Gallery'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div className="max-w-[75%]">
                            <span className="text-[10px] text-gold-400 font-mono block font-bold tracking-wider uppercase">
                              {g.sourceName || 'STUDIO SHOWCASE'}
                            </span>
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate block">
                              {g.title || 'Visual Project Showcase'}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center font-bold shrink-0 ml-2 group-hover:scale-110 transition-transform shadow-lg shadow-gold-500/30">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-charcoal-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 space-y-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest block font-sans">
                Studio Visual Gallery
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                New Media Collections Being Prepared
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                Check back soon for new high-resolution interior photographs and walkthrough tours.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 6. DISTINCTION SECTION */}
      <section className="py-20 bg-white dark:bg-charcoal-900 border-t border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-500 font-semibold mb-2 block font-sans">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-neutral-900 dark:text-white tracking-tight">
              The Dot Inspire Distinction
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-charcoal-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 hover:border-gold-500/40 transition-colors shadow-md">
              <Compass className="w-9 h-9 text-gold-500" />
              <h3 className="text-lg font-sans font-bold">360° VR Experience</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                Step inside your dream space before execution with immersive 360° VR renders & headset walkthroughs.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-charcoal-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 hover:border-gold-500/40 transition-colors shadow-md">
              <Compass className="w-9 h-9 text-gold-500" />
              <h3 className="text-lg font-sans font-bold">Aesthetics</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                We craft interior spaces that prioritize fine balance, spatial harmony, and natural light.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-charcoal-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 hover:border-gold-500/40 transition-colors shadow-md">
              <Palette className="w-9 h-9 text-gold-500" />
              <h3 className="text-lg font-sans font-bold">Uncompromising Materiality</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                From velvet curtains to hand-troweled Venetian plasters, every texture is tested for permanence.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-charcoal-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 hover:border-gold-500/40 transition-colors shadow-md">
              <ShieldCheck className="w-9 h-9 text-gold-500" />
              <h3 className="text-lg font-sans font-bold">Registered LLP Reliability</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                Operating with transparent timelines, structural integrity, and dedicated client management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT & CONSULTATION FORM SECTION */}
      <ContactFormSection services={services} settings={settings} />
    </>
  );
};
