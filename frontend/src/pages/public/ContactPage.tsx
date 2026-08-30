import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { DynamicSEO } from '../../components/common/DynamicSEO';
import { ContactFormSection } from '../../components/common/ContactFormSection';
import { StudioLoader } from '../../components/common/StudioLoader';
import type { Service, WebsiteSettings } from '../../types';
import { api } from '../../services/api';

export const ContactPage: React.FC = () => {
  const { settings } = useOutletContext<{ settings: WebsiteSettings | null }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/services')
      .then((res: any) => {
        if (res.data) setServices(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const phone = settings?.phone || '7591953607';
  const whatsapp = settings?.whatsapp || '7591953607';
  const email = settings?.email || 'dotinspire787@gmail.com';
  const address = settings?.address || 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India';

  if (loading) {
    return <StudioLoader message="Loading Contact Studio..." />;
  }

  return (
    <>
      <DynamicSEO 
        title="Contact Dot Inspire Design Studio" 
        description="Get in touch with Dot Inspire Interior Design Studio LLP in Paingotoor, Kerala via WhatsApp (+91 7591953607), call, or email." 
        settings={settings} 
      />

      <div className="pt-32 pb-16 bg-charcoal-950 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-sans">
            Studio Communications
          </span>
          <h1 className="text-4xl sm:text-6xl font-sans font-bold tracking-tight mb-6">
            Contact Our Design Team
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
            We welcome inquiries for new residential homes, commercial suites, and interior curtain & texture projects across Kerala.
          </p>
        </div>
      </div>

      <section className="py-16 bg-charcoal-950 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <a
              href={`tel:+91${phone}`}
              className="p-6 bg-charcoal-900 border border-neutral-800 rounded hover:border-gold-500 transition-colors flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-charcoal-950 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-serif block">Call Studio</span>
                <span className="text-base font-bold text-white font-mono">+91 {phone}</span>
              </div>
            </a>

            <a
              href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent('Hi Dot Inspire, I am reaching out through your website contact page.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-charcoal-900 border border-neutral-800 rounded hover:border-emerald-500 transition-colors flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-serif block">WhatsApp Direct</span>
                <span className="text-base font-bold text-white font-mono">+91 {whatsapp}</span>
              </div>
            </a>

            <a
              href={`mailto:${email}`}
              className="p-6 bg-charcoal-900 border border-neutral-800 rounded hover:border-gold-500 transition-colors flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-charcoal-950 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-serif block">Email Inquiry</span>
                <span className="text-xs font-semibold text-white break-all">{email}</span>
              </div>
            </a>

            <div className="p-6 bg-charcoal-900 border border-neutral-800 rounded flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-serif block">Registered Office</span>
                <span className="text-xs text-neutral-300 font-light">{address}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactFormSection services={services} settings={settings} />
    </>
  );
};
