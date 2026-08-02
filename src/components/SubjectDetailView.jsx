import React, { useState } from 'react';
import { ArrowLeft, Download, Eye, CheckCircle, FileText, Calendar, Clock } from 'lucide-react';
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

  // Get all papers for this course code
  const subjectPapers = papers.filter(p => p.course_code.toLowerCase() === courseCode.toLowerCase());

  // Exam type tab filter: 'ALL' | 'CAT-1' | 'CAT-2' | 'FAT'
  const [activeExamTab, setActiveExamTab] = useState('ALL');
  const [isZipping, setIsZipping] = useState(false);

  const displayedPapers = activeExamTab === 'ALL'
    ? subjectPapers
    : subjectPapers.filter(p => p.exam_type === activeExamTab);

  // Download All Papers as ZIP for this subject
  const handleDownloadAllSubjectZip = async () => {
    if (subjectPapers.length === 0) {
      onToast('No papers available to download.');
      return;
    }

    setIsZipping(true);
    onToast(`Downloading all ${subjectPapers.length} paper(s) for ${course.course_code}...`);

    try {
      const zip = new JSZip();
      for (const paper of subjectPapers) {
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
      link.download = `${course.course_code}_all_papers.zip`;
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
            <span>Back to Catalogue</span>
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
              <span>{subjectPapers.length} Papers Available</span>
            </span>
          </div>

          <h1 className="subject-banner-title">{course.subject_name}</h1>
          <p className="subject-banner-desc">
            Complete question paper repository including CAT-1, CAT-2, and Term End (FAT) exams across Fall and Winter semesters.
          </p>

          <div className="banner-actions">
            <button
              className="btn btn-cyber-amber"
              onClick={handleDownloadAllSubjectZip}
              disabled={isZipping || subjectPapers.length === 0}
            >
              <Download size={16} />
              <span>{isZipping ? 'Packaging ZIP...' : `Download All Papers ZIP (${subjectPapers.length})`}</span>
            </button>
          </div>
        </div>

        {/* Exam Type Tabs */}
        <div className="exam-tabs-bar">
          {['ALL', 'CAT-1', 'CAT-2', 'FAT'].map(tab => (
            <button
              key={tab}
              className={`exam-tab-btn ${activeExamTab === tab ? 'active' : ''}`}
              onClick={() => setActiveExamTab(tab)}
            >
              <span>{tab === 'ALL' ? 'All Papers' : tab}</span>
              <span className="tab-count">
                {tab === 'ALL'
                  ? subjectPapers.length
                  : subjectPapers.filter(p => p.exam_type === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Papers Grid */}
        <div className="subject-papers-grid">
          {displayedPapers.length === 0 ? (
            <div className="empty-subject-card cyber-card">
              <h3>No papers found for category {activeExamTab}</h3>
              <p>Try selecting a different exam tab above.</p>
            </div>
          ) : (
            displayedPapers.map(paper => (
              <div key={paper.id} className="subject-paper-card cyber-card">
                {/* Thumbnail Preview */}
                <div className="paper-thumb-box" onClick={() => onViewPaper(paper)}>
                  <img src={paper.file_url} alt={paper.subject_name} loading="lazy" />
                  <div className="thumb-hover-overlay">
                    <button className="btn btn-cyber-red btn-sm">
                      <Eye size={14} />
                      <span>Inspect Paper</span>
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
                        <CheckCircle size={12} /> Answer Key
                      </span>
                    )}
                  </div>

                  <h3 className="paper-title" onClick={() => onViewPaper(paper)}>
                    {paper.exam_type} — {paper.slot_tag} ({paper.academic_year})
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
                      <span>View Full Paper</span>
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
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .subject-banner-card {
          padding: 2.25rem;
          margin-bottom: 2rem;
          border-color: var(--border-crimson);
          background: rgba(14, 2, 2, 0.95);
        }
        .banner-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .code-pill-large {
          font-family: var(--font-mono);
          font-size: 1rem;
          font-weight: 800;
          color: var(--amber-accent);
          background: rgba(224, 139, 38, 0.18);
          padding: 0.25rem 0.85rem;
          border-radius: 6px;
          border: 1px solid rgba(224, 139, 38, 0.4);
        }
        .papers-count-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .subject-banner-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }
        .subject-banner-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          max-width: 700px;
          margin-bottom: 1.5rem;
        }
        .banner-actions {
          display: flex;
          gap: 1rem;
        }
        .exam-tabs-bar {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 0.85rem;
        }
        .exam-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem;
          border-radius: 8px;
          background: rgba(14, 2, 2, 0.7);
          border: 1px solid var(--border-dark);
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .exam-tab-btn.active {
          background: var(--crimson-main);
          color: #ffffff;
          border-color: var(--crimson-bright);
        }
        .tab-count {
          background: rgba(0, 0, 0, 0.5);
          padding: 0.1rem 0.45rem;
          border-radius: 999px;
          font-size: 0.72rem;
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
          background: rgba(0, 0, 0, 0.75);
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
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
        }
        .paper-title:hover {
          color: var(--crimson-bright);
        }
        .paper-meta-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
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
