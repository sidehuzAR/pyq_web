import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation.jsx';

import { Sun, Moon } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, courses, theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 bg-bauhaus-canvas/90 backdrop-blur-md border-b-2 border-bauhaus-border px-4 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Geometric Bauhaus Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-1 border-2 border-bauhaus-border bg-bauhaus-surface p-1.5 shadow-bauhaus group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            <div className="w-4 h-4 bg-bauhaus-red border border-bauhaus-border"></div>
            <div className="w-4 h-4 rounded-full bg-bauhaus-blue border border-bauhaus-border"></div>
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-bauhaus-yellow drop-shadow-[1px_1px_0px_var(--border-base)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tighter text-bauhaus-ink leading-none uppercase">
              PYARCHIVE
            </span>
            <span className="font-mono text-[10px] font-bold text-bauhaus-yellow tracking-widest leading-none mt-0.5">
              VIT EXAM REPOSITORY
            </span>
          </div>
        </Link>

        {/* Bauhaus Doodles (Gap Filler) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4 opacity-40 select-none pointer-events-none mx-8">
          <div className="w-8 h-1.5 bg-bauhaus-red"></div>
          <div className="w-2.5 h-2.5 rounded-full border-2 border-bauhaus-ink"></div>
          <div className="w-16 h-1.5 bg-bauhaus-border"></div>
          <div className="w-3 h-3 bg-bauhaus-blue sharp"></div>
          <div className="w-6 h-1.5 bg-bauhaus-border"></div>
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-bauhaus-yellow"></div>
          <div className="w-10 h-1.5 bg-bauhaus-border"></div>
        </div>

        {/* Navigation & Theme Toggle */}
        <div className="flex items-center gap-4">
          <Navigation />
          <button
            onClick={toggleTheme}
            className="p-1.5 border-2 border-transparent hover:border-bauhaus-border text-bauhaus-ink hover:bg-bauhaus-yellow hover:text-bauhaus-canvas sharp transition-colors duration-150 cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
