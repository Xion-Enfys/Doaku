import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCamera, FaChartLine } from 'react-icons/fa';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/ar-scan', icon: FaCamera, label: 'AR Scan' },
    { path: '/progress', icon: FaChartLine, label: 'Progress' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-xl flex justify-around items-center px-4 py-2 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center transition-all ${
              active 
                ? 'bg-primary-container text-on-primary-container rounded-full px-6 py-1' 
                : 'text-outline p-2 hover:bg-primary-container/20 rounded-full'
            }`}
          >
            <Icon className={`text-xl ${active ? 'text-on-primary-container' : ''}`} />
            <span className="font-label-bold text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;