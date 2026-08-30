import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Briefcase, Image as ImageIcon, Info, MessageSquare } from 'lucide-react';
import type { WebsiteSettings } from '../../types';

interface ContactBarProps {
  settings?: WebsiteSettings | null;
}

export const FloatingContactBar: React.FC<ContactBarProps> = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Layers },
    { name: 'Works', path: '/our-works', icon: Briefcase },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Fixed Transparent Glass Navigation Bottom Dock */}
      <div className="sm:hidden fixed bottom-4 inset-x-3 z-50 bg-charcoal-950/80 backdrop-blur-xl border border-white/15 rounded-2xl py-2 px-1 shadow-2xl flex items-center justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-gold-400 scale-105' 
                  : 'text-neutral-400 hover:text-white active:scale-95'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-gold-400' : ''}`} />
              <span className={`text-[9px] font-sans font-bold uppercase tracking-wider mt-1 ${
                isActive ? 'text-gold-400 font-extrabold' : 'text-neutral-300'
              }`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
