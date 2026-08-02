import React from 'react';
import { Search, Upload, Sun, Moon } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  theme,
  setTheme,
  onOpenUpload,
  setActiveView
}) {
  return (
    <header className="hackclub-header">
      <div className="header-inner">
        {/* Left Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveView('public')}>
          <span className="diamond-node">♦</span>
          <span className="brand-name-white">PY</span>
          <span className="brand-name-red">ARCHIVE</span>
          <span className="slash-tag">/&gt;</span>
        </div>

        {/* Center Search Bar using Flexbox */}
        <div className="header-search-box">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search course code or subject name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Right Actions */}
        <div className="header-right">
          {/* Theme Switch */}
          <button
            className="theme-btn"
            title="Toggle Light / Dark Mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Upload CTA Button */}
          <button className="btn btn-cyber-red" onClick={onOpenUpload}>
            <span>→ UPLOAD PAPER</span>
          </button>
        </div>
      </div>

      <style>{`
        .hackclub-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-dark);
          padding: 0.85rem 1.75rem;
        }
        .header-inner {
          max-width: 1350px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          user-select: none;
        }
        .diamond-node {
          color: var(--crimson-main);
          font-size: 1rem;
          margin-right: 0.1rem;
        }
        .brand-name-white {
          color: var(--text-white);
        }
        .brand-name-red {
          color: var(--crimson-main);
        }
        .slash-tag {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-left: 0.2rem;
        }
        .header-search-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid var(--border-dark);
          border-radius: 999px;
          padding: 0.45rem 1rem;
          flex: 1;
          max-width: 440px;
          transition: all 0.2s ease;
        }
        .header-search-box:focus-within {
          border-color: var(--crimson-main);
          box-shadow: 0 0 0 3px rgba(211, 7, 14, 0.25);
        }
        .header-search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
          display: block;
        }
        .header-search-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-white);
          font-family: var(--font-sans);
          font-size: 0.88rem;
          padding: 0;
        }
        .clear-btn {
          flex-shrink: 0;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1rem;
          cursor: pointer;
          line-height: 1;
          padding: 0 0.2rem;
        }
        .clear-btn:hover {
          color: var(--crimson-bright);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .theme-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-dark);
          color: var(--text-cream);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-btn:hover {
          border-color: var(--crimson-main);
          color: var(--crimson-bright);
        }
        @media (max-width: 768px) {
          .header-search-box {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
