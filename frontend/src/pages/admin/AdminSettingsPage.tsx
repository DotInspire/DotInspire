import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { WebsiteSettings } from '../../types';
import { api } from '../../services/api';
import { StudioLoader } from '../../components/common/StudioLoader';

export const AdminSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<WebsiteSettings>({
    id: 'default',
    businessName: 'Dot Inspire Design Studio',
    legalName: 'Dot Inspire Interior Design Studio LLP',
    phone: '7591953607',
    whatsapp: '7591953607',
    email: 'dotinspire787@gmail.com',
    address: 'Paigotoor P.O., Paingotoor, PIN 686671, Kerala, India',
    footerText: 'Crafting timeless interior and architectural environments with passion and gold-standard precision.',
    defaultSeoTitle: 'Dot Inspire Design Studio | Luxury Interior & Exterior Design in Kerala',
    defaultSeoDescription: 'Dot Inspire Interior Design Studio LLP offers premium interior design, exterior architecture, curtains, wallpapers, and décor items in Kerala.',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/settings')
      .then((res: any) => {
        if (res.data) setSettings(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/settings', settings);
      toast.success('Website settings updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <StudioLoader fullScreen={false} message="Loading Website Settings..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Central Website Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">Configure company credentials, phone numbers, and SEO metadata centrally</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-charcoal-900 border border-neutral-800 rounded-lg p-6 space-y-6 shadow-xl text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-serif font-bold text-gold-400 uppercase tracking-widest border-b border-neutral-800 pb-2">
            Company & Studio Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Public Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Legal Company Name</label>
              <input
                type="text"
                value={settings.legalName}
                onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
                className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-serif font-bold text-gold-400 uppercase tracking-widest border-b border-neutral-800 pb-2">
            Contact & WhatsApp Redirection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Studio Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Public Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Studio Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-serif font-bold text-gold-400 uppercase tracking-widest border-b border-neutral-800 pb-2">
            SEO & Social Credentials
          </h3>
          <div>
            <label className="block text-neutral-400 mb-1">Instagram URL</label>
            <input
              type="url"
              value={settings.instagramUrl || ''}
              onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Default SEO Page Title</label>
            <input
              type="text"
              value={settings.defaultSeoTitle || ''}
              onChange={(e) => setSettings({ ...settings, defaultSeoTitle: e.target.value })}
              className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Default Meta Description</label>
            <textarea
              rows={2}
              value={settings.defaultSeoDescription || ''}
              onChange={(e) => setSettings({ ...settings, defaultSeoDescription: e.target.value })}
              className="w-full bg-charcoal-950 border border-neutral-800 rounded p-2.5 text-white"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded flex items-center gap-2 shadow-lg shadow-gold-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
