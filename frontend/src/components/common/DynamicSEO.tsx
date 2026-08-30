import React, { useEffect } from 'react';
import type { WebsiteSettings } from '../../types';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  settings?: WebsiteSettings | null;
}

export const DynamicSEO: React.FC<DynamicSEOProps> = ({ title, description, settings }) => {
  useEffect(() => {
    const defaultTitle = settings?.defaultSeoTitle || 'Dot Inspire Interior Design Studio | Luxury Interior & Exterior Design';
    const defaultDesc = settings?.defaultSeoDescription || 'Dot Inspire Interior Design Studio LLP offers luxury interior design, curtains, wallpapers, and exterior architecture in Kerala.';

    document.title = title ? `${title} | Dot Inspire Interior Design Studio` : defaultTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || defaultDesc);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description || defaultDesc;
      document.head.appendChild(meta);
    }
  }, [title, description, settings]);

  return null;
};
