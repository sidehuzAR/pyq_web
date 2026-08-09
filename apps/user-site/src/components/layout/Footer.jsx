import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto bg-bauhaus-surface text-bauhaus-ink border-t-2 border-bauhaus-border pt-8 pb-6 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-bauhaus-red sharp border border-bauhaus-border"></div>
          <div>
            <div className="font-display text-base font-black tracking-widest uppercase text-bauhaus-ink">
              PYARCHIVE — VIT EXAM REPOSITORY
            </div>
            <div className="text-xs font-mono text-bauhaus-muted">
              Built by Students for Students. Form Follows Function.
            </div>
          </div>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-bauhaus-yellow transition-colors">
            HOME
          </Link>
          <span className="text-bauhaus-border">/</span>
          <Link to="/catalogue" className="hover:text-bauhaus-yellow transition-colors">
            CATALOGUE
          </Link>
          <span className="text-bauhaus-border">/</span>
          <Link to="/upload" className="hover:text-bauhaus-yellow transition-colors">
            UPLOAD
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-bauhaus-border text-center text-[11px] font-mono text-bauhaus-muted">
        BAUHAUS DYNAMIC DESIGN SYSTEM • LOCALSTORAGE ARCHITECTURE
      </div>
    </footer>
  );
}
