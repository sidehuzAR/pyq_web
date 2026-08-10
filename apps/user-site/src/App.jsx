import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import FloatingBackground from './components/layout/FloatingBackground.jsx';
import ToastStack from './components/shared/ToastStack.jsx';

import HomePage from './pages/HomePage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';
import SubjectPage from './pages/SubjectPage.jsx';
import ViewerPage from './pages/ViewerPage.jsx';
import UploadPage from './pages/UploadPage.jsx';

import { useCourses } from './hooks/useCourses.js';
import { useApprovedPapers } from './hooks/usePapers.js';
import { useToast } from './hooks/useToast.js';
import { createPapersZip } from './lib/zip.js';
import { downloadPaperAsPdf } from './lib/pdf.js';

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePaperModal, setActivePaperModal] = useState(null);

  // Theme state — persisted in localStorage, defaults to dark
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bauhaus-theme');
    return saved || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bauhaus-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const { courses } = useCourses();
  const { approvedPapers } = useApprovedPapers();
  const { toasts, addToast, removeToast } = useToast();

  // Check share hash link #paper=[id]
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#paper=')) {
      const paperId = hash.replace('#paper=', '');
      const matched = approvedPapers.find(p => p.id === paperId);
      if (matched) setActivePaperModal(matched);
    }
  }, [approvedPapers]);

  const handleDownloadPaper = async (paper) => {
    try {
      await downloadPaperAsPdf(paper);
      addToast(`Downloaded ${paper.course_code} paper scan as PDF!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('PDF download failed.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-bauhaus-canvas text-bauhaus-ink font-sans selection:bg-bauhaus-yellow selection:text-bauhaus-canvas transition-colors duration-200">
      <FloatingBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                courses={courses}
                approvedPapers={approvedPapers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onViewPaper={(paper) => setActivePaperModal(paper)}
                onDownloadPaper={handleDownloadPaper}
                onToast={addToast}
              />
            }
          />
          <Route
            path="/catalogue"
            element={
              <CataloguePage
                approvedPapers={approvedPapers}
                onViewPaper={(paper) => setActivePaperModal(paper)}
                onDownloadPaper={handleDownloadPaper}
                onToast={addToast}
              />
            }
          />
          <Route
            path="/catalogue/:course_code"
            element={
              <SubjectPage
                courses={courses}
                approvedPapers={approvedPapers}
                onViewPaper={(paper) => setActivePaperModal(paper)}
                onDownloadPaper={handleDownloadPaper}
                onToast={addToast}
              />
            }
          />
          <Route
            path="/paper/:id"
            element={
              <ViewerPage
                approvedPapers={approvedPapers}
                onDownloadPaper={handleDownloadPaper}
                onToast={addToast}
              />
            }
          />
          <Route
            path="/upload"
            element={
              <UploadPage
                courses={courses}
                onSubmitUpload={(payload) => {
                  // Upload handled by UploadPage internally
                }}
                onToast={addToast}
              />
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Paper Viewer Modal */}
      {activePaperModal && (
        <ViewerPage
          paper={activePaperModal}
          approvedPapers={approvedPapers}
          onCloseModal={() => setActivePaperModal(null)}
          onDownloadPaper={handleDownloadPaper}
          onToast={addToast}
        />
      )}

      <ToastStack toasts={toasts} onClose={removeToast} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
