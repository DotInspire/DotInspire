import React from 'react';
import logo from '../../assets/logo.png';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export const StudioLoader: React.FC<LoaderProps> = ({ fullScreen = true, message }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Ring */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-gold-500/30 animate-ping" />
        
        {/* Spinning Gold Accent Ring */}
        <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        
        {/* Studio Logo in Center with breathing zoom */}
        <div className="absolute w-12 h-12 flex items-center justify-center animate-bounce">
          <img
            src={logo}
            alt="Dot Inspire Interior Design Studio"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(229,184,11,0.5)]"
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-white mt-2">
          Dot <span className="text-gold-400">Inspire</span>
        </span>
        {message && (
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium mt-1">
            {message}
          </span>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};
