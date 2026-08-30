import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WebsiteSettings } from '../../types';

interface HeroProps {
  settings?: WebsiteSettings | null;
}

export const HeroSection: React.FC<HeroProps> = ({ settings }) => {
  const whatsapp = settings?.whatsapp || '7591953607';

  // Carousel background showcase images (Dark, moody, luxury aesthetic)
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85',
      title: 'Moody Luxury Living & Custom Fabrics',
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85',
      title: 'Evening Exterior Facade & Illumination',
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85',
      title: 'Dark Charcoal Lounge & Bespoke Woodwork',
    },
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
      title: 'Motorized Blinds & Ambient Illumination',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = slides.length;
  const safeIndex = totalSlides > 0 ? ((currentIndex % totalSlides) + totalSlides) % totalSlides : 0;
  const activeSlide = slides[safeIndex] || slides[0];

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handlePrev = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  return (
    <section id="hero-section" className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center justify-center bg-charcoal-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Full-Bleed Auto-Scrolling Background Image Slideshow */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === safeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover object-center animate-slow-zoom brightness-95"
          />
          {/* Dual Theme Backdrop Veil: High Contrast Luxury Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />
        </div>
      ))}

      {/* Main Content Overlay Layer */}
      <div className="relative z-10 max-w-5xl w-full mx-auto text-left space-y-6 sm:space-y-8">
        
        {/* Studio Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/20 text-gold-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          <span className="hero-white-text text-white">Dot Inspire Interior Design Studio LLP</span>
        </div>

        {/* Single-Row Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] flex flex-wrap items-center gap-x-3 gap-y-1 [text-shadow:_0_2px_14px_rgba(0,0,0,0.9)]">
            <span className="hero-white-text text-white">Interior Design Studio</span>
            <span className="text-gold-400 font-bold">— Design & Execution</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base lg:text-lg text-neutral-100 font-normal leading-relaxed [text-shadow:_0_1px_10px_rgba(0,0,0,0.9)]">
            Transforming spaces with complete turnkey solutions — interior design, exterior elevations, blinds, curtains, wallpapers, and bespoke furniture modeling.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
          <div className="hero-pill flex items-center gap-2 text-[11px] sm:text-xs text-white font-medium bg-black/50 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-md shadow">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span className="hero-pill-text text-white">360° VR Walkthrough & Goggles</span>
          </div>
          <div className="hero-pill flex items-center gap-2 text-[11px] sm:text-xs text-white font-medium bg-black/50 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-md shadow">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span className="hero-pill-text text-white">3D CAD Modeling</span>
          </div>
          <div className="hero-pill flex items-center gap-2 text-[11px] sm:text-xs text-white font-medium bg-black/50 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-md shadow">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span className="hero-pill-text text-white">Custom Curtains & Blinds</span>
          </div>
          <div className="hero-pill flex items-center gap-2 text-[11px] sm:text-xs text-white font-medium bg-black/50 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-md shadow">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span className="hero-pill-text text-white">Turnkey Execution</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-2.5 sm:gap-4 pt-2">
          <Link
            to="/our-works"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-lg transition-all duration-300 shadow-md shadow-gold-500/20 active:scale-95 shrink-0"
          >
            <span>View Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent('Hi Dot Inspire, I am interested in discussing an interior design project.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-consult-btn inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3 bg-black/50 hover:bg-black/70 text-white border border-white/30 hover:border-gold-500/60 font-semibold text-[11px] sm:text-xs uppercase tracking-wider rounded-lg backdrop-blur-md transition-all duration-300 active:scale-95 shrink-0"
          >
            <span className="hero-white-text text-white">Consult Team</span>
          </a>
        </div>

      </div>

      {/* Slideshow Controls & Indicators */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Active Slide Title */}
        <div className="hero-slide-badge hidden sm:block text-xs font-medium text-neutral-300 bg-charcoal-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-auto">
          <span className="text-gold-400 font-bold uppercase tracking-wider mr-2 font-mono">0{safeIndex + 1}</span>
          <span>{activeSlide.title}</span>
        </div>

        {/* Slide Indicators & Navigation Arrows */}
        <div className="flex items-center gap-3 ml-auto pointer-events-auto">
          <button
            onClick={handlePrev}
            className="hero-control-btn w-9 h-9 rounded-full bg-charcoal-950/80 hover:bg-gold-500 hover:text-charcoal-950 text-white border border-white/20 flex items-center justify-center transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === safeIndex ? 'w-6 bg-gold-500' : 'w-2 bg-white/30'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="hero-control-btn w-9 h-9 rounded-full bg-charcoal-950/80 hover:bg-gold-500 hover:text-charcoal-950 text-white border border-white/20 flex items-center justify-center transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </section>
  );
};
