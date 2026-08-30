import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { FloatingContactBar } from '../components/common/FloatingContactBar';
import { StudioChatbot } from '../components/common/StudioChatbot';
import { ScrollToTop } from '../components/common/ScrollToTop';
import type { WebsiteSettings } from '../types';
import { api } from '../services/api';

export const PublicLayout: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res: any = await api.get('/settings');
        if (res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        setSettings({
          id: 'default',
          businessName: 'Dot Inspire Design Studio',
          legalName: 'Dot Inspire Interior Design Studio LLP',
          phone: '7591953607',
          whatsapp: '7591953607',
          email: 'dotinspire787@gmail.com',
          address: 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India',
        });
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-neutral-800 dark:bg-charcoal-950 dark:text-neutral-200 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#171717',
            color: '#fff',
            border: '1px solid #333',
            fontSize: '13px',
          },
        }}
      />
      <ScrollToTop />
      <Navbar settings={settings} />
      <main className="flex-grow">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
      <FloatingContactBar settings={settings} />
      <StudioChatbot settings={settings} />
    </div>
  );
};
