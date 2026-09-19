import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Database, LogOut, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSeedData } from '../../hooks/useAnalytics';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const seedMutation = useSeedData();
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to seed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0b1315]/90 backdrop-blur-md border-b border-[#1e3237] px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#121e21]"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-extrabold text-white tracking-tight">
                  Darukaa<span className="text-brand-400">.Earth</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">
                  GeoAI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block">
                Carbon & Biodiversity Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={handleSeed}
            disabled={seedMutation.isPending}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              seedSuccess
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-[#121e21] border-[#1e3237] text-slate-300 hover:text-brand-300 hover:border-brand-500/50'
            }`}
            title="Seed realistic global ecological sites and historical timeseries"
          >
            {seedMutation.isPending ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin text-brand-400" />
            ) : (
              <Database className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span className="hidden sm:inline">
              {seedSuccess ? 'Data Seeded!' : seedMutation.isPending ? 'Seeding...' : 'Seed Demo Data'}
            </span>
          </button>

          {user && (
            <div className="flex items-center space-x-3 border-l border-[#1e3237] pl-3 sm:pl-4">
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <div className="flex items-center justify-end space-x-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-brand-400" />
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xs font-bold text-brand-300">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#121e21] transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
