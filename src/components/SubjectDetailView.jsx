import React, { useState, useMemo } from 'react';
import { ArrowLeft, Download, Eye, CheckCircle, FileText, Calendar, Clock, Filter } from 'lucide-react';
import JSZip from 'jszip';

export default function SubjectDetailView({
  courseCode,
  courses,
  papers,
  onBack,
  onViewPaper,
  onToast
}) {
  const course = courses.find(c => c.course_code.toLowerCase() === courseCode.toLowerCase()) || {
    course_code: courseCode,
    subject_name: courseCode
  };

  // Get all papers for this specific course code
  const subjectPapers = useMemo(() => {
    return papers.filter(p => p.course_code.toLowerCase() === courseCode.toLowerCase());
  }, [papers, courseCode]);

  // Dynamically extract ONLY the available slots, exam types, years, and semesters for THIS subject
  const availableSlots = useMemo(() => {
    return Array.from(new Set(subjectPapers.map(p => p.slot_tag))).sort();
  }, [subjectPapers]);

  const availableExamTypes = useMemo(() => {
    return Array.from(new Set(subjectPapers.map(p => p.exam_type))).sort();
  }, [subjectPapers]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(subjectPapers.map(p => p.academic_year))).sort().reverse();
  }, [subjectPapers]);

  const availableSemesters = useMemo(() => {
    return Array.from(new Set(subjectPapers.map(p => p.semester))).sort();
  }, [subjectPapers]);

  // Filter States Inside Subject Page
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [onlyAnswerKeys, setOnlyAnswerKeys] = useState(false);
  const [sortBy, setSortBy] = useState('year-desc');

  // Filter Console Drawer Toggle
  const [showFilterConsole, setShowFilterConsole] = useState(true);
  const [isZipping, setIsZipping] = useState(false);

  // Filter Logic inside Subject View
  const filteredSubjectPapers = useMemo(() => {
    return subjectPapers.filter(paper => {
      // Answer Key Filter
      if (onlyAnswerKeys && !paper.has_answer_key) return false;

      // Exam Category Filter
      if (selectedExams.length > 0 && !selectedExams.includes(paper.exam_type)) return false;

      // Slot Filter (Only matching available slots)
      if (selectedSlots.length > 0 && !selectedSlots.includes(paper.slot_tag)) return false;

      // Year Filter
      if (selectedYears.length > 0 && !selectedYears.includes(paper.academic_year)) return false;

      // Semester Filter
      if (selectedSemesters.length > 0 && !selectedSemesters.includes(paper.semester)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'year-desc') {
        return b.academic_year.localeCompare(a.academic_year);
      } else if (sortBy === 'year-asc') {
        return a.academic_year.localeCompare(b.academic_year);
      }
      return 0;
    });
  }, [subjectPapers, onlyAnswerKeys, selectedExams, selectedSlots, selectedYears, selectedSemesters, sortBy]);

  const toggleFilter = (list, setList, val) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  // Download All Papers as ZIP for this subject
  const handleDownloadAllSubjectZip = async () => {
    if (filteredSubjectPapers.length === 0) {
      onToast('No papers available to download.');
      return;
    }

    setIsZipping(true);
    onToast(`Downloading ${filteredSubjectPapers.length} paper(s) for ${course.course_code}...`);

    try {
      const zip = new JSZip();
      for (const paper of filteredSubjectPapers) {
        const filename = `${paper.course_code}_${paper.exam_type}_${paper.slot_tag}_${paper.academic_year}.jpg`;
        try {
          const resp = await fetch(paper.file_url);
          const blob = await resp.blob();
          zip.file(filename, blob);
        } catch {
          zip.file(filename + '.txt', `Sample scan for ${paper.course_code}`);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${course.course_code}_papers_bundle.zip`;
      link.click();

      onToast(`Downloaded ZIP for ${course.course_code}!`);
    } catch {
      onToast('Failed to generate ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="subject-detail-container">
      <div className="subject-detail-inner">
        {/* Navigation Breadcrumb */}
        <div className="detail-breadcrumb">
          <button className="btn btn-cyber-outline btn-sm" onClick={onBack}>
            <ArrowLeft size={15} />
            <span>BACK TO MAIN CATALOGUE</span>
          </button>
          <span className="breadcrumb-path">
            Catalogue / <strong style={{ color: 'var(--amber-accent)' }}>{course.course_code}</strong>
          </span>
        </div>

        {/* Subject Header Banner */}
        <div className="subject-banner-card cyber-card">
          <div className="banner-top-row">
            <span className="code-pill-large">{course.course_code}</span>
            <span className="papers-count-badge">
              <FileText size={14} />
              <span>{subjectPapers.length} PAPERS UPLOADED</span>
            </span>
          </div>

          <h1 className="subject-banner-title">{course.subject_name}</h1>
          <p className="subject-banner-desc">
            Complete question paper repository for {course.subject_name} ({course.course_code}). Filters below automatically display available timetable slots, exam categories, and academic years for this course.
          </p>

          <div className="banner-actions">
            <button
              className="btn btn-cyber-amber"
              onClick={handleDownloadAllSubjectZip}
              disabled={isZipping || filteredSubjectPapers.length === 0}
            >
              <Download size={16} />
              <span>{isZipping ? 'PACKAGING ZIP...' : `DOWNLOAD SELECTED PAPERS ZIP (${filteredSubjectPapers.length})`}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Subject Filter Deck (Shows Slots Only According to Availability) */}
        <div className="cyber-filter-deck cyber-card">
          <div className="deck-bar-header">
            <button
              className="btn btn-cyber-outline btn-sm"
              onClick={() => setShowFilterConsole(!showFilterConsole)}
            >
              <Filter size={15} />
              <span>{showFilterConsole ? 'HIDE SUBJECT FILTERS' : 'SHOW SUBJECT FILTERS'}</span>
            </button>

            {/* Answer Key Quick Toggle */}
            <label className="cyber-toggle-label">
              <input
                type="checkbox"
                checked={onlyAnswerKeys}
                onChange={e => setOnlyAnswerKeys(e.target.checked)}
              />
              <span className="cyber-toggle-box"></span>
              <span>ANSWER KEY ONLY</span>
            </label>
          </div>

          {/* Expandable Filter Console showing ONLY available slots */}
          {showFilterConsole && (
            <div className="filter-console-body">
              {/* Dynamic Available Slots Row */}
              <div className="filter-row">
                <span className="filter-row-title">AVAILABLE SLOTS:</span>
                <div className="filter-chips">
                  {availableSlots.length === 0 ? (
                    <span className="no-options-text">No slots found</span>
                  ) : (
                    availableSlots.map(slot => (
                      <button
                        key={slot}
                        className={`chip ${selectedSlots.includes(slot) ? 'active' : ''}`}
                        onClick={() => toggleFilter(selectedSlots, setSelectedSlots, slot)}
                      >
                        Slot {slot}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Dynamic Exam Categories */}
              {availableExamTypes.length > 0 && (
                <div className="filter-row">
                  <span className="filter-row-title">EXAM TYPE:</span>
                  <div className="filter-chips">
                    {availableExamTypes.map(exam => (
                      <button
                        key={exam}
                        className={`chip ${selectedExams.includes(exam) ? 'active' : ''}`}
                        onClick={() => toggleFilter(selectedExams, setSelectedExams, exam)}
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Academic Years */}
              {availableYears.length > 0 && (
                <div className="filter-row">
                  <span className="filter-row-title">ACADEMIC YEAR:</span>
                  <div className="filter-chips">
                    {availableYears.map(yr => (
                      <button
                        key={yr}
                        className={`chip ${selectedYears.includes(yr) ? 'active' : ''}`}
                        onClick={() => toggleFilter(selectedYears, setSelectedYears, yr)}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Semesters */}
              {availableSemesters.length > 0 && (
                <div className="filter-row">
                  <span className="filter-row-title">SEMESTER:</span>
                  <div className="filter-chips">
                    {availableSemesters.map(sem => (
                      <button
                        key={sem}
                        className={`chip ${selectedSemesters.includes(sem) ? 'active' : ''}`}
                        onClick={() => toggleFilter(selectedSemesters, setSelectedSemesters, sem)}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Papers Grid */}
        <div className="subject-papers-grid">
          <div className="matrix-results-bar" style={{ gridColumn: '1 / -1' }}>
            <span>SHOWING {filteredSubjectPapers.length} EXAM PAPERS FOR {course.course_code}</span>
            <div className="sort-box">
              <span>SORT:</span>
              <select
                className="cyber-select-mini"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="year-desc">YEAR (NEW TO OLD)</option>
                <option value="year-asc">YEAR (OLD TO NEW)</option>
              </select>
            </div>
          </div>

          {filteredSubjectPapers.length === 0 ? (
            <div className="empty-subject-card cyber-card">
              <h3>NO PAPERS MATCH YOUR FILTERS FOR {course.course_code}</h3>
              <p>Try clearing some slot or exam filters above.</p>
            </div>
          ) : (
            filteredSubjectPapers.map(paper => (
              <div key={paper.id} className="subject-paper-card cyber-card">
                {/* Thumbnail Preview */}
                <div className="paper-thumb-box" onClick={() => onViewPaper(paper)}>
                  <img src={paper.file_url} alt={paper.subject_name} loading="lazy" />
                  <div className="thumb-hover-overlay">
                    <button className="btn btn-cyber-red btn-sm">
                      <Eye size={14} />
                      <span>INSPECT SCAN</span>
                    </button>
                  </div>
                </div>

                {/* Info Details */}
                <div className="paper-details">
                  <div className="paper-top-tags">
                    <span className="cyber-pill pill-exam">{paper.exam_type}</span>
                    <span className="cyber-pill pill-slot">Slot {paper.slot_tag}</span>
                    {paper.has_answer_key && (
                      <span className="key-badge">
                        <CheckCircle size={12} /> KEY INCLUDED
                      </span>
                    )}
                  </div>

                  <h3 className="paper-title" onClick={() => onViewPaper(paper)}>
                    {paper.exam_type} — Slot {paper.slot_tag} ({paper.academic_year})
                  </h3>

                  <div className="paper-meta-row">
                    <span className="meta-item"><Calendar size={13} /> {paper.academic_year}</span>
                    <span className="meta-item"><Clock size={13} /> {paper.semester}</span>
                  </div>

                  {/* Actions */}
                  <div className="paper-card-footer">
                    <button
                      className="btn btn-cyber-red btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => onViewPaper(paper)}
                    >
                      <Eye size={14} />
                      <span>VIEW FULL PAPER</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .subject-detail-container {
          padding: 2rem 1.5rem 5rem;
        }
        .subject-detail-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .breadcrumb-path {
          font-family: var(--font-pixel);
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .subject-banner-card {
          padding: 2.25rem;
          margin-bottom: 1.75rem;
          border-color: var(--border-crimson);
          background: rgba(10, 1, 1, 0.95);
        }
        .banner-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .code-pill-large {
          font-family: var(--font-pixel);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--amber-accent);
          background: rgba(224, 139, 38, 0.2);
          padding: 0.25rem 0.85rem;
          border: 1px solid rgba(224, 139, 38, 0.4);
        }
        .papers-count-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-arcade);
          font-size: 0.65rem;
          color: var(--text-muted);
        }
        .subject-banner-title {
          font-size: 2.4rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          font-family: var(--font-pixel);
        }
        .subject-banner-desc {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 720px;
          margin-bottom: 1.5rem;
          font-family: var(--font-pixel);
        }
        .banner-actions {
          display: flex;
          gap: 1rem;
        }
        .cyber-filter-deck {
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        .deck-bar-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cyber-toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: var(--text-cream);
          cursor: pointer;
          font-family: var(--font-pixel);
        }
        .filter-console-body {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 2px solid var(--border-dark);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .filter-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filter-row-title {
          font-family: var(--font-arcade);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--crimson-main);
          min-width: 130px;
        }
        .filter-chips {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .no-options-text {
          font-size: 0.82rem;
          color: var(--text-subtle);
          font-family: var(--font-pixel);
        }
        .chip {
          padding: 0.25rem 0.65rem;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid var(--border-dark);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-family: var(--font-pixel);
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 2px 2px 0px #000;
        }
        .chip:hover, .chip.active {
          border-color: var(--crimson-main);
          background: var(--crimson-main);
          color: #ffffff;
          box-shadow: 3px 3px 0px rgba(211, 7, 14, 0.5);
        }
        .matrix-results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-arcade);
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .cyber-select-mini {
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid var(--border-dark);
          color: var(--text-cream);
          padding: 0.25rem 0.5rem;
          font-family: var(--font-pixel);
          font-size: 0.85rem;
          margin-left: 0.4rem;
        }
        .subject-papers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .empty-subject-card {
          grid-column: 1 / -1;
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }
        .subject-paper-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .paper-thumb-box {
          position: relative;
          height: 190px;
          background: #000;
          cursor: pointer;
          overflow: hidden;
          border-bottom: 2px solid var(--border-dark);
        }
        .paper-thumb-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .paper-thumb-box:hover img {
          transform: scale(1.05);
        }
        .thumb-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .paper-thumb-box:hover .thumb-hover-overlay {
          opacity: 1;
        }
        .paper-details {
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex: 1;
        }
        .paper-top-tags {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .paper-title {
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-pixel);
        }
        .paper-title:hover {
          color: var(--crimson-bright);
        }
        .paper-meta-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          font-family: var(--font-pixel);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .paper-card-footer {
          margin-top: auto;
          padding-top: 0.6rem;
        }
      `}</style>
    </div>
  );
}
