import React, { useState, useMemo } from 'react';
import { Filter, CheckSquare, Square, Download, Eye, Pin, ArrowUpDown, ChevronDown, CheckCircle } from 'lucide-react';
import JSZip from 'jszip';
import { AVAILABLE_SLOTS, ACADEMIC_YEARS, SEMESTERS, EXAM_TYPES } from '../data/initialData.js';

export default function Catalogue({
  papers,
  courses,
  searchQuery,
  pinnedSubjects,
  onTogglePin,
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

  // Accordion Expand States
  const [expandExams, setExpandExams] = useState(true);
  const [expandSlots, setExpandSlots] = useState(true);
  const [expandYears, setExpandYears] = useState(true);
  const [expandSemesters, setExpandSemesters] = useState(false);

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
    onToast(`Preparing ${selectedPaperIds.length} paper(s) ZIP bundle...`);

    try {
      const zip = new JSZip();
      const selectedPapers = papers.filter(p => selectedPaperIds.includes(p.id));

      // Fetch images/PDFs and append to zip
      for (const paper of selectedPapers) {
        const filename = `${paper.course_code}_${paper.exam_type}_${paper.slot_tag}_${paper.academic_year}.jpg`;
        try {
          const resp = await fetch(paper.file_url);
          const blob = await resp.blob();
          zip.file(filename, blob);
        } catch {
          // Fallback placeholder text if fetch fails
          zip.file(filename + '.txt', `Sample paper for ${paper.course_code} ${paper.exam_type}`);
        }
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipContent);
      link.download = `papersvitc_bundle_${Date.now()}.zip`;
      link.click();

      onToast(`Successfully downloaded ${selectedPaperIds.length} papers as ZIP!`);
    } catch (err) {
      onToast('Failed to create ZIP package.');
    } finally {
      setIsZipping(false);
    }
  };

  const toggleFilter = (list, setList, val) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  return (
    <div className="catalogue-section">
      <div className="catalogue-layout">
        {/* Left Filter Sidebar */}
        <aside className="filter-sidebar glass-card">
          <div className="filter-sidebar-header">
            <div className="filter-title">
              <Filter size={18} className="filter-icon" />
              <h3>Filters</h3>
            </div>
            {(selectedExams.length > 0 || selectedSlots.length > 0 || selectedYears.length > 0 || selectedSemesters.length > 0 || onlyAnswerKeys) && (
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setSelectedExams([]);
                  setSelectedSlots([]);
                  setSelectedYears([]);
                  setSelectedSemesters([]);
                  setOnlyAnswerKeys(false);
                }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Answer Key Available Toggle */}
          <div className="filter-group">
            <label className="toggle-checkbox-label">
              <input
                type="checkbox"
                checked={onlyAnswerKeys}
                onChange={(e) => setOnlyAnswerKeys(e.target.checked)}
              />
              <span className="toggle-custom-box"></span>
              <span className="toggle-text">Answer Key Available Only</span>
            </label>
          </div>

          {/* Exam Accordion */}
          <div className="filter-accordion">
            <div className="accordion-header" onClick={() => setExpandExams(!expandExams)}>
              <span>Exams</span>
              <ChevronDown size={16} style={{ transform: expandExams ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>
            {expandExams && (
              <div className="accordion-content">
                {EXAM_TYPES.map(exam => (
                  <label key={exam} className="filter-check-item">
                    <input
                      type="checkbox"
                      checked={selectedExams.includes(exam)}
                      onChange={() => toggleFilter(selectedExams, setSelectedExams, exam)}
                    />
                    <span>{exam}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Slots Accordion */}
          <div className="filter-accordion">
            <div className="accordion-header" onClick={() => setExpandSlots(!expandSlots)}>
              <span>Slots (Theory / Lab)</span>
              <ChevronDown size={16} style={{ transform: expandSlots ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>
            {expandSlots && (
              <div className="accordion-content">
                <div className="slot-section-title">Theory Slots</div>
                <div className="slot-pill-grid">
                  {AVAILABLE_SLOTS.theory.map(slot => (
                    <button
                      key={slot}
                      className={`slot-pill ${selectedSlots.includes(slot) ? 'active' : ''}`}
                      onClick={() => toggleFilter(selectedSlots, setSelectedSlots, slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="slot-section-title" style={{ marginTop: '0.6rem' }}>Tutorial Slots</div>
                <div className="slot-pill-grid">
                  {AVAILABLE_SLOTS.tutorial.map(slot => (
                    <button
                      key={slot}
                      className={`slot-pill ${selectedSlots.includes(slot) ? 'active' : ''}`}
                      onClick={() => toggleFilter(selectedSlots, setSelectedSlots, slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="slot-section-title" style={{ marginTop: '0.6rem' }}>Lab Slots</div>
                <div className="slot-pill-grid">
                  {AVAILABLE_SLOTS.lab.map(slot => (
                    <button
                      key={slot}
                      className={`slot-pill ${selectedSlots.includes(slot) ? 'active' : ''}`}
                      onClick={() => toggleFilter(selectedSlots, setSelectedSlots, slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Academic Years Accordion */}
          <div className="filter-accordion">
            <div className="accordion-header" onClick={() => setExpandYears(!expandYears)}>
              <span>Academic Years</span>
              <ChevronDown size={16} style={{ transform: expandYears ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>
            {expandYears && (
              <div className="accordion-content">
                {ACADEMIC_YEARS.map(yr => (
                  <label key={yr} className="filter-check-item">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(yr)}
                      onChange={() => toggleFilter(selectedYears, setSelectedYears, yr)}
                    />
                    <span>{yr}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Semesters Accordion */}
          <div className="filter-accordion">
            <div className="accordion-header" onClick={() => setExpandSemesters(!expandSemesters)}>
              <span>Semesters</span>
              <ChevronDown size={16} style={{ transform: expandSemesters ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>
            {expandSemesters && (
              <div className="accordion-content">
                {SEMESTERS.map(sem => (
                  <label key={sem} className="filter-check-item">
                    <input
                      type="checkbox"
                      checked={selectedSemesters.includes(sem)}
                      onChange={() => toggleFilter(selectedSemesters, setSelectedSemesters, sem)}
                    />
                    <span>{sem}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Catalogue Results Area */}
        <main className="catalogue-main">
          {/* Header Controls Bar */}
          <div className="catalogue-header-bar glass-card">
            <div className="catalogue-count">
              <h2>Question Papers</h2>
              <span className="count-pill">{filteredPapers.length} Available</span>
            </div>

            <div className="catalogue-actions-right">
              {/* Sort Selector */}
              <div className="sort-dropdown-wrapper">
                <ArrowUpDown size={14} />
                <select
                  className="form-select sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="year-desc">Sort: Year (New to Old)</option>
                  <option value="year-asc">Sort: Year (Old to New)</option>
                  <option value="code-asc">Sort: Course Code</option>
                </select>
              </div>

              {/* Batch Action Buttons */}
              <button className="btn btn-secondary" onClick={handleSelectAll}>
                Select All
              </button>
              <button className="btn btn-secondary" onClick={handleDeselectAll}>
                Deselect All
              </button>

              <button
                className="btn btn-amber"
                onClick={handleDownloadSelectedZip}
                disabled={selectedPaperIds.length === 0 || isZipping}
              >
                <Download size={16} />
                <span>{isZipping ? 'Zipping...' : `Download Selected (${selectedPaperIds.length})`}</span>
              </button>
            </div>
          </div>

          {/* Paper Cards Grid */}
          <div className="papers-grid">
            {filteredPapers.length === 0 ? (
              <div className="empty-results glass-card">
                <h3>No papers match your filters</h3>
                <p>Try clearing your active filter options or search for a different course code.</p>
              </div>
            ) : (
              filteredPapers.map(paper => {
                const isSelected = selectedPaperIds.includes(paper.id);
                const isPinned = pinnedSubjects.includes(paper.course_code);

                return (
                  <div
                    key={paper.id}
                    className={`paper-card glass-card ${isSelected ? 'selected' : ''}`}
                  >
                    {/* Thumbnail View */}
                    <div className="paper-card-thumb" onClick={() => onViewPaper(paper)}>
                      <img src={paper.file_url} alt={paper.subject_name} loading="lazy" />
                      <div className="thumb-overlay">
                        <button className="btn btn-primary btn-sm">
                          <Eye size={15} />
                          <span>Quick View</span>
                        </button>
                      </div>

                      {/* Checkbox Select Overlay */}
                      <button
                        className={`paper-checkbox-btn ${isSelected ? 'checked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePaperSelection(paper.id);
                        }}
                      >
                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>

                      {/* Pin Button */}
                      <button
                        className={`paper-pin-btn ${isPinned ? 'active' : ''}`}
                        title="Pin course to homepage"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(paper.course_code);
                          onToast(isPinned ? `Unpinned ${paper.course_code}` : `Pinned ${paper.course_code} to homepage`);
                        }}
                      >
                        <Pin size={14} />
                      </button>
                    </div>

                    {/* Paper Info Content */}
                    <div className="paper-card-body">
                      <div className="paper-code-row">
                        <span className="paper-code">{paper.course_code}</span>
                        {paper.has_answer_key && (
                          <span className="badge-answer-key" title="Verified Answer Key Included">
                            <CheckCircle size={12} /> Key
                          </span>
                        )}
                      </div>

                      <h3 className="paper-title" onClick={() => onViewPaper(paper)}>
                        {paper.subject_name}
                      </h3>

                      {/* Metadata Badges */}
                      <div className="paper-badges">
                        <span className="badge badge-exam">{paper.exam_type}</span>
                        <span className="badge badge-slot">Slot {paper.slot_tag}</span>
                        <span className="badge badge-year">{paper.academic_year}</span>
                        <span className="badge badge-semester">{paper.semester}</span>
                      </div>

                      {/* Action Bar */}
                      <div className="paper-card-actions">
                        <label
                          className="select-label"
                          onClick={() => togglePaperSelection(paper.id)}
                        >
                          {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                          <span>{isSelected ? 'Selected' : 'Select'}</span>
                        </label>

                        <button
                          className="btn-icon btn-sm"
                          title="Direct Download"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = paper.file_url;
                            link.download = `${paper.course_code}_${paper.exam_type}_${paper.slot_tag}.jpg`;
                            link.click();
                            onToast(`Downloading ${paper.course_code} paper...`);
                          }}
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      <style>{`
        .catalogue-section {
          padding: 1rem 1.5rem 3rem;
        }
        .catalogue-layout {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
        }
        .filter-sidebar {
          padding: 1.25rem;
          height: fit-content;
          position: sticky;
          top: 80px;
        }
        .filter-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .filter-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .filter-icon {
          color: var(--highlight);
        }
        .reset-filters-btn {
          background: none;
          border: none;
          color: var(--accent-bright);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }
        .toggle-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          padding: 0.5rem 0;
        }
        .filter-accordion {
          border-top: 1px solid var(--border);
          padding-top: 0.75rem;
          margin-top: 0.75rem;
        }
        .accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }
        .accordion-header:hover {
          color: var(--text);
        }
        .accordion-content {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 0.6rem;
        }
        .filter-check-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text);
          cursor: pointer;
        }
        .slot-section-title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-subtle);
        }
        .slot-pill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .slot-pill {
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .slot-pill:hover, .slot-pill.active {
          background: var(--highlight);
          color: #020000;
          border-color: var(--highlight);
        }
        .catalogue-main {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .catalogue-header-bar {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .catalogue-count {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .catalogue-count h2 {
          font-size: 1.3rem;
        }
        .count-pill {
          padding: 0.2rem 0.6rem;
          background: rgba(172, 18, 12, 0.2);
          border: 1px solid rgba(172, 18, 12, 0.4);
          color: #ff6b6b;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .catalogue-actions-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .sort-dropdown-wrapper {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.2rem 0.8rem;
        }
        .sort-select {
          border: none;
          background: transparent;
          padding: 0.35rem 0.2rem;
          font-size: 0.85rem;
        }
        .papers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .empty-results {
          grid-column: 1 / -1;
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }
        .paper-card {
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .paper-card.selected {
          border-color: var(--highlight);
          box-shadow: 0 0 25px rgba(208, 125, 34, 0.3);
        }
        .paper-card-thumb {
          position: relative;
          height: 180px;
          background: #0b0202;
          overflow: hidden;
          cursor: pointer;
        }
        .paper-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .paper-card:hover .paper-card-thumb img {
          transform: scale(1.05);
        }
        .thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(2, 0, 0, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .paper-card-thumb:hover .thumb-overlay {
          opacity: 1;
        }
        .paper-checkbox-btn {
          position: absolute;
          top: 0.6rem;
          left: 0.6rem;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 6px;
        }
        .paper-checkbox-btn.checked {
          color: var(--highlight);
        }
        .paper-pin-btn {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 50%;
        }
        .paper-pin-btn.active {
          color: var(--highlight);
        }
        .paper-card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .paper-code-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .paper-code {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--highlight);
        }
        .badge-answer-key {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #4ade80;
        }
        .paper-title {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.3;
          cursor: pointer;
        }
        .paper-title:hover {
          color: var(--accent-bright);
        }
        .paper-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.2rem;
        }
        .paper-card-actions {
          margin-top: auto;
          padding-top: 0.6rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .select-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          cursor: pointer;
        }
        @media (max-width: 900px) {
          .catalogue-layout {
            grid-template-columns: 1fr;
          }
          .filter-sidebar {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
