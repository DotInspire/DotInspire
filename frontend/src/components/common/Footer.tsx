import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import type { WebsiteSettings } from '../../types';
import logo from '../../assets/logo.png';
import { WhatsAppIcon, InstagramIcon } from './Icons';

interface FooterProps {
  settings?: WebsiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const year = new Date().getFullYear();

  const phone = settings?.phone || '7591953607';
  const whatsapp = settings?.whatsapp || '7591953607';
  const email = settings?.email || 'dotinspire787@gmail.com';
  const address = settings?.address || 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India';
  const legalName = settings?.legalName || 'Dot Inspire Interior Design Studio LLP';

  return (
    <footer className="bg-charcoal-950 text-neutral-400 border-t border-neutral-800/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Dot Inspire Interior Design Studio" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-widest text-white uppercase font-serif">
                  Dot <span className="text-gold-500">Inspire</span>
                </span>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-sans -mt-1 font-semibold">
                  Interior Design Studio
                </span>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              {settings?.footerText || 'Crafting timeless interior environments with passion, sophistication, and gold-standard precision.'}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest text-white uppercase font-serif border-b border-neutral-800 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-gold-500 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-gold-500 transition-colors">Services & Solutions</Link></li>
              <li><Link to="/our-works" className="hover:text-gold-500 transition-colors">Completed Projects</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-500 transition-colors">Visual Portfolio</Link></li>
              <li><Link to="/about" className="hover:text-gold-500 transition-colors">About Studio</Link></li>
              <li><Link to="/contact" className="hover:text-gold-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest text-white uppercase font-serif border-b border-neutral-800 pb-2 inline-block">
              Our Expertise
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>Interior Design & Execution</li>
              <li>Exterior Facade & Elevations</li>
              <li>Blinds & Motorized Systems</li>
              <li>Premium Cloth Curtains</li>
              <li>Designer Wallpapers & Murals</li>
              <li>Venetian Plaster & Texture Work</li>
              <li>Bespoke Furniture Modeling</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest text-white uppercase font-serif border-b border-neutral-800 pb-2 inline-block">
              Studio Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/place/DOT+INSPIRE+INTERIOR+DESIGN+STUDIO/@10.0106894,76.6896036,8882m/data=!3m1!1e3!4m6!3m5!1s0x3b07e90044a47105:0x3b8031e08b4df623!8m2!3d10.0073645!4d76.7140332!16s%2Fg%2F11w1m8rwr_?entry=ttu&g_ep=EgoyMDI2MDgxNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-gold-400 transition-colors"
                >
                  {address} (View on Google Maps)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href={`tel:+91${phone}`} className="text-neutral-300 hover:text-gold-500 transition-colors">+91 {phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`https://wa.me/91${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-gold-500 transition-colors">WhatsApp: +91 {whatsapp}</a>
              </li>
              <li className="flex items-center gap-3">
                <InstagramIcon className="w-4 h-4 text-pink-500 shrink-0" />
                <a href={settings?.instagramUrl || 'https://www.instagram.com/dot_inspire_/'} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-gold-500 transition-colors">@dot_inspire_</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href={`mailto:${email}`} className="text-neutral-300 hover:text-gold-500 transition-colors">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {year} {legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Paingotoor, Kerala, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
