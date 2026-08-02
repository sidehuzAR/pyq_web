import React, { useState, useMemo } from 'react';
import { Filter, CheckSquare, Square, Download, Eye, ChevronDown, CheckCircle, FolderOpen } from 'lucide-react';
import JSZip from 'jszip';
import { AVAILABLE_SLOTS, ACADEMIC_YEARS, SEMESTERS, EXAM_TYPES } from '../data/initialData.js';

export default function Catalogue({
  papers,
  courses,
  searchQuery,
  onSelectSubject,
  onViewPaper,
  onToast
}) {
  // Filter States
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [onlyAnswerKeys, setOnlyAnswerKeys] = useState(false);
  const [sortBy, setSortBy] = useState('year-desc');

  // Filter Drawer Toggle State
  const [showFilterDrawer, setShowFilterDrawer] = useState(true);

  // Checkbox Batch Selection State
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const [isZipping, setIsZipping] = useState(false);

  // Filter Logic
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = paper.course_code.toLowerCase().includes(q);
        const matchName = paper.subject_name.toLowerCase().includes(q);
        if (!matchCode && !matchName) return false;
      }

      // Answer Key Filter
      if (onlyAnswerKeys && !paper.has_answer_key) return false;

      // Exam Filter
      if (selectedExams.length > 0 && !selectedExams.includes(paper.exam_type)) return false;

      // Slot Filter
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
      } else if (sortBy === 'code-asc') {
        return a.course_code.localeCompare(b.course_code);
      }
      return 0;
    });
  }, [papers, searchQuery, onlyAnswerKeys, selectedExams, selectedSlots, selectedYears, selectedSemesters, sortBy]);

  // Batch Select Handlers
  const handleSelectAll = () => {
    setSelectedPaperIds(filteredPapers.map(p => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedPaperIds([]);
  };

  const togglePaperSelection = (id) => {
    setSelectedPaperIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // ZIP Download Handler
  const handleDownloadSelectedZip = async () => {
    if (selectedPaperIds.length === 0) {
      onToast('Please select at least one paper to download.');
      return;
    }

    setIsZipping(true);
    onToast(`Packaging ${selectedPaperIds.length} paper(s) into ZIP bundle...`);

    try {
      const zip = new JSZip();
      const selectedPapers = papers.filter(p => selectedPaperIds.includes(p.id));

      for (const paper of selectedPapers) {
        const filename = `${paper.course_code}_${paper.exam_type}_${paper.slot_tag}_${paper.academic_year}.jpg`;
        try {
          const resp = await fetch(paper.file_url);
          const blob = await resp.blob();
          zip.file(filename, blob);
        } catch {
          zip.file(filename + '.txt', `Sample paper scan for ${paper.course_code}`);
        }
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipContent);
      link.download = `pyarchive_bundle_${Date.now()}.zip`;
      link.click();

      onToast(`Downloaded ${selectedPaperIds.length} papers as ZIP!`);
    } catch {
      onToast('Failed to generate ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  const toggleFilter = (list, setList, val) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  return (
    <div className="hackclub-catalogue">
      <div className="catalogue-container">
        {/* Top Section Header */}
        <div className="catalogue-top-header">
          <div className="section-label">
            <span>◇</span> EXAM CATALOGUE MATRIX
          </div>
          <p className="catalogue-sub">
            Filter past exam papers across VIT timetable slots and course categories. Click any subject to open its dedicated page.
          </p>
        </div>

        {/* Top Command Deck & Filters Console */}
        <div className="cyber-filter-deck cyber-card">
          <div className="deck-bar-header">
            <button
              className="btn btn-cyber-outline btn-sm"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            >
              <Filter size={15} />
              <span>{showFilterDrawer ? 'Hide Filters' : 'Show Filter Deck'}</span>
            </button>

            {/* Answer Key Quick Toggle */}
            <label className="cyber-toggle-label">
              <input
                type="checkbox"
                checked={onlyAnswerKeys}
                onChange={e => setOnlyAnswerKeys(e.target.checked)}
              />
              <span className="cyber-toggle-box"></span>
              <span>Answer Key Only</span>
            </label>

            {/* Batch Download Controls */}
            <div className="deck-actions-right">
              <button className="btn btn-cyber-outline btn-sm" onClick={handleSelectAll}>
                Select All
              </button>
              <button className="btn btn-cyber-outline btn-sm" onClick={handleDeselectAll}>
                Deselect All
              </button>
              <button
                className="btn btn-cyber-amber btn-sm"
                onClick={handleDownloadSelectedZip}
                disabled={selectedPaperIds.length === 0 || isZipping}
              >
                <Download size={14} />
                <span>{isZipping ? 'Zipping...' : `Download Selected (${selectedPaperIds.length})`}</span>
              </button>
            </div>
          </div>

          {/* Expandable Filter Console */}
          {showFilterDrawer && (
            <div className="filter-console-body">
              {/* Exam Category Pills */}
              <div className="filter-row">
                <span className="filter-row-title">Exam Type:</span>
                <div className="filter-chips">
                  {EXAM_TYPES.map(exam => (
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

              {/* Slot Tags Matrix */}
              <div className="filter-row">
                <span className="filter-row-title">Slots:</span>
                <div className="filter-chips">
                  <span className="chip-category">Theory:</span>
                  {AVAILABLE_SLOTS.theory.map(slot => (
                    <button
                      key={slot}
                      className={`chip ${selectedSlots.includes(slot) ? 'active' : ''}`}
                      onClick={() => toggleFilter(selectedSlots, setSelectedSlots, slot)}
                    >
                      {slot}
                    </button>
                  ))}
                  <span className="chip-category">Tutorial:</span>
                  {AVAILABLE_SLOTS.tutorial.map(slot => (
                    <button
                      key={slot}
                      className={`chip ${selectedSlots.includes(slot) ? 'active' : ''}`}
                      onClick={() => toggleFilter(selectedSlots, setSelectedSlots, slot)}
                    >
                      {slot}
                    </button>
                  ))}
                  <span className="chip-category">Lab:</span>
                  {AVAILABLE_SLOTS.lab.map(slot => (
                    <button
                      key={slot}
                      className={`chip ${selectedSlots.includes(slot) ? 'active' : ''}`}
                      onClick={() => toggleFilter(selectedSlots, setSelectedSlots, slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Years & Semesters */}
              <div className="filter-row">
                <span className="filter-row-title">Academic Year:</span>
                <div className="filter-chips">
                  {ACADEMIC_YEARS.map(yr => (
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

              <div className="filter-row">
                <span className="filter-row-title">Semester:</span>
                <div className="filter-chips">
                  {SEMESTERS.map(sem => (
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
            </div>
          )}
        </div>

        {/* Papers Results Grid */}
        <div className="papers-matrix-wrapper">
          <div className="matrix-results-bar">
            <span>SHOWING {filteredPapers.length} QUESTION PAPERS</span>
            <div className="sort-box">
              <span>Sort:</span>
              <select
                className="cyber-select-mini"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="year-desc">Year (New to Old)</option>
                <option value="year-asc">Year (Old to New)</option>
                <option value="code-asc">Course Code</option>
              </select>
            </div>
          </div>

          <div className="papers-matrix-grid">
            {filteredPapers.length === 0 ? (
              <div className="empty-matrix cyber-card">
                <h3>No exam papers match your active filter options</h3>
                <p>Try resetting filters or searching for a different course code.</p>
              </div>
            ) : (
              filteredPapers.map(paper => {
                const isSelected = selectedPaperIds.includes(paper.id);

                return (
                  <div
                    key={paper.id}
                    className={`paper-matrix-card cyber-card ${isSelected ? 'selected' : ''}`}
                  >
                    {/* Corner Accent Node */}
                    <div className="corner-node"></div>

                    {/* Image Preview Thumbnail */}
                    <div className="card-thumb-box" onClick={() => onSelectSubject(paper.course_code)}>
                      <img src={paper.file_url} alt={paper.subject_name} loading="lazy" />
                      <div className="thumb-hover-action">
                        <button className="btn btn-cyber-red btn-sm">
                          <FolderOpen size={14} />
                          <span>Open Subject Page</span>
                        </button>
                      </div>

                      {/* Select Checkbox Button */}
                      <button
                        className={`select-check-btn ${isSelected ? 'checked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePaperSelection(paper.id);
                        }}
                      >
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="card-body">
                      <div className="card-top-info">
                        <span className="course-code-badge" onClick={() => onSelectSubject(paper.course_code)}>
                          {paper.course_code}
                        </span>
                        {paper.has_answer_key && (
                          <span className="key-badge">
                            <CheckCircle size={11} /> Answer Key
                          </span>
                        )}
                      </div>

                      <h3 className="subject-title" onClick={() => onSelectSubject(paper.course_code)}>
                        {paper.subject_name}
                      </h3>

                      {/* Badges */}
                      <div className="tag-badges-row">
                        <span className="cyber-pill pill-exam">{paper.exam_type}</span>
                        <span className="cyber-pill pill-slot">Slot {paper.slot_tag}</span>
                        <span className="cyber-pill pill-year">{paper.academic_year}</span>
                        <span className="cyber-pill pill-sem">{paper.semester}</span>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="card-footer-actions">
                        <label
                          className="select-toggle-label"
                          onClick={() => togglePaperSelection(paper.id)}
                        >
                          {isSelected ? <CheckSquare size={15} /> : <Square size={15} />}
                          <span>{isSelected ? 'Selected' : 'Select'}</span>
                        </label>

                        <button
                          className="btn-icon-mini"
                          title="Open Subject Page"
                          onClick={() => onSelectSubject(paper.course_code)}
                        >
                          <FolderOpen size={14} />
                        </button>

                        <button
                          className="btn-icon-mini"
                          title="Download Image"
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = paper.file_url;
                            link.download = `${paper.course_code}_${paper.exam_type}_${paper.slot_tag}.jpg`;
                            link.click();
                            onToast(`Downloading ${paper.course_code}...`);
                          }}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hackclub-catalogue {
          padding: 1rem 1.5rem 4rem;
        }
        .catalogue-container {
          max-width: 1300px;
          margin: 0 auto;
        }
        .catalogue-top-header {
          margin-bottom: 1.25rem;
        }
        .catalogue-sub {
          color: var(--text-muted);
          font-size: 0.9rem;
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
          font-size: 0.85rem;
          color: var(--text-cream);
          cursor: pointer;
        }
        .deck-actions-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .btn-sm {
          font-size: 0.78rem;
          padding: 0.4rem 0.85rem;
        }
        .filter-console-body {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-dark);
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
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--crimson-main);
          min-width: 110px;
        }
        .filter-chips {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .chip-category {
          font-size: 0.72rem;
          color: var(--text-subtle);
          margin-right: 0.2rem;
          font-weight: 600;
        }
        .chip {
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-dark);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .chip:hover, .chip.active {
          border-color: var(--crimson-main);
          background: var(--crimson-main);
          color: #ffffff;
        }
        .matrix-results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .cyber-select-mini {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-dark);
          color: var(--text-cream);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          margin-left: 0.4rem;
        }
        .papers-matrix-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.5rem;
        }
        .empty-matrix {
          grid-column: 1 / -1;
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }
        .paper-matrix-card {
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .paper-matrix-card.selected {
          border-color: var(--amber-accent);
          box-shadow: 0 0 25px rgba(224, 139, 38, 0.3);
        }
        .corner-node {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: var(--crimson-main);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--crimson-main);
        }
        .card-thumb-box {
          position: relative;
          height: 180px;
          background: #060101;
          overflow: hidden;
          cursor: pointer;
        }
        .card-thumb-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .paper-matrix-card:hover .card-thumb-box img {
          transform: scale(1.05);
        }
        .thumb-hover-action {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .card-thumb-box:hover .thumb-hover-action {
          opacity: 1;
        }
        .select-check-btn {
          position: absolute;
          top: 0.6rem;
          left: 0.6rem;
          background: rgba(0, 0, 0, 0.75);
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 4px;
        }
        .select-check-btn.checked {
          color: var(--amber-accent);
        }
        .card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .card-top-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .course-code-badge {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--amber-accent);
          cursor: pointer;
        }
        .course-code-badge:hover {
          text-decoration: underline;
        }
        .key-badge {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.72rem;
          color: #4ade80;
          font-family: var(--font-mono);
        }
        .subject-title {
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
        }
        .subject-title:hover {
          color: var(--crimson-bright);
        }
        .tag-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .cyber-pill {
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
        }
        .pill-exam {
          background: rgba(211, 7, 14, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(211, 7, 14, 0.4);
        }
        .pill-slot {
          background: rgba(224, 139, 38, 0.2);
          color: #ffb86c;
          border: 1px solid rgba(224, 139, 38, 0.4);
        }
        .pill-year {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
        }
        .pill-sem {
          background: rgba(91, 97, 214, 0.2);
          color: #a5b4fc;
        }
        .card-footer-actions {
          margin-top: auto;
          padding-top: 0.6rem;
          border-top: 1px solid var(--border-dark);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .select-toggle-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          cursor: pointer;
          margin-right: auto;
        }
        .btn-icon-mini {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-dark);
          color: var(--text-cream);
          padding: 0.3rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-icon-mini:hover {
          background: var(--crimson-main);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
