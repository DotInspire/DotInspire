import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Service, WebsiteSettings } from '../../types';
import { api } from '../../services/api';
import { Send, CheckCircle, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { WhatsAppIcon, InstagramIcon } from './Icons';

interface ContactFormProps {
  services?: Service[];
  settings?: WebsiteSettings | null;
}

export const ContactFormSection: React.FC<ContactFormProps> = ({ services = [], settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceId: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const phone = settings?.phone || '7591953607';
  const whatsapp = settings?.whatsapp || '7591953607';
  const email = settings?.email || 'dotinspire787@gmail.com';
  const instagram = settings?.instagramUrl || 'https://www.instagram.com/dot_inspire_/';
  const address = settings?.address || 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    const cleanName = formData.name.trim();
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    const cleanEmail = formData.email.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanName) {
      toast.error('Please enter your name');
      return;
    }

    if (cleanPhone.length < 7) {
      const err = 'Please enter a valid phone or WhatsApp number (at least 7 digits)';
      setErrorMessage(err);
      toast.error(err);
      return;
    }

    setStatus('submitting');

    try {
      await api.post('/inquiries', {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || undefined,
        serviceId: formData.serviceId || undefined,
        message: cleanMessage || 'Consultation requested via website form.',
      });
      setStatus('success');
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      setFormData({ name: '', phone: '', email: '', serviceId: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      const msg = err.message || 'Failed to submit inquiry. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <section className="py-20 bg-charcoal-900 border-t border-neutral-800" id="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Get In Touch Direct Studio Contact Cards */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block font-sans">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight mb-4">
                Start Your Project <br />
                <span className="text-gold-500">Contact Studio.</span>
              </h2>
              <p className="text-neutral-300 font-normal leading-relaxed text-sm">
                Whether you are planning a residential home, commercial project, curtains, wallpapers, or texture plastering, connect with us directly.
              </p>
            </div>

            {/* Comprehensive Contact Channels List */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              
              {/* WhatsApp */}
              <a
                href={`https://wa.me/91${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-charcoal-950/80 border border-neutral-800/80 rounded-xl hover:border-emerald-500/50 transition-all group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">WhatsApp Business</p>
                    <p className="text-white font-medium text-xs sm:text-sm">+91 {whatsapp}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors shrink-0 ml-2">
                  Open →
                </span>
              </a>

              {/* Instagram */}
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-charcoal-950/80 border border-neutral-800/80 rounded-xl hover:border-pink-500/50 transition-all group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20 shrink-0">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">Instagram Profile</p>
                    <p className="text-white font-medium text-xs sm:text-sm">@dot_inspire_</p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 group-hover:text-pink-300 transition-colors shrink-0 ml-2">
                  Visit →
                </span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:+91${phone}`}
                className="flex items-center justify-between p-3.5 bg-charcoal-950/80 border border-neutral-800/80 rounded-xl hover:border-gold-500/50 transition-all group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">Phone Call</p>
                    <p className="text-white font-medium text-xs sm:text-sm">+91 {phone}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 group-hover:text-gold-300 transition-colors shrink-0 ml-2">
                  Call →
                </span>
              </a>

              {/* Email Address */}
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-between p-3.5 bg-charcoal-950/80 border border-neutral-800/80 rounded-xl hover:border-gold-500/50 transition-all group active:scale-98"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">Public Email</p>
                    <p className="text-white font-medium text-xs sm:text-sm truncate">{email}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 group-hover:text-gold-400 transition-colors shrink-0 ml-2">
                  Send →
                </span>
              </a>

              {/* Studio Location & Google Maps */}
              <a
                href="https://www.google.com/maps/place/DOT+INSPIRE+INTERIOR+DESIGN+STUDIO/@10.0106894,76.6896036,8882m/data=!3m1!1e3!4m6!3m5!1s0x3b07e90044a47105:0x3b8031e08b4df623!8m2!3d10.0073645!4d76.7140332!16s%2Fg%2F11w1m8rwr_?entry=ttu&g_ep=EgoyMDI2MDgxNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-charcoal-950/80 border border-neutral-800/80 rounded-xl hover:border-gold-500/50 transition-all group active:scale-98"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">Studio Location</p>
                    <span className="text-neutral-200 text-xs font-normal block leading-relaxed mt-0.5">
                      {address}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 group-hover:text-gold-300 transition-colors shrink-0 ml-2">
                  Maps →
                </span>
              </a>

            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="bg-charcoal-950 border border-neutral-800 rounded-xl p-8 shadow-2xl relative">
            {status === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-gold-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-sans font-bold text-white">Inquiry Received</h3>
                <p className="text-neutral-300 text-sm max-w-md mx-auto">
                  Thank you for connecting with Dot Inspire Design Studio. Our design consultants will reach out to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-sans font-bold text-white mb-2">Request Design Consultation</h3>

                {status === 'error' && (
                  <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-charcoal-900 border border-neutral-800 rounded-lg px-4 py-3 text-white text-xs sm:text-sm focus:border-gold-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold font-sans">
                    Phone / WhatsApp Number <span className="text-gold-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs text-neutral-400 bg-charcoal-900 border border-r-0 border-neutral-800 rounded-l-lg font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-charcoal-900 border border-neutral-800 rounded-r-lg px-4 py-3 text-white text-xs sm:text-sm focus:border-gold-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold font-sans">
                    Email Address <span className="text-neutral-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-charcoal-900 border border-neutral-800 rounded-lg px-4 py-3 text-white text-xs sm:text-sm focus:border-gold-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold font-sans">
                    Interested Design Service
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full bg-charcoal-900 border border-neutral-800 rounded-lg px-4 py-3 text-white text-xs sm:text-sm focus:border-gold-500 focus:outline-none transition-colors"
                  >
                    <option value="">General Inquiry / Consultation</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold font-sans">
                    Project Details / Requirements <span className="text-gold-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-charcoal-900 border border-neutral-800 rounded-lg p-4 text-white text-xs sm:text-sm focus:border-gold-500 focus:outline-none transition-colors"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
