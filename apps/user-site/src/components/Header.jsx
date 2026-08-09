import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, ChevronRight } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  courses = [],
  onSelectSubject,
  theme,
  setTheme,
  onOpenUpload,
  setActiveView
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const searchWrapperRef = useRef(null);

  // Filter matching courses for top search autocomplete dropdown
  const matchingCourses = searchQuery.trim()
    ? courses.filter(c =>
        c.course_code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        c.subject_name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCourse = (code) => {
    if (onSelectSubject) {
      onSelectSubject(code);
    } else {
      setSearchQuery(code);
    }
    setShowDropdown(false);
  };

  return (
    <header className="hackclub-header">
      <div className="header-inner">
        {/* Left Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveView('public')}>
          <span className="diamond-node">■</span>
          <span className="brand-name-white">PY</span>
          <span className="brand-name-red">ARCHIVE</span>
          <span className="slash-tag">[8-BIT]</span>
        </div>

        {/* Center Single Top Search Bar with Autocomplete Dropdown */}
        <div className="header-search-wrapper" ref={searchWrapperRef}>
          <div className="header-search-box">
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              className="header-search-input"
              placeholder="SEARCH COURSE CODE OR SUBJECT..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowDropdown(true);
              }}
            />
            {searchQuery && (
              <button
                className="clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Top Autocomplete Dropdown Menu */}
          {showDropdown && searchQuery.trim() !== '' && (
            <div className="top-search-dropdown cyber-card">
              <div className="dropdown-header">
                <span>MATCHING COURSES ({matchingCourses.length})</span>
              </div>

              {matchingCourses.length === 0 ? (
                <div className="dropdown-empty">
                  NO COURSES FOUND MATCHING "{searchQuery}"
                </div>
              ) : (
                <div className="dropdown-list">
                  {matchingCourses.map(c => (
                    <div
                      key={c.course_code}
                      className="dropdown-item"
                      onClick={() => handleSelectCourse(c.course_code)}
                    >
                      <span className="course-code-pill">{c.course_code}</span>
                      <span className="course-name-text">{c.subject_name}</span>
                      <ChevronRight size={14} className="item-arrow" />
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            <span>► UPLOAD PAPER</span>
          </button>
        </div>
      </div>

      <style>{`
        .hackclub-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.95);
          border-bottom: 2px solid var(--border-crimson);
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
          gap: 0.4rem;
          cursor: pointer;
          font-family: var(--font-pixel);
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          user-select: none;
        }
        .diamond-node {
          color: var(--crimson-main);
          font-size: 1.1rem;
        }
        .brand-name-white {
          color: var(--text-white);
        }
        .brand-name-red {
          color: var(--crimson-main);
        }
        .slash-tag {
          font-family: var(--font-arcade);
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-left: 0.3rem;
        }
        .header-search-wrapper {
          position: relative;
          flex: 1;
          max-width: 480px;
        }
        .header-search-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid var(--border-dark);
          padding: 0.45rem 1rem;
          width: 100%;
          transition: all 0.15s ease;
        }
        .header-search-box:focus-within {
          border-color: var(--crimson-main);
          box-shadow: 3px 3px 0px var(--crimson-main);
        }
        .header-search-icon {
          color: var(--crimson-main);
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
          font-family: var(--font-pixel);
          font-size: 1rem;
          padding: 0;
          letter-spacing: 0.04em;
        }
        .clear-btn {
          flex-shrink: 0;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
          line-height: 1;
          padding: 0 0.2rem;
          font-family: var(--font-pixel);
        }
        .clear-btn:hover {
          color: var(--crimson-bright);
        }
        
        /* Top Autocomplete Dropdown Menu */
        .top-search-dropdown {
          position: absolute;
          top: calc(100% + 0.6rem);
          left: 0;
          right: 0;
          z-index: 120;
          background: rgba(4, 0, 0, 0.98);
          border: 2px solid var(--border-crimson);
          padding: 0.6rem;
          box-shadow: 6px 6px 0px rgba(211, 7, 14, 0.4);
          text-align: left;
          max-height: 300px;
          overflow-y: auto;
        }
        .dropdown-header {
          font-family: var(--font-arcade);
          font-size: 0.65rem;
          color: var(--text-subtle);
          padding: 0.4rem 0.8rem 0.5rem;
          border-bottom: 2px solid var(--border-dark);
          text-transform: uppercase;
        }
        .dropdown-empty {
          padding: 1.25rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .dropdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-top: 0.35rem;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }
        .dropdown-item:hover {
          background: rgba(211, 7, 14, 0.25);
          border-color: var(--crimson-main);
        }
        .course-code-pill {
          font-family: var(--font-pixel);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--amber-accent);
          background: rgba(224, 139, 38, 0.2);
          padding: 0.15rem 0.5rem;
          border: 1px solid rgba(224, 139, 38, 0.4);
          flex-shrink: 0;
        }
        .course-name-text {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-cream);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-arrow {
          color: var(--crimson-main);
          opacity: 0.6;
        }
        .dropdown-item:hover .item-arrow {
          opacity: 1;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .theme-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 2px solid var(--border-dark);
          color: var(--text-cream);
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .theme-btn:hover {
          border-color: var(--crimson-main);
          color: var(--crimson-bright);
          box-shadow: 2px 2px 0px var(--crimson-main);
        }
      `}</style>
    </header>
  );
}
