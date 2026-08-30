import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  Briefcase, 
  Image as ImageIcon, 
  MessageSquare, 
  LogOut, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StudioLoader } from '../components/common/StudioLoader';
import { api } from '../services/api';
import logo from '../assets/logo.png';
import type { User } from '../types';

export const AdminLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/auth/me')
      .then((res: any) => {
        if (res.data) setUser(res.data);
      })
      .catch(() => {
        navigate('/admin/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('dot_inspire_token');
      navigate('/admin/login');
    }
  };

  if (loading) {
    return <StudioLoader message="Authenticating Studio CMS Portal..." />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, short: 'Dash' },
    { name: 'Services', path: '/admin/services', icon: Layers, short: 'Services' },
    { name: 'Items Catalog', path: '/admin/items', icon: Package, short: 'Catalog' },
    { name: 'Works', path: '/admin/projects', icon: Briefcase, short: 'Works' },
    { name: 'Visual Gallery', path: '/admin/gallery', icon: ImageIcon, short: 'Gallery' },
    { name: 'Client Inquiries', path: '/admin/inquiries', icon: MessageSquare, short: 'Leads' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-charcoal-950 text-slate-900 dark:text-neutral-200 flex flex-col md:flex-row pb-20 md:pb-0 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#171717',
            color: '#ffffff',
            border: '1px solid #333333',
            fontSize: '13px',
          },
        }}
      />

      {/* Desktop Sidebar (Visible on md and larger screens) */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-charcoal-900 border-r border-neutral-800/90 p-6 shrink-0 h-screen sticky top-0 shadow-xl">
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
            {/* Round Black Circle Behind Logo Icon Only */}
            <div className="w-10 h-10 rounded-full !bg-black border border-gold-500/50 p-2 flex items-center justify-center shadow-md shrink-0">
              <img src={logo} alt="Dot Inspire" className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(229,184,11,0.6)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-serif font-bold text-white tracking-wide leading-none">Dot Inspire</span>
              <span className="text-[9px] text-gold-400 uppercase tracking-widest font-mono mt-1 font-bold">Studio CMS</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive 
                      ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md shadow-gold-500/20' 
                      : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-800 space-y-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-gold-400 transition-colors font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live Website
          </a>

          <div className="flex items-center justify-between bg-charcoal-950/60 p-2.5 rounded-lg border border-neutral-800">
            <div className="flex flex-col truncate pr-2">
              <span className="text-xs font-bold text-white truncate">{user?.name || 'Studio Admin'}</span>
              <span className="text-[10px] text-neutral-400 truncate">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (Visible on small screens) */}
      <header className="md:hidden sticky top-0 z-30 bg-charcoal-900/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full !bg-black border border-gold-500/50 p-1.5 flex items-center justify-center shadow-sm shrink-0">
            <img src={logo} alt="Dot Inspire" className="w-full h-full object-contain drop-shadow-[0_0_4px_rgba(229,184,11,0.6)]" />
          </div>
          <span className="font-serif font-bold text-white text-xs tracking-wide">
            Dot Inspire CMS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-charcoal-950 border border-neutral-800 text-neutral-300 rounded text-xs"
            title="Live Site"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="p-1.5 bg-charcoal-950 border border-neutral-800 hover:border-rose-600 text-neutral-400 hover:text-rose-400 rounded text-xs transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Floating Navigation Dock (Hidden on md: and larger screens) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-charcoal-900/95 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-1 shadow-2xl shadow-black/80 flex items-center gap-1 w-full max-w-md justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative flex-1 text-center group ${
                  isActive
                    ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md shadow-gold-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-charcoal-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[9px] mt-0.5 tracking-tight font-medium">
                  {item.short}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
