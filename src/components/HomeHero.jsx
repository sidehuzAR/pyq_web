import React from 'react';
import { Search, Pin, Sparkles, BookOpen } from 'lucide-react';

export default function HomeHero({
  searchQuery,
  setSearchQuery,
  courses,
  pinnedSubjects,
  onTogglePin,
  onSelectSubject
}) {
  const pinnedCourses = courses.filter(c => pinnedSubjects.includes(c.course_code));

  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="hero-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>VIT Past Exam Papers Portal</span>
        </div>

        <h1 className="hero-title">
          Built by Students for <span className="gradient-text">Students</span>
        </h1>
        <p className="hero-subtitle">
          Access verified CAT-1, CAT-2, and FAT question papers categorized by VIT timetable slots, semesters, and course codes.
        </p>

        {/* Hero Search Bar */}
        <div className="hero-search-wrapper glass-card">
          <Search size={22} className="hero-search-icon" />
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search by course code (e.g. BPHY101L, BMAT101L) or subject name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="hero-search-clear" onClick={() => setSearchQuery('')}>Clear</button>
          )}
        </div>

        {/* Pinned Subjects Shelf */}
        <div className="pinned-shelf">
          <div className="pinned-header">
            <Pin size={16} className="pin-icon" />
            <h3>Pinned Subjects</h3>
            <span className="pinned-caption">Quick access for your active semester</span>
          </div>

          <div className="pinned-grid">
            {pinnedCourses.length === 0 ? (
              <div className="pinned-empty">
                <span>No pinned subjects yet. Click the pin icon next to any subject to save it here.</span>
              </div>
            ) : (
              pinnedCourses.map(course => (
                <div
                  key={course.course_code}
                  className="pinned-card glass-card"
                  onClick={() => onSelectSubject(course.course_code)}
                >
                  <div className="pinned-card-top">
                    <span className="pinned-code">{course.course_code}</span>
                    <button
                      className="pin-toggle-btn active"
                      title="Unpin subject"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(course.course_code);
                      }}
                    >
                      <Pin size={14} />
                    </button>
                  </div>
                  <h4 className="pinned-name">{course.subject_name}</h4>
                  <div className="pinned-card-footer">
                    <BookOpen size={13} />
                    <span>View Papers</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding: 3rem 1.5rem 2rem;
          text-align: center;
        }
        .hero-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.9rem;
          background: rgba(172, 18, 12, 0.15);
          border: 1px solid rgba(172, 18, 12, 0.35);
          border-radius: 999px;
          color: #ff7070;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .sparkle-icon {
          color: var(--highlight);
        }
        .hero-title {
          font-size: 3.2rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 0.8rem;
        }
        .hero-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          max-width: 680px;
          margin: 0 auto 2rem;
        }
        .hero-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          margin-bottom: 3rem;
          border-radius: 999px;
          border-color: rgba(208, 125, 34, 0.3);
        }
        .hero-search-icon {
          color: var(--highlight);
          margin-left: 0.5rem;
        }
        .hero-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-size: 1.1rem;
          padding: 0.75rem 1rem;
          font-family: var(--font-sans);
        }
        .hero-search-clear {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: var(--text-muted);
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .pinned-shelf {
          text-align: left;
          background: rgba(18, 2, 2, 0.6);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
        }
        .pinned-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .pin-icon {
          color: var(--highlight);
        }
        .pinned-header h3 {
          font-size: 1.1rem;
        }
        .pinned-caption {
          color: var(--text-subtle);
          font-size: 0.82rem;
          margin-left: auto;
        }
        .pinned-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
        }
        .pinned-empty {
          grid-column: 1 / -1;
          color: var(--text-subtle);
          font-size: 0.9rem;
          font-style: italic;
          padding: 1rem 0;
          text-align: center;
        }
        .pinned-card {
          padding: 1rem;
          cursor: pointer;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .pinned-card:hover {
          transform: translateY(-4px);
          border-color: var(--highlight);
        }
        .pinned-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pinned-code {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--highlight);

          padding: 0.15rem 0.5rem;
          background: rgba(208, 125, 34, 0.15);
          border-radius: 6px;
        }
        .pin-toggle-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.2rem;
        }
        .pin-toggle-btn.active {
          color: var(--highlight);
        }
        .pinned-name {
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.3;
        }
        .pinned-card-footer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--accent-bright);
          margin-top: auto;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }
          .pinned-caption {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
