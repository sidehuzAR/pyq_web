import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#121212] text-white transition-colors duration-200">
      {/* Top 3-Color Strip */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#D92D20]" />
        <div className="flex-1 bg-[#00D4FF]" />
        <div className="flex-1 bg-[#E8A838]" />
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Brand & Subtitle */}
          <div className="space-y-2 text-center lg:text-left max-w-sm">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              {/* Geometric Bauhaus Icon Mark */}
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 bg-[#D92D20] sharp" />
                <div className="w-3.5 h-3.5 bg-[#00D4FF] rounded-full" />
                <polygon points="0,14 7,0 14,14" className="w-3.5 h-3.5 fill-[#E8A838]" />
              </div>
              <span className="font-display text-2xl font-black tracking-wider uppercase text-white">
                PYARCHIVE
              </span>
            </div>
            <p className="text-xs font-mono text-stone-400 font-medium leading-relaxed">
              VIT PYQ Archive.
            </p>
          </div>

          {/* Center Column: Creators Card (Riku [Blue] + Aman Haries [Red]) */}
          <div className="bg-[#1A1A1A] border-2 border-stone-700 px-5 py-3.5 sharp shadow-2xl flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-black text-[#E8A838] uppercase tracking-wider">
              <Code2 size={14} className="animate-pulse" />
              <span>CREATORS:</span>
            </div>

            {/* Creator 1: RIKU (Architect) — BLUE */}
            <div className="bg-[#0A0A0A] border-2 border-[#00D4FF] px-3.5 py-1.5 flex items-center gap-2.5 sharp transition-all duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] cursor-default group">
              <div className="w-6 h-6 bg-[#00D4FF] text-black flex items-center justify-center font-mono text-xs font-black sharp group-hover:rotate-6 transition-transform">
                R
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white tracking-wider leading-none">RIKU</div>
                <div className="text-[9px] font-mono font-extrabold text-[#00D4FF] tracking-widest uppercase mt-0.5">ARCHITECT</div>
              </div>
            </div>

            <span className="text-stone-500 font-mono text-xs font-bold">+</span>

            {/* Creator 2: AMAN HARIES (Developer) — RED */}
            <div className="bg-[#0A0A0A] border-2 border-[#D92D20] px-3.5 py-1.5 flex items-center gap-2.5 sharp transition-all duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(217,45,32,0.35)] cursor-default group">
              <div className="w-6 h-6 bg-[#D92D20] text-white flex items-center justify-center font-mono text-xs font-black sharp group-hover:-rotate-6 transition-transform">
                AH
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white tracking-wider leading-none">AMAN HARIES</div>
                <div className="text-[9px] font-mono font-extrabold text-[#D92D20] tracking-widest uppercase mt-0.5">DEVELOPER</div>
              </div>
            </div>
          </div>

          {/* Right Column: Navigation Links */}
          <div className="flex items-center gap-4 text-xs font-mono font-black uppercase tracking-widest text-stone-300">
            <Link to="/" className="hover:text-[#E8A838] transition-colors">
              HOME
            </Link>
            <span className="text-stone-700">/</span>
            <Link to="/catalogue" className="hover:text-[#E8A838] transition-colors">
              CATALOGUE
            </Link>
            <span className="text-stone-700">/</span>
            <Link to="/upload" className="hover:text-[#E8A838] transition-colors">
              UPLOAD
            </Link>
          </div>

        </div>

        {/* Bottom Division & Footer Metadata */}
        <div className="mt-8 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono font-bold text-stone-400 uppercase gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-[#00D4FF]" />
            <span>COMMUNITY MAINTAINED</span>
          </div>
          <div className="flex items-center gap-1">
            <span>BUY US <span className="line-through text-stone-500">COFFEE</span>, SHAWARMA 🌯</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
