import React from 'react';

export default function HomeHero() {
  return (
    <section className="hackclub-hero-section">
      <div className="hero-centered-content cyber-card">
        <div className="section-label" style={{ justifyContent: 'center' }}>
          <span>■</span> PREVIOUS YEAR QUESTION PAPERS
        </div>

        <h1 className="split-title">
          <span className="white-part">PYQ</span>
          <span className="red-part">ARCHIVE</span>
        </h1>

        <p className="hero-desc">
          Your one-stop exam archive for VIT students — search CAT-1, CAT-2, and FAT question papers categorized by slots, semesters, and course codes.
        </p>
      </div>

      <style>{`
        .hackclub-hero-section {
          padding: 3.5rem 1.5rem 2rem;
          text-align: center;
        }
        .hero-centered-content {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 2.5rem 2rem;
          background: rgba(4, 1, 1, 0.94);
          border: 2px solid var(--border-crimson);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.95), 6px 6px 0px var(--crimson-glow);
        }
        .hero-desc {
          font-size: 1.15rem;
          color: #e2d7d5;
          max-width: 720px;
          line-height: 1.6;
          font-family: var(--font-pixel);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .split-title {
            font-size: 2.8rem;
          }
        }
      `}</style>
    </section>
  );
}
