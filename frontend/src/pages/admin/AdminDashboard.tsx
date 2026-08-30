import React, { useState, useEffect } from 'react';
import { Layers, Package, Briefcase, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { StudioLoader } from '../../components/common/StudioLoader';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    servicesCount: 0,
    itemsCount: 0,
    projectsCount: 0,
    galleryCount: 0,
    inquiriesCount: 0,
    unreadInquiries: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const [serv, items, proj, gal, inq]: any = await Promise.all([
          api.get('/services?includeUnpublished=true'),
          api.get('/items?includeUnpublished=true'),
          api.get('/projects?includeUnpublished=true'),
          api.get('/gallery?includeUnpublished=true'),
          api.get('/inquiries'),
        ]);

        const unread = (inq.data || []).filter((i: any) => i.status === 'UNREAD').length;

        setStats({
          servicesCount: serv.data?.length || 0,
          itemsCount: items.data?.length || 0,
          projectsCount: proj.data?.length || 0,
          galleryCount: gal.data?.length || 0,
          inquiriesCount: inq.data?.length || 0,
          unreadInquiries: unread,
        });
      } catch (err) {
        console.error('Failed fetching admin dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <StudioLoader fullScreen={false} message="Loading Studio CMS Overview..." />;
  }

  const cards = [
    { title: 'Services', count: stats.servicesCount, icon: Layers, link: '/admin/services', color: 'text-gold-500' },
    { title: 'Catalog Items', count: stats.itemsCount, icon: Package, link: '/admin/items', color: 'text-amber-400' },
    { title: 'Completed Works', count: stats.projectsCount, icon: Briefcase, link: '/admin/projects', color: 'text-emerald-400' },
    { title: 'Gallery Media', count: stats.galleryCount, icon: ImageIcon, link: '/admin/gallery', color: 'text-blue-400' },
    { title: 'Client Inquiries', count: `${stats.inquiriesCount} (${stats.unreadInquiries} New)`, icon: MessageSquare, link: '/admin/inquiries', color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Studio CMS Overview</h1>
        <p className="text-xs text-neutral-400 mt-1">Summary metrics for Dot Inspire Interior Design Studio LLP</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.title}
              href={c.link}
              className="bg-charcoal-900 border border-neutral-800 p-6 rounded-lg hover:border-gold-500/50 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 block mb-1 font-serif">{c.title}</span>
                <span className="text-2xl font-bold text-white">{c.count}</span>
              </div>
              <div className={`p-3 rounded-full bg-charcoal-950 border border-neutral-800 ${c.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
