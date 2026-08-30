import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import type { WebsiteSettings } from '../../types';
import logo from '../../assets/logo.png';
import { WhatsAppIcon, InstagramIcon } from './Icons';

interface NavbarProps {
  settings?: WebsiteSettings | null;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const location = useLocation();

  const phone = settings?.phone || '7591953607';
  const whatsapp = settings?.whatsapp || '7591953607';
  const email = settings?.email || 'dotinspire787@gmail.com';
  const instagram = settings?.instagramUrl || 'https://www.instagram.com/dot_inspire_/';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Our Works', path: '/our-works' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with Black Round Circle Badge behind Logo Emblem */}
          <Link to="/" className="flex items-center gap-3 group z-50">
            <div className="w-11 h-11 rounded-full !bg-black border border-gold-500/50 p-2 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img 
                src={logo} 
                alt="Dot Inspire Interior Design Studio" 
                className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(229,184,11,0.6)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-widest uppercase font-sans leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] !text-white">
                <span className="!text-white">Dot</span> <span className="!text-gold-400">Inspire</span>
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] tracking-widest uppercase font-sans font-semibold mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] !text-neutral-300">
                Interior Design Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Link Bar (Center) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 bg-white/80 dark:bg-charcoal-950/60 backdrop-blur-md px-6 py-2 rounded-full border border-neutral-200 dark:border-white/10 shadow-lg">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive 
                      ? 'text-gold-600 dark:text-gold-400 font-extrabold' 
                      : 'text-neutral-900 dark:text-neutral-200 hover:text-gold-600 dark:hover:text-gold-400'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500 dark:bg-gold-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Floating Action Dock in Top Right (WhatsApp, Call, Email, Instagram) */}
          <div className="flex items-center gap-3.5 bg-charcoal-950/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg">
            <a
              href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent('Hi, I would like to know more about Dot Inspire design services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon-wa text-emerald-400 hover:opacity-80 transition-all hover:scale-110 duration-200"
              aria-label="Chat on WhatsApp"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>

              <a
                href={`tel:+91${phone}`}
                className="nav-icon-phone text-amber-500 hover:opacity-80 transition-all hover:scale-110 duration-200"
                aria-label="Call Us"
                title="Call Us"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${email}`}
                className="nav-icon-mail text-sky-500 hover:opacity-80 transition-all hover:scale-110 duration-200"
                aria-label="Email Studio"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-icon-insta text-pink-500 hover:opacity-80 transition-all hover:scale-110 duration-200"
                aria-label="Instagram Profile"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
    </header>
  );
};
