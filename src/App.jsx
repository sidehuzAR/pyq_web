import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import HomeHero from './components/HomeHero.jsx';
import Catalogue from './components/Catalogue.jsx';
import PaperViewerModal from './components/PaperViewerModal.jsx';
import UploadModal from './components/UploadModal.jsx';
import AdminPortal from './components/AdminPortal.jsx';
import {
  getStoredCourses,
  saveCourse,
  getApprovedPapers,
  getPendingPapers,
  approvePendingPaper,
  rejectPendingPaper,
  getPinnedSubjects,
  togglePinSubject
} from './utils/storage.js';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeView, setActiveView] = useState('public'); // 'public' | 'admin'

  // Application Data States
  const [courses, setCourses] = useState([]);
  const [approvedPapers, setApprovedPapers] = useState([]);
  const [pendingPapers, setPendingPapers] = useState([]);
  const [pinnedSubjects, setPinnedSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Viewer
  const [activePaperModal, setActivePaperModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Notification Toasts
  const [toasts, setToasts] = useState([]);

  // Load Data on Mount
  useEffect(() => {
    setCourses(getStoredCourses());
    setApprovedPapers(getApprovedPapers());
    setPendingPapers(getPendingPapers());
    setPinnedSubjects(getPinnedSubjects());

    // Simple route check for /admin or #admin
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setActiveView('admin');
    }
  }, []);

  // Update DOM data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast Handler
  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Pin Toggle Handler
  const handleTogglePin = (code) => {
    const updated = togglePinSubject(code);
    setPinnedSubjects(updated);
  };

  // Admin Actions
  const handleApprovePaper = (id) => {
    const { pending, approved } = approvePendingPaper(id);
    setPendingPapers(pending);
    setApprovedPapers(approved);
  };

  const handleRejectPaper = (id) => {
    const updatedPending = rejectPendingPaper(id);
    setPendingPapers(updatedPending);
  };

  const handleAddCourse = (newCourseData) => {
    const updatedCourses = saveCourse(newCourseData);
    setCourses(updatedCourses);
    return updatedCourses;
  };

  return (
    <div className="app-wrapper">
      {/* Space Dust & Ambient Background Canvas */}
      <div className="cyber-canvas-bg"></div>

      {/* Cyber Right-Side Circuit Rail Graphics */}
      <div className="cyber-circuit-rail">
        <div className="circuit-node active"></div>
        <span className="rail-label">PAPERSVITC ARCHIVE</span>
        <div className="circuit-node"></div>
      </div>

      {/* Header Bar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        setTheme={setTheme}
        onOpenUpload={() => setShowUploadModal(true)}
        onNavigateAdmin={() => setActiveView('admin')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* View Switcher */}
      {activeView === 'admin' ? (
        <AdminPortal
          pendingPapers={pendingPapers}
          courses={courses}
          onApprovePaper={handleApprovePaper}
          onRejectPaper={handleRejectPaper}
          onAddCourse={handleAddCourse}
          onToast={showToast}
          onBackToMain={() => setActiveView('public')}
        />
      ) : (
        <>
          {/* Main Public Website */}
          <HomeHero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            courses={courses}
            pinnedSubjects={pinnedSubjects}
            onTogglePin={handleTogglePin}
            onSelectSubject={(code) => setSearchQuery(code)}
          />

          <Catalogue
            papers={approvedPapers}
            courses={courses}
            searchQuery={searchQuery}
            pinnedSubjects={pinnedSubjects}
            onTogglePin={handleTogglePin}
            onViewPaper={(paper) => setActivePaperModal(paper)}
            onToast={showToast}
          />
        </>
      )}

      {/* Footer */}
      <footer className="hackclub-footer">
        <div className="footer-inner">
          <div>
            <span style={{ color: 'var(--crimson-main)', fontWeight: 800 }}>♦ PAPERSVITC</span>
            <span> — Built by Students for Students.</span>
          </div>

          <div className="footer-right">
            <button
              className="admin-gateway-btn"
              onClick={() => setActiveView(activeView === 'admin' ? 'public' : 'admin')}
            >
              {activeView === 'admin' ? '← Public Website' : 'Admin Gateway'}
            </button>
          </div>
        </div>
      </footer>

      {/* Paper Reader Modal */}
      {activePaperModal && (
        <PaperViewerModal
          paper={activePaperModal}
          onClose={() => setActivePaperModal(null)}
          onToast={showToast}
        />
      )}

      {/* Upload Paper Modal */}
      {showUploadModal && (
        <UploadModal
          courses={courses}
          onClose={() => setShowUploadModal(false)}
          onToast={showToast}
          onUploadSubmitted={(newPending) => {
            setPendingPapers(prev => [newPending, ...prev]);
          }}
        />
      )}

      {/* Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span style={{ color: 'var(--crimson-main)' }}>♦</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <style>{`
        .hackclub-footer {
          margin-top: auto;
          background: rgba(0, 0, 0, 0.95);
          border-top: 1px solid var(--border-dark);
          padding: 1.5rem;
        }
        .footer-inner {
          max-width: 1350px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .admin-gateway-btn {
          background: none;
          border: none;
          color: var(--text-subtle);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .admin-gateway-btn:hover {
          color: var(--crimson-main);
        }
      `}</style>
    </div>
  );
}
