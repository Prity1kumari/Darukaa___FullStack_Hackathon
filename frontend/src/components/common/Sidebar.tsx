import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, FolderTree, LineChart, Shield, Trees } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: 'Platform KPIs & Ecosystem Summary',
    },
    {
      to: '/map',
      label: 'Interactive Map',
      icon: <Map className="w-5 h-5" />,
      description: 'Polygon Drawing & GIS Explorer',
    },
    {
      to: '/projects',
      label: 'Projects & Sites',
      icon: <FolderTree className="w-5 h-5" />,
      description: 'Site Registry & Geometry Specs',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-40 w-64 h-screen lg:h-[calc(100vh-61px)] bg-[#0b1315] border-r border-[#1e3237] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">
            Navigation
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-start space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500/20 to-teal-500/10 text-brand-300 border border-brand-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121e21] border border-transparent'
                }`
              }
            >
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <p className="leading-tight">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Bottom Platform Status Card */}
        <div className="p-4 border-t border-[#1e3237]">
          <div className="p-3 bg-[#121e21] border border-[#1e3237] rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white">PostGIS SRID 4326</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Geodesic area calculations & monthly ecological telemetry active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
