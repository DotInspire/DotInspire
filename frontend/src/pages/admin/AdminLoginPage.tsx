import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import logo from '../../assets/logo.png';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        localStorage.setItem('dot_inspire_token', res.data.token);
      }
      if (rememberMe) {
        localStorage.setItem('dot_inspire_remember_email', email);
      } else {
        localStorage.removeItem('dot_inspire_remember_email');
      }
      toast.success('Successfully logged in');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials or connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-charcoal-900 border border-neutral-800 rounded-lg p-8 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <img src={logo} alt="Dot Inspire Design Studio" className="h-14 w-auto mx-auto object-contain" />
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Studio CMS <span className="text-gold-500">Portal</span>
          </h1>
          <p className="text-xs text-neutral-400">
            Dot Inspire Interior Design Studio LLP Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal-950 border border-neutral-800 rounded pl-10 pr-4 py-3 text-white text-sm focus:border-gold-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal-950 border border-neutral-800 rounded pl-10 pr-4 py-3 text-white text-sm focus:border-gold-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-gold-500 rounded border-neutral-800"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-800 text-center flex items-center justify-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <span>Protected REST JWT Endpoint</span>
        </div>
      </div>
    </div>
  );
};
