import React from 'react';
import { Search, Upload, Sun, Moon, Bookmark, ShieldCheck } from 'lucide-react';

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
    <header className="header-bar glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
      <div className="header-inner">
        {/* Brand Title */}
        <div className="brand-group" onClick={() => setActiveView('public')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon">
            <span className="logo-spark">⚡</span>
          </div>
          <h1 className="brand-title gradient-text">papersvitc</h1>
        </div>

        {/* Global Search Bar */}
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search by course code or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            className="btn-icon"
            title="Toggle Light / Dark Mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Upload Paper CTA Button */}
          <button className="btn btn-primary" onClick={onOpenUpload}>
            <Upload size={16} />
            <span>Upload Paper</span>
          </button>
        </div>
      </div>

      <style>{`
        .header-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0.75rem 1.5rem;
          background: rgba(18, 2, 2, 0.85);
          backdrop-filter: blur(16px);
        }
        .header-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .brand-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(172, 18, 12, 0.4);
        }
        .brand-title {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .header-search {
          position: relative;
          flex: 1;
          max-width: 460px;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .header-search-input {
          width: 100%;
          padding: 0.6rem 2.2rem 0.6rem 2.6rem;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--text);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .header-search-input:focus {
          border-color: var(--highlight);
          box-shadow: 0 0 0 3px rgba(208, 125, 34, 0.25);
        }
        .clear-search-btn {
          position: absolute;
          right: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .header-search {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
