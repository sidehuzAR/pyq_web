import React from 'react';
import { Search, Upload, Sun, Moon, Terminal, Shield } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  theme,
  setTheme,
  onOpenUpload,
  onNavigateAdmin,
  activeView,
  setActiveView
}) {
  return (
    <header className="hackclub-header">
      <div className="header-inner">
        {/* Left Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveView('public')}>
          <span className="diamond-node">♦</span>
          <span className="brand-name-white">PAPERS</span>
          <span className="brand-name-red">VITC</span>
          <span className="slash-tag">/&gt;</span>
        </div>

        {/* Center System Status Marquee Pill */}
        <div className="system-status-pill">
          <span className="pulse-dot">●</span>
          <span className="status-text">SYSTEM ONLINE — 2025-26 ACADEMIC ARCHIVE</span>
        </div>

        {/* Header Search & Actions */}
        <div className="header-right">
          {/* Quick Search */}
          <div className="header-search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="cyber-input search-input"
              placeholder="Search code / subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          {/* Theme Switch */}
          <button
            className="theme-btn"
            title="Toggle Light / Dark Mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Upload CTA */}
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
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-dark);
          padding: 0.8rem 1.5rem;
        }
        .header-inner {
          max-width: 1350px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
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
        }
        .diamond-node {
          color: var(--crimson-main);
          font-size: 1rem;
          margin-right: 0.2rem;
        }
        .brand-name-white {
          color: var(--text-white);
        }
        .brand-name-red {
          color: var(--crimson-main);
        }
        .slash-tag {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-left: 0.2rem;
        }
        .system-status-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.9rem;
          background: rgba(14, 2, 2, 0.8);
          border: 1px solid var(--border-dark);
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .pulse-dot {
          color: #22c55e;
          font-size: 0.7rem;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-search-box {
          position: relative;
          width: 220px;
        }
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-input {
          padding-left: 2.2rem;
          font-size: 0.85rem;
          border-radius: 999px;
          padding-top: 0.45rem;
          padding-bottom: 0.45rem;
        }
        .clear-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .theme-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-dark);
          color: var(--text-cream);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .theme-btn:hover {
          border-color: var(--crimson-main);
          color: var(--crimson-bright);
        }
        @media (max-width: 900px) {
          .system-status-pill, .header-search-box {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
