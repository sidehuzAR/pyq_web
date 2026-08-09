import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ToastStack from './components/shared/ToastStack.jsx';
import { useToast } from './hooks/useToast.js';
import { useCourses } from './hooks/useCourses.js';
import { useAllPapers } from './hooks/usePapers.js';
import AdminPage from './pages/AdminPage.jsx';
import AdminGate from './components/admin/AdminGate.jsx';
import { supabase } from './lib/supabase.js';
import { Sun, Moon, ShieldOff } from 'lucide-react';

function AdminApp() {
  const { toasts, addToast, removeToast } = useToast();
  const { courses, addCourse, updateCourse, deleteCourse, refreshCourses } = useCourses();
  const { allPapers, pendingPapers, approvedPapers, rejectedPapers, loading, refreshAll } = useAllPapers();

  const [adminUser, setAdminUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Restore session on page refresh
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminUser(session?.user ?? null);
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    addToast('Signed out.', 'success');
  };

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('bauhaus-theme') || 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('bauhaus-theme', theme);
  }, [theme]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-bauhaus-canvas flex items-center justify-center">
        <span className="font-mono text-xs font-bold text-bauhaus-muted uppercase tracking-widest animate-pulse">
          CHECKING SESSION...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bauhaus-canvas text-bauhaus-ink font-sans transition-colors duration-200">
      {/* Admin Header */}
      <header className="bg-bauhaus-surface border-b-2 border-bauhaus-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-2 border-bauhaus-border bg-bauhaus-elevated p-1 shadow-bauhaus">
            <div className="w-3 h-3 bg-bauhaus-red"></div>
            <div className="w-3 h-3 rounded-full bg-bauhaus-blue border border-bauhaus-border"></div>
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-tighter text-bauhaus-ink uppercase">PYARCHIVE</span>
            <span className="font-mono text-[9px] font-bold text-bauhaus-red tracking-widest ml-2 uppercase">Admin Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {adminUser && (
            <>
              <span className="text-[11px] font-mono font-bold text-bauhaus-muted hidden sm:block truncate max-w-[180px]">
                {adminUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-bauhaus-muted hover:text-bauhaus-red border border-bauhaus-border px-2 py-1 sharp cursor-pointer hover:bg-bauhaus-elevated transition-colors"
              >
                <ShieldOff size={12} /> SIGN OUT
              </button>
            </>
          )}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="text-bauhaus-ink hover:bg-bauhaus-yellow hover:text-bauhaus-canvas border-2 border-transparent hover:border-bauhaus-border p-1.5 sharp cursor-pointer transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main>
        {!adminUser ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <AdminGate onAuthenticated={(user) => {
              setAdminUser(user);
              addToast('Welcome back, Admin.', 'success');
            }} />
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <AdminPage
                  pendingPapers={pendingPapers}
                  approvedPapers={approvedPapers}
                  rejectedPapers={rejectedPapers}
                  allPapers={allPapers}
                  courses={courses}
                  loading={loading}
                  onRefresh={refreshAll}
                  onAddCourse={addCourse}
                  onUpdateCourse={updateCourse}
                  onDeleteCourse={deleteCourse}
                  onToast={addToast}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      <ToastStack toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminApp />
    </BrowserRouter>
  );
}
