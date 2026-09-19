import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (!err?.response) {
        setError(
          'Unable to reach backend API. If deployed on Render free tier, the server may take ~60-90 seconds to wake up from cold sleep. Please wait a moment and try again.'
        );
      } else {
        setError(
          err?.response?.data?.detail || 'Authentication failed. Please verify credentials.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@darukaa.earth');
    setPassword('AdminPass123!');
  };

  return (
    <div className="min-h-screen bg-[#0b1315] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center shadow-xl shadow-brand-500/20">
            <Globe className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white tracking-tight">
          Darukaa<span className="text-brand-400">.Earth</span>
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 max-w">
          Production Geospatial Platform for Carbon & Biodiversity Analytics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#121e21] border border-[#1e3237] py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@darukaa.earth"
                  className="w-full bg-[#0b1315] border border-[#1e3237] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0b1315] border border-[#1e3237] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/20 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign in to Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Auto-Fill Button */}
          <div className="mt-6 pt-5 border-t border-[#1e3237]">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#0b1315] hover:bg-[#18292c] border border-brand-500/30 rounded-xl text-xs font-semibold text-brand-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Fill Default Admin Credentials</span>
            </button>

            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400">Need an account? </span>
              <Link
                to="/register"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              >
                Register as Administrator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
