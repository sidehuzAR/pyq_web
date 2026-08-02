import React from 'react';

export default function HomeHero() {
  return (
    <section className="hackclub-hero-section">
      <div className="hero-centered-content">
        <div className="section-label" style={{ justifyContent: 'center' }}>
          <span>■</span> RETRO ACADEMIC ARCHIVE
        </div>

        <h1 className="split-title">
          <span className="white-part">QUESTION</span>
          <span className="red-part">PAPERS</span>
        </h1>

        <p className="hero-desc">
          8-bit pixelated exam archive for VIT students — search CAT-1, CAT-2, and FAT question papers categorized by slots, semesters, and course codes.
        </p>
      </div>

      <style>{`
        .hackclub-hero-section {
          padding: 3.5rem 1.5rem 2rem;
          text-align: center;
        }
        .hero-centered-content {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }
        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-muted);
          max-width: 700px;
          line-height: 1.6;
          font-family: var(--font-pixel);
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
