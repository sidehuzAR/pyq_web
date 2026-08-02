import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, BookOpen, X } from 'lucide-react';

export default function HomeHero({
  searchQuery,
  setSearchQuery,
  courses = []
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const searchWrapperRef = useRef(null);

  // Filter matching courses for live autocomplete dropdown
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
    setSearchQuery(code);
    setShowDropdown(false);
  };

  return (
    <section className="hackclub-hero-section">
      <div className="hero-centered-content">
        <div className="section-label" style={{ justifyContent: 'center' }}>
          <span>◇</span> ACADEMIC EXAM ARCHIVE
        </div>

        <h1 className="split-title">
          <span className="white-part">QUESTION</span>
          <span className="red-part">PAPERS</span>
        </h1>

        <p className="hero-desc">
          High-speed question paper archive for VIT students — search CAT-1, CAT-2, and FAT exam papers categorized by timetable slots, semesters, and course codes.
        </p>

        {/* Single Hero Search Container with Autocomplete Dropdown */}
        <div className="hero-search-wrapper" ref={searchWrapperRef}>
          <div className="hero-search-container cyber-card">
            <Search size={20} className="hero-search-icon" />
            <input
              type="text"
              className="hero-input"
              placeholder="Enter Course Code (e.g. BPHY101L, BMAT101L) or Subject Name..."
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
                className="clear-hero-btn"
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Menu */}
          {showDropdown && searchQuery.trim() !== '' && (
            <div className="search-dropdown-menu cyber-card">
              <div className="dropdown-header">
                <span>Matching Courses ({matchingCourses.length})</span>
              </div>

              {matchingCourses.length === 0 ? (
                <div className="dropdown-empty">
                  No courses found matching "{searchQuery}"
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
      </div>

      <style>{`
        .hackclub-hero-section {
          padding: 3.5rem 1.5rem 2rem;
          text-align: center;
        }
        .hero-centered-content {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }
        .hero-desc {
          font-size: 1.1rem;
          color: var(--text-muted);
          max-width: 680px;
          line-height: 1.6;
        }
        .hero-search-wrapper {
          width: 100%;
          position: relative;
          margin-top: 0.75rem;
        }
        .hero-search-container {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1.4rem;
          border-radius: 999px;
          border-color: var(--border-crimson);
          background: rgba(14, 2, 2, 0.95);
        }
        .hero-search-icon {
          color: var(--crimson-main);
          flex-shrink: 0;
          display: block;
        }
        .hero-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-white);
          font-size: 1rem;
          padding: 0.4rem 0;
          font-family: var(--font-sans);
        }
        .clear-hero-btn {
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: var(--text-muted);
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .clear-hero-btn:hover {
          background: var(--crimson-main);
          color: #fff;
        }
        
        /* Autocomplete Dropdown Menu Styles */
        .search-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.6rem);
          left: 0;
          right: 0;
          z-index: 120;
          background: rgba(8, 1, 1, 0.98);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-crimson);
          border-radius: 14px;
          padding: 0.6rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(211, 7, 14, 0.25);
          text-align: left;
          max-height: 280px;
          overflow-y: auto;
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-header {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-subtle);
          padding: 0.4rem 0.8rem 0.5rem;
          border-bottom: 1px solid var(--border-dark);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .dropdown-empty {
          padding: 1.25rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.88rem;
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
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dropdown-item:hover {
          background: rgba(211, 7, 14, 0.2);
        }
        .course-code-pill {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--amber-accent);
          background: rgba(224, 139, 38, 0.15);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .course-name-text {
          font-size: 0.92rem;
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
          transition: transform 0.2s ease;
        }
        .dropdown-item:hover .item-arrow {
          opacity: 1;
          transform: translateX(3px);
        }
        @media (max-width: 768px) {
          .split-title {
            font-size: 2.8rem;
          }
          .hero-input {
            font-size: 0.88rem;
          }
        }
      `}</style>
    </section>
  );
}
