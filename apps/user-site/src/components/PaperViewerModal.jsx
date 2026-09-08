import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, Download, Share2, AlertTriangle, Check, CheckCircle } from 'lucide-react';
import { downloadPaperAsPdf } from '../lib/pdf.js';

export default function PaperViewerModal({ paper, onClose, onToast }) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!paper) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleShare = () => {
    const url = `${window.location.origin}/#paper=${paper.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    onToast('Paper link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportEmail.includes('@')) {
      onToast('Please enter a valid email address.');
      return;
    }
    onToast('Thank you! Your tag correction report has been submitted.');
    setShowReportModal(false);
    setReportComment('');
    setReportEmail('');
  };

  return (
    <div className={`modal-overlay ${isFullscreen ? 'fullscreen-overlay' : ''}`} onClick={onClose}>
      <div className="viewer-container glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="viewer-header">
          <div className="viewer-title-group">
            <span className="viewer-code">{paper.course_code}</span>
            <h2 className="viewer-title">{paper.subject_name}</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Paper Viewer Area with Floating Dock */}
        <div className="viewer-body">
          <div className="viewer-canvas-wrapper">
            <img
              src={paper.file_url}
              alt={paper.subject_name}
              className="viewer-image"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          {/* Floating Action Dock (Right) */}
          <div className="floating-dock glass-card">
            <button className="dock-btn" title="Zoom In (+)" onClick={handleZoomIn}>
              <ZoomIn size={18} />
            </button>
            <button className="dock-btn" title="Zoom Out (-)" onClick={handleZoomOut}>
              <ZoomOut size={18} />
            </button>
            <button className="dock-btn" title="Reset Zoom" onClick={handleResetZoom}>
              <RotateCcw size={16} />
            </button>
            <div className="dock-divider"></div>
            <button
              className="dock-btn"
              title="Expand / Fullscreen"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 size={18} />
            </button>
            <button
              className="dock-btn"
              title="Download Paper"
              onClick={async () => {
                onToast(`Downloading ${paper.course_code}...`);
                try {
                  await downloadPaperAsPdf(paper);
                } catch (e) {
                  onToast('Download failed.', 'error');
                }
              }}
            >
              <Download size={18} />
            </button>
            <button
              className={`dock-btn ${copiedLink ? 'active-share' : ''}`}
              title="Share Link"
              onClick={handleShare}
            >
              {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
            </button>
          </div>
        </div>

        {/* Footer & Details */}
        <div className="viewer-footer">
          <div className="viewer-metadata">
            <span className="badge badge-exam">{paper.exam_type}</span>
            <span className="badge badge-slot">Slot {paper.slot_tag}</span>
            <span className="badge badge-year">{paper.academic_year}</span>
            <span className="badge badge-semester">{paper.semester}</span>
            {paper.has_answer_key && (
              <span className="badge-answer-key" style={{ marginLeft: '0.5rem' }}>
                <CheckCircle size={14} /> Includes Answer Key
              </span>
            )}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowReportModal(true)}
          >
            <AlertTriangle size={14} />
            <span>Report Wrong Tags</span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)} style={{ zIndex: 1100 }}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Report Wrong Tags or Scan Issue</h3>
              <button className="btn-icon btn-sm" onClick={() => setShowReportModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="form-group">
                <label className="form-label">Issue Details</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Explain what is wrong (e.g. paper is CAT-2 instead of CAT-1, or wrong slot tag)..."
                  value={reportComment}
                  onChange={e => setReportComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Your Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@gmail.com"
                  value={reportEmail}
                  onChange={e => setReportEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .viewer-container {
          width: 100%;
          max-width: 960px;
          height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .fullscreen-overlay .viewer-container {
          max-width: 100vw;
          height: 100vh;
          border-radius: 0;
        }
        .viewer-header {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
        }
        .viewer-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .viewer-code {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--highlight);
          padding: 0.2rem 0.6rem;
          background: rgba(208, 125, 34, 0.15);
          border-radius: 6px;
        }
        .viewer-title {
          font-size: 1.2rem;
        }
        .viewer-body {
          flex: 1;
          position: relative;
          background: #040101;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .viewer-canvas-wrapper {
          padding: 2rem;
          display: flex;
          justify-content: center;
        }
        .viewer-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
          border-radius: 8px;
        }
        .floating-dock {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: 999px;
          background: rgba(18, 2, 2, 0.85);
          box-shadow: 0 10px 30px rgba(0,0,0,0.7);
        }
        .dock-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .dock-btn:hover {
          background: var(--accent);
          color: #ffffff;
        }
        .dock-btn.active-share {
          background: var(--success);
          color: #ffffff;
        }
        .dock-divider {
          height: 1px;
          background: rgba(255,255,255,0.12);
          margin: 0.2rem 0;
        }
        .viewer-footer {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .viewer-metadata {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
