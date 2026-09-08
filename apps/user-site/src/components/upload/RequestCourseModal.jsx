import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import Button from '../shared/Button.jsx';
import { useCourseRequests } from '../../hooks/useCourseRequests.js';

export default function RequestCourseModal({ initialCode = '', initialName = '', onClose, onToast }) {
  const [courseCode, setCourseCode] = useState(initialCode);
  const [subjectName, setSubjectName] = useState(initialName);
  const { requestCourse, submitting } = useCourseRequests();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseCode.trim() || !subjectName.trim()) {
      onToast('Please enter both course code and subject name.', 'warning');
      return;
    }

    const { error } = await requestCourse({
      course_code: courseCode,
      subject_name: subjectName,
    });

    if (error) {
      onToast('Failed to submit course request: ' + error.message, 'error');
    } else {
      onToast(`Course addition request for ${courseCode.trim().toUpperCase()} submitted for admin approval!`, 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-bauhaus-surface border-4 border-bauhaus-border p-6 shadow-bauhaus-lg sharp w-full max-w-lg space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-bauhaus-border pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="text-bauhaus-yellow" size={20} />
            <h3 className="text-lg font-black uppercase tracking-wider text-bauhaus-ink">
              REQUEST NEW COURSE ADDITION
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-bauhaus-muted hover:text-bauhaus-ink p-1 sharp transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs font-mono font-bold text-bauhaus-muted uppercase">
          Can't find your subject in the registry? Submit the course details below. Once approved by an admin, it will be added to the official catalog.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
              COURSE CODE *
            </label>
            <input
              type="text"
              required
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              placeholder="e.g. BCSE305L"
              className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold uppercase text-bauhaus-ink placeholder-[#8B949E] sharp focus:ring-2 focus:ring-bauhaus-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
              FULL SUBJECT NAME *
            </label>
            <input
              type="text"
              required
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Compiler Design"
              className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold text-bauhaus-ink placeholder-[#8B949E] sharp focus:ring-2 focus:ring-bauhaus-yellow"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST →'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
