import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/catalogue', label: 'CATALOGUE' },
    { path: '/upload', label: 'UPLOAD PAPER' }
  ];

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `px-3 py-1.5 text-xs font-black tracking-wider uppercase sharp transition-all duration-150 ${
              isActive
                ? 'bg-bauhaus-red text-white border-2 border-bauhaus-border shadow-bauhaus-red'
                : 'text-bauhaus-ink hover:bg-bauhaus-yellow hover:text-bauhaus-canvas border-2 border-transparent hover:border-bauhaus-border'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
