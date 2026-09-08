import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, Trash2, PlusCircle, Check, Eye, X, BookOpen, Terminal } from 'lucide-react';

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
      onToast('Authenticated! Welcome to Admin Moderation Console.');
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

    onAddCourse({
      course_code: newCode.trim().toUpperCase(),
      subject_name: newName.trim()
    });

    onToast(`Added subject ${newCode.trim().toUpperCase()} - ${newName.trim()} to registry!`);
    setNewCode('');
    setNewName('');
  };

  if (!isAuthenticated) {
    return (
      <div className="hackclub-admin-login">
        <div className="login-box cyber-card">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <span>◇</span> ADMIN CONTROL GATEWAY
          </div>
          <h2 className="login-title">Mission Control Authentication</h2>
          <p className="login-subtitle">Enter authorization password to access moderation queue and subject registry</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Master Password</label>
              <div className="password-wrapper">
                <Lock size={16} className="lock-icon" />
                <input
                  type="password"
                  className="cyber-input"
                  placeholder="Enter password (default: admin123)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-cyber-red" style={{ width: '100%', marginTop: '0.5rem' }}>
              Authenticate Session →
            </button>
          </form>

          <button className="back-btn" onClick={onBackToMain}>
            ← Return to Public Website
          </button>
        </div>

        <style>{`
          .hackclub-admin-login {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }
          .login-box {
            width: 100%;
            max-width: 440px;
            padding: 2.5rem 2rem;
            text-align: center;
          }
          .login-title {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 0.4rem;
          }
          .login-subtitle {
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-bottom: 1.5rem;
          }
          .password-wrapper {
            position: relative;
          }
          .lock-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--crimson-main);
          }
          .password-wrapper input {
            padding-left: 2.5rem;
          }
          .back-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-family: var(--font-mono);
            font-size: 0.8rem;
            margin-top: 1.5rem;
            cursor: pointer;
          }
          .back-btn:hover {
            color: var(--crimson-bright);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-console-wrapper">
      <div className="admin-console-inner">
        {/* Header Bar */}
        <div className="console-header cyber-card">
          <div className="console-title-group">
            <ShieldCheck size={24} style={{ color: 'var(--crimson-main)' }} />
            <div>
              <h2>Admin Moderation Console</h2>
              <span className="console-status">AUTHENTICATED ADMIN SESSION</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-cyber-outline btn-sm" onClick={onBackToMain}>
              Public Portal
            </button>
            <button className="btn btn-cyber-outline btn-sm" onClick={() => setIsAuthenticated(false)}>
              Logout
            </button>
          </div>
        </div>

        {/* 2-Feature Tabs Bar */}
        <div className="console-tabs">
          <button
            className={`console-tab-btn ${activeTab === 'accept-queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('accept-queue')}
          >
            <CheckCircle size={16} />
            <span>Feature 1: Accept Uploaded Papers</span>
            {pendingPapers.length > 0 && (
              <span className="queue-pill">{pendingPapers.length}</span>
            )}
          </button>

          <button
            className={`console-tab-btn ${activeTab === 'add-subject' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-subject')}
          >
            <PlusCircle size={16} />
            <span>Feature 2: Add New Subject</span>
          </button>
        </div>

        {/* Tab 1: Accept Uploaded Papers Queue */}
        {activeTab === 'accept-queue' && (
          <div className="console-tab-body">
            <div className="section-label" style={{ marginBottom: '0.4rem' }}>
              <span>◇</span> MODERATION QUEUE
            </div>
            <p className="tab-desc">Review pending student submissions and click Accept to push live immediately.</p>

            {pendingPapers.length === 0 ? (
              <div className="empty-card cyber-card">
                <CheckCircle size={36} style={{ color: '#4ade80', marginBottom: '0.5rem' }} />
                <h3>No Pending Submissions</h3>
                <p>All student paper uploads have been verified and pushed live.</p>
              </div>
            ) : (
              <div className="queue-stack">
                {pendingPapers.map(paper => (
                  <div key={paper.id} className="queue-card cyber-card">
                    {/* Thumbnail View */}
                    <div className="queue-thumb-box">
                      <img src={paper.file_url} alt={paper.subject_name} />
                      <button
                        className="preview-overlay-btn"
                        onClick={() => setSelectedPreviewPaper(paper)}
                      >
                        <Eye size={14} /> Inspect
                      </button>
                    </div>

                    {/* Details */}
                    <div className="queue-info">
                      <div className="code-row">
                        <span className="course-code-tag">{paper.course_code}</span>
                        <span className="uploader-info">{paper.uploaded_by || 'Student'}</span>
                      </div>
                      <h3 className="queue-title">{paper.subject_name}</h3>

                      <div className="tag-badges-row">
                        <span className="cyber-pill pill-exam">{paper.exam_type}</span>
                        <span className="cyber-pill pill-slot">Slot {paper.slot_tag}</span>
                        <span className="cyber-pill pill-year">{paper.academic_year}</span>
                        <span className="cyber-pill pill-sem">{paper.semester}</span>
                        {paper.has_answer_key && (
                          <span className="key-badge">✓ Key Included</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="queue-actions">
                      <button
                        className="btn btn-cyber-amber"
                        onClick={() => {
                          onApprovePaper(paper.id);
                          onToast(`Accepted & Pushed ${paper.course_code} ${paper.exam_type} live!`);
                        }}
                      >
                        <Check size={16} />
                        <span>Accept & Push Live</span>
                      </button>

                      <button
                        className="btn btn-cyber-outline"
                        onClick={() => {
                          onRejectPaper(paper.id);
                          onToast(`Rejected pending upload for ${paper.course_code}`);
                        }}
                        style={{ color: '#ff6b6b' }}
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
          <div className="console-tab-body">
            <div className="add-subject-grid">
              {/* Form */}
              <div className="cyber-card" style={{ padding: '1.75rem' }}>
                <div className="section-label" style={{ marginBottom: '0.4rem' }}>
                  <span>◇</span> SUBJECT REGISTRY REGISTRATION
                </div>
                <h3 style={{ marginBottom: '0.4rem' }}>Add New Course Subject</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Added subjects will immediately become selectable in the student upload modal and searchable on the main site.
                </p>

                <form onSubmit={handleAddSubjectSubmit}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Course Code</label>
                    <input
                      type="text"
                      className="cyber-input"
                      placeholder="e.g. BCSE301L"
                      value={newCode}
                      onChange={e => setNewCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Subject Name</label>
                    <input
                      type="text"
                      className="cyber-input"
                      placeholder="e.g. Software Engineering"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-cyber-amber" style={{ width: '100%' }}>
                    <PlusCircle size={16} />
                    <span>Add Subject to Registry</span>
                  </button>
                </form>
              </div>

              {/* Registry List */}
              <div className="cyber-card" style={{ padding: '1.75rem' }}>
                <div className="section-label" style={{ marginBottom: '0.4rem' }}>
                  <span>◇</span> ACTIVE REGISTRY
                </div>
                <h3 style={{ marginBottom: '0.4rem' }}>Registered Subjects ({courses.length})</h3>

                <div className="registry-list">
                  {courses.map(c => (
                    <div key={c.course_code} className="registry-row">
                      <span className="reg-code">{c.course_code}</span>
                      <span className="reg-name">{c.subject_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Preview Inspector */}
      {selectedPreviewPaper && (
        <div className="modal-overlay" onClick={() => setSelectedPreviewPaper(null)}>
          <div className="modal-content cyber-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Inspect Paper Scan — {selectedPreviewPaper.course_code}</h3>
              <button className="btn-icon" onClick={() => setSelectedPreviewPaper(null)}><X size={16} /></button>
            </div>
            <div style={{ maxHeight: '60vh', overflow: 'auto', textAlign: 'center', background: '#000', borderRadius: '8px', padding: '1rem' }}>
              <img src={selectedPreviewPaper.file_url} alt="Scan Preview" style={{ maxWidth: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-console-wrapper {
          padding: 2rem 1.5rem;
        }
        .admin-console-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .console-header {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .console-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .console-status {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--amber-accent);
        }
        .console-tabs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .console-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          background: rgba(14, 2, 2, 0.7);
          border: 1px solid var(--border-dark);
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .console-tab-btn.active {
          background: var(--crimson-main);
          color: #ffffff;
          border-color: var(--crimson-bright);
        }
        .queue-pill {
          background: var(--amber-accent);
          color: #000;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
        }
        .tab-desc {
          color: var(--text-muted);
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }
        .empty-card {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }
        .queue-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .queue-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .queue-thumb-box {
          position: relative;
          width: 120px;
          height: 90px;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
        }
        .queue-thumb-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-overlay-btn {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
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
        .queue-thumb-box:hover .preview-overlay-btn {
          opacity: 1;
        }
        .queue-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .code-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .uploader-info {
          font-size: 0.75rem;
          color: var(--text-subtle);
          font-family: var(--font-mono);
        }
        .queue-title {
          font-size: 1.05rem;
        }
        .queue-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .add-subject-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .registry-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 350px;
          overflow-y: auto;
          margin-top: 1rem;
        }
        .registry-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 6px;
          border: 1px solid var(--border-dark);
        }
        .reg-code {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--amber-accent);
        }
        .reg-name {
          font-size: 0.88rem;
        }
        @media (max-width: 768px) {
          .add-subject-grid {
            grid-template-columns: 1fr;
          }
          .queue-card {
            flex-direction: column;
            align-items: stretch;
          }
          .queue-thumb-box {
            width: 100%;
            height: 140px;
          }
        }
      `}</style>
    </div>
  );
}
