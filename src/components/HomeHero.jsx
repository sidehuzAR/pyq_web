import React, { useState } from 'react';
import { Search, Pin, Terminal, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

export default function HomeHero({
  searchQuery,
  setSearchQuery,
  courses,
  pinnedSubjects,
  onTogglePin,
  onSelectSubject
}) {
  const pinnedCourses = courses.filter(c => pinnedSubjects.includes(c.course_code));
  const [terminalTab, setTerminalTab] = useState('bash');

  return (
    <section className="hackclub-hero-section">
      <div className="hero-grid-wrapper">
        {/* Left Hero Description */}
        <div className="hero-left">
          <div className="section-label">
            <span>◇</span> ON THE LAUNCHPAD
          </div>

          <h1 className="split-title">
            <span className="white-part">QUESTION</span>
            <span className="red-part">PAPERS</span>
          </h1>

          <p className="hero-desc">
            A high-speed question paper archive for builders & students — web, ML, hardware, and core engineering. Instant search across CAT-1, CAT-2, and FAT exam papers categorized by timetable slots.
          </p>

          {/* Hero Search Box */}
          <div className="hero-search-container cyber-card">
            <Search size={20} className="search-icon" />
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

        {/* Right Terminal Simulator Mockup */}
        <div className="hero-right">
          <div className="terminal-card cyber-card">
            <div className="terminal-header">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="terminal-title">papersvitc.sh</span>
            </div>

            <div className="terminal-body">
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="cmd">./papersvitc --status</span>
              </div>
              <div className="terminal-output text-green">
                ✓ Connecting to VIT Academic Archive Engine... [OK]
              </div>
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="cmd">./query --slots A1,E2,B1 --exams CAT-1,FAT</span>
              </div>
              <div className="terminal-output">
                Found 150+ verified exam papers across Fall/Winter semesters.
              </div>
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="cmd cursor-blink">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Subjects Rack */}
      <div className="pinned-section">
        <div className="pinned-header">
          <div className="section-label">
            <span>◇</span> PINNED SUBJECTS
          </div>
          <span className="pinned-note">Quick access for current active courses</span>
        </div>

        <div className="pinned-matrix">
          {pinnedCourses.length === 0 ? (
            <div className="pinned-empty-box cyber-card">
              <span>No subjects pinned yet. Click the pin icon next to any paper to bookmark it here.</span>
            </div>
          ) : (
            pinnedCourses.map(course => (
              <div
                key={course.course_code}
                className="pinned-item-card cyber-card"
                onClick={() => onSelectSubject(course.course_code)}
              >
                <div className="pinned-item-top">
                  <span className="pinned-code-tag">{course.course_code}</span>
                  <button
                    className="pin-icon-btn active"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(course.course_code);
                    }}
                  >
                    <Pin size={13} />
                  </button>
                </div>
                <h4 className="pinned-title">{course.subject_name}</h4>
                <div className="pinned-action">
                  <span>Explore Papers</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .hackclub-hero-section {
          padding: 3rem 1.5rem 2rem;
        }
        .hero-grid-wrapper {
          max-width: 1300px;
          margin: 0 auto 3rem;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2.5rem;
          align-items: center;
        }
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .hero-desc {
          font-size: 1.05rem;
          color: var(--text-muted);
          max-width: 580px;
          line-height: 1.6;
        }
        .hero-search-container {
          display: flex;
          align-items: center;
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          border-color: var(--border-crimson);
          margin-top: 0.5rem;
        }
        .search-icon {
          color: var(--crimson-main);
          margin-right: 0.5rem;
        }
        .hero-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-white);
          font-size: 1.05rem;
          padding: 0.5rem 0;
        }
        .clear-hero-btn {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: var(--text-muted);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.78rem;
          cursor: pointer;
        }
        .terminal-card {
          padding: 0;
          overflow: hidden;
          background: rgba(4, 1, 1, 0.95);
          border-color: var(--border-crimson);
        }
        .terminal-header {
          background: rgba(20, 4, 4, 0.9);
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-dark);
        }
        .window-dots {
          display: flex;
          gap: 0.4rem;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #eab308; }
        .dot.green { background: #22c55e; }
        .terminal-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .terminal-body {
          padding: 1.25rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .terminal-line {
          display: flex;
          gap: 0.6rem;
          color: var(--text-cream);
        }
        .prompt {
          color: var(--crimson-bright);
        }
        .terminal-output {
          color: var(--text-muted);
          padding-left: 1.2rem;
          font-size: 0.8rem;
        }
        .text-green {
          color: #4ade80;
        }
        .cursor-blink {
          animation: blink 1s infinite;
          color: var(--crimson-main);
          font-weight: 900;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .pinned-section {
          max-width: 1300px;
          margin: 0 auto;
        }
        .pinned-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .pinned-note {
          font-size: 0.8rem;
          color: var(--text-subtle);
        }
        .pinned-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .pinned-empty-box {
          grid-column: 1 / -1;
          padding: 1.5rem;
          text-align: center;
          color: var(--text-subtle);
          font-size: 0.88rem;
        }
        .pinned-item-card {
          padding: 1rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .pinned-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pinned-code-tag {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--amber-accent);
          background: rgba(224, 139, 38, 0.15);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .pin-icon-btn {
          background: none;
          border: none;
          color: var(--crimson-main);
          cursor: pointer;
        }
        .pinned-title {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .pinned-action {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.78rem;
          color: var(--crimson-main);
          font-family: var(--font-mono);
          margin-top: auto;
        }
        @media (max-width: 900px) {
          .hero-grid-wrapper {
            grid-template-columns: 1fr;
          }
          .split-title {
            font-size: 2.8rem;
          }
        }
      `}</style>
    </section>
  );
}
