import React from 'react';
import { Search } from 'lucide-react';

export default function HomeHero({
  searchQuery,
  setSearchQuery
}) {
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

        {/* Hero Search Box */}
        <div className="hero-search-container cyber-card">
          <Search size={20} className="hero-search-icon" />
          <input
            type="text"
            className="hero-input"
            placeholder="Enter Course Code (e.g. BPHY101L, BMAT101L) or Subject Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-hero-btn" onClick={() => setSearchQuery('')}>Clear</button>
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
        .hero-search-container {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1.4rem;
          border-radius: 999px;
          border-color: var(--border-crimson);
          margin-top: 0.75rem;
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
        }
        .clear-hero-btn:hover {
          background: var(--crimson-main);
          color: #fff;
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
