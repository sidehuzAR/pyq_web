import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, Trash2, PlusCircle, Check, Eye, X, BookOpen } from 'lucide-react';

export default function AdminPortal({
  pendingPapers,
  courses,
  onApprovePaper,
  onRejectPaper,
  onAddCourse,
  onToast,
  onBackToMain
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('accept-queue'); // 'accept-queue' | 'add-subject'
  const [selectedPreviewPaper, setSelectedPreviewPaper] = useState(null);

  // New Subject Form
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
      onToast('Welcome to the Admin Moderation Dashboard!');
    } else {
      onToast('Invalid admin password.');
    }
  };

  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!newCode || !newName) {
      onToast('Please enter both course code and subject name.');
      return;
    }

    const created = onAddCourse({
      course_code: newCode.trim().toUpperCase(),
      subject_name: newName.trim()
    });

    onToast(`Added subject ${newCode.trim().toUpperCase()} - ${newName.trim()} to registry!`);
    setNewCode('');
    setNewName('');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card glass-card">
          <div className="admin-icon-header">
            <ShieldCheck size={36} className="admin-shield-icon" />
          </div>
          <h2>Admin Moderation Gateway</h2>
          <p className="admin-login-sub">Enter password to access approval queue and subject registry</p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Admin Master Password</label>
              <div className="password-input-wrapper">
                <Lock size={16} className="lock-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter admin password (default: admin123)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-amber style-full">
              Login to Admin Control Panel
            </button>
          </form>

          <button className="back-link-btn" onClick={onBackToMain}>
            ← Back to Public Website
          </button>
        </div>

        <style>{`
          .admin-login-screen {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }
          .admin-login-card {
            width: 100%;
            max-width: 440px;
            padding: 2.5rem 2rem;
            text-align: center;
          }
          .admin-icon-header {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: rgba(172, 18, 12, 0.2);
            border: 1px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.25rem;
          }
          .admin-shield-icon {
            color: var(--highlight);
          }
          .admin-login-sub {
            color: var(--text-muted);
            font-size: 0.88rem;
            margin-bottom: 1.5rem;
          }
          .password-input-wrapper {
            position: relative;
          }
          .lock-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
          }
          .password-input-wrapper input {
            padding-left: 2.5rem;
          }
          .style-full {
            width: 100%;
            margin-top: 0.5rem;
          }
          .back-link-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-top: 1.5rem;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-inner">
        {/* Top Header */}
        <div className="admin-top-bar glass-card">
          <div className="admin-title-group">
            <ShieldCheck size={22} style={{ color: 'var(--highlight)' }} />
            <div>
              <h2>Admin Moderation Dashboard</h2>
              <span className="admin-status-pill">Logged in as Administrator</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={onBackToMain}>
              View Public Website
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation (2 Core Features) */}
        <div className="admin-tabs-bar">
          <button
            className={`admin-tab-btn ${activeTab === 'accept-queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('accept-queue')}
          >
            <CheckCircle size={16} />
            <span>Feature 1: Accept Uploaded Papers</span>
            {pendingPapers.length > 0 && (
              <span className="tab-counter">{pendingPapers.length}</span>
            )}
          </button>

          <button
            className={`admin-tab-btn ${activeTab === 'add-subject' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-subject')}
          >
            <PlusCircle size={16} />
            <span>Feature 2: Add New Subject</span>
          </button>
        </div>

        {/* Tab 1: Accept Uploaded Papers Queue */}
        {activeTab === 'accept-queue' && (
          <div className="admin-tab-content">
            <div className="queue-header-info">
              <h3>Pending Submissions Queue</h3>
              <p>Review student uploads side-by-side and click Accept to push them live to the public site.</p>
            </div>

            {pendingPapers.length === 0 ? (
              <div className="empty-queue-card glass-card">
                <CheckCircle size={40} style={{ color: '#4ade80', marginBottom: '0.75rem' }} />
                <h3>No Pending Submissions</h3>
                <p>All paper uploads have been moderated and pushed live.</p>
              </div>
            ) : (
              <div className="queue-list">
                {pendingPapers.map(paper => (
                  <div key={paper.id} className="queue-item-card glass-card">
                    {/* Left: Thumbnail & Preview trigger */}
                    <div className="queue-item-thumb">
                      <img src={paper.file_url} alt={paper.subject_name} />
                      <button
                        className="thumb-preview-btn"
                        onClick={() => setSelectedPreviewPaper(paper)}
                      >
                        <Eye size={16} /> Preview
                      </button>
                    </div>

                    {/* Middle: Metadata Details */}
                    <div className="queue-item-details">
                      <div className="queue-code-row">
                        <span className="paper-code">{paper.course_code}</span>
                        <span className="queue-uploader">{paper.uploaded_by || 'Student'}</span>
                      </div>
                      <h3 className="queue-subject-title">{paper.subject_name}</h3>

                      <div className="paper-badges">
                        <span className="badge badge-exam">{paper.exam_type}</span>
                        <span className="badge badge-slot">Slot {paper.slot_tag}</span>
                        <span className="badge badge-year">{paper.academic_year}</span>
                        <span className="badge badge-semester">{paper.semester}</span>
                        {paper.has_answer_key && (
                          <span className="badge-answer-key">✓ Key Included</span>
                        )}
                      </div>
                    </div>

                    {/* Right: 1-Click Accept / Reject Actions */}
                    <div className="queue-item-actions">
                      <button
                        className="btn btn-amber"
                        onClick={() => {
                          onApprovePaper(paper.id);
                          onToast(`Accepted & Pushed ${paper.course_code} ${paper.exam_type} live to public site!`);
                        }}
                      >
                        <Check size={16} />
                        <span>Accept & Push Live</span>
                      </button>

                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          onRejectPaper(paper.id);
                          onToast(`Rejected pending upload for ${paper.course_code}`);
                        }}
                        style={{ color: '#ff6b6b', borderColor: 'rgba(172, 18, 12, 0.4)' }}
                      >
                        <Trash2 size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Add New Subject */}
        {activeTab === 'add-subject' && (
          <div className="admin-tab-content">
            <div className="add-subject-grid">
              {/* Form */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ marginBottom: '0.4rem' }}>Add New Subject to Registry</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Newly added subjects will immediately become available in the student upload modal and catalogue search.
                </p>

                <form onSubmit={handleAddSubjectSubmit}>
                  <div className="form-group">
                    <label className="form-label">Course Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. BCSE301L"
                      value={newCode}
                      onChange={e => setNewCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Software Engineering"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-amber" style={{ marginTop: '0.5rem', width: '100%' }}>
                    <PlusCircle size={16} />
                    <span>Add Subject to Registry</span>
                  </button>
                </form>
              </div>

              {/* Current Registry List */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ marginBottom: '0.4rem' }}>Current Course Registry</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {courses.length} subjects registered in database
                </p>

                <div className="courses-registry-list">
                  {courses.map(c => (
                    <div key={c.course_code} className="registry-item">
                      <span className="registry-code">{c.course_code}</span>
                      <span className="registry-name">{c.subject_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Full Preview Modal */}
      {selectedPreviewPaper && (
        <div className="modal-overlay" onClick={() => setSelectedPreviewPaper(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Paper Scan Preview — {selectedPreviewPaper.course_code}</h3>
              <button className="btn-icon btn-sm" onClick={() => setSelectedPreviewPaper(null)}><X size={16} /></button>
            </div>
            <div style={{ maxHeight: '60vh', overflow: 'auto', textAlign: 'center', background: '#000', borderRadius: '8px', padding: '1rem' }}>
              <img src={selectedPreviewPaper.file_url} alt="Paper Preview" style={{ maxWidth: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard-container {
          padding: 2rem 1.5rem;
        }
        .admin-dashboard-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .admin-top-bar {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .admin-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .admin-status-pill {
          font-size: 0.78rem;
          color: var(--highlight);
        }
        .admin-tabs-bar {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .admin-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          background: rgba(18, 2, 2, 0.6);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-tab-btn.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--accent);
        }
        .tab-counter {
          background: var(--accent);
          color: #fff;
          padding: 0.1rem 0.5rem;
          border-radius: 999px;
          font-size: 0.75rem;
        }
        .queue-header-info {
          margin-bottom: 1.25rem;
        }
        .queue-header-info p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .empty-queue-card {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }
        .queue-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .queue-item-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .queue-item-thumb {
          position: relative;
          width: 120px;
          height: 90px;
          border-radius: 10px;
          overflow: hidden;
          background: #000;
        }
        .queue-item-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-preview-btn {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .queue-item-thumb:hover .thumb-preview-btn {
          opacity: 1;
        }
        .queue-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .queue-code-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .queue-uploader {
          font-size: 0.78rem;
          color: var(--text-subtle);
        }
        .queue-subject-title {
          font-size: 1.1rem;
        }
        .queue-item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .add-subject-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .courses-registry-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 350px;
          overflow-y: auto;
        }
        .registry-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem;
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .registry-code {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--highlight);
          font-size: 0.82rem;
        }
        .registry-name {
          font-size: 0.88rem;
        }
        @media (max-width: 768px) {
          .add-subject-grid {
            grid-template-columns: 1fr;
          }
          .queue-item-card {
            flex-direction: column;
            align-items: stretch;
          }
          .queue-item-thumb {
            width: 100%;
            height: 140px;
          }
        }
      `}</style>
    </div>
  );
}
