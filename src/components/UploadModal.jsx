import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { AVAILABLE_SLOTS, ACADEMIC_YEARS, SEMESTERS, EXAM_TYPES } from '../data/initialData.js';
import { checkRateLimit, addPendingUpload } from '../utils/storage.js';

export default function UploadModal({ courses, onClose, onToast, onUploadSubmitted }) {
  const [courseCode, setCourseCode] = useState(courses[0]?.course_code || '');
  const [subjectName, setSubjectName] = useState(courses[0]?.subject_name || '');
  const [examType, setExamType] = useState('CAT-1');
  const [slotTag, setSlotTag] = useState('A1');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [semester, setSemester] = useState('Fall Sem');
  const [hasAnswerKey, setHasAnswerKey] = useState(false);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Auto-link Course Code <-> Subject Name
  const handleCourseCodeChange = (code) => {
    setCourseCode(code);
    const matched = courses.find(c => c.course_code.toLowerCase() === code.toLowerCase());
    if (matched) {
      setSubjectName(matched.subject_name);
    }
  };

  const handleSubjectNameChange = (name) => {
    setSubjectName(name);
    const matched = courses.find(c => c.subject_name.toLowerCase() === name.toLowerCase());
    if (matched) {
      setCourseCode(matched.course_code);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.size > 10 * 1024 * 1024) {
        onToast('File exceeds maximum size limit of 10 MB.');
        return;
      }
      setFile(dropped);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        onToast('File exceeds maximum size limit of 10 MB.');
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Anti-Bombing Rate Limit Check
    const limitResult = checkRateLimit();
    if (!limitResult.allowed) {
      onToast(limitResult.error);
      return;
    }

    if (!courseCode || !subjectName) {
      onToast('Please provide Course Code and Subject Name.');
      return;
    }

    // Generate sample preview URL if real file uploaded
    let previewUrl = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80';
    if (file) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch {
        // Fallback
      }
    }

    const uploadPayload = {
      course_code: courseCode.trim().toUpperCase(),
      subject_name: subjectName.trim(),
      exam_type: examType,
      slot_tag: slotTag,
      academic_year: academicYear,
      semester: semester,
      has_answer_key: hasAnswerKey,
      file_url: previewUrl,
      uploaded_by: 'Student (IP Verified)'
    };

    const newPending = addPendingUpload(uploadPayload);
    onUploadSubmitted(newPending);
    onToast('Paper submitted successfully! Pending admin verification.');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card upload-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="upload-modal-header">
          <div>
            <h2>Upload Exam Paper</h2>
            <p className="upload-subtitle">Contribute to the student community repository</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Linked Course Code & Name */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Course Code (Linked)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BPHY101L"
                value={courseCode}
                onChange={e => handleCourseCodeChange(e.target.value)}
                required
              />
            </div>
            <div className="form-group flex-2">
              <label className="form-label">Subject Name (Linked)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Engineering Physics"
                value={subjectName}
                onChange={e => handleSubjectNameChange(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Exam Type & Slot Tag */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Exam Category</label>
              <select
                className="form-select"
                value={examType}
                onChange={e => setExamType(e.target.value)}
              >
                {EXAM_TYPES.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Timetable Slot Tag</label>
              <select
                className="form-select"
                value={slotTag}
                onChange={e => setSlotTag(e.target.value)}
              >
                <optgroup label="Theory Slots">
                  {AVAILABLE_SLOTS.theory.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </optgroup>
                <optgroup label="Tutorial Slots">
                  {AVAILABLE_SLOTS.tutorial.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </optgroup>
                <optgroup label="Lab Slots">
                  {AVAILABLE_SLOTS.lab.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Academic Year & Semester */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Academic Year</label>
              <select
                className="form-select"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
              >
                {ACADEMIC_YEARS.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Semester</label>
              <select
                className="form-select"
                value={semester}
                onChange={e => setSemester(e.target.value)}
              >
                {SEMESTERS.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Answer Key Checkbox */}
          <div className="form-group" style={{ marginBottom: '0.8rem' }}>
            <label className="toggle-checkbox-label">
              <input
                type="checkbox"
                checked={hasAnswerKey}
                onChange={e => setHasAnswerKey(e.target.checked)}
              />
              <span className="toggle-custom-box"></span>
              <span>Includes Verified Answer Key / Solutions</span>
            </label>
          </div>

          {/* File Drag & Drop Zone */}
          <div
            className={`file-dropzone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              id="file-upload-input"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {file ? (
              <div className="dropzone-file-info">
                <CheckCircle2 size={32} style={{ color: '#4ade80' }} />
                <div>
                  <strong>{file.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-icon btn-sm"
                  onClick={() => setFile(null)}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload-input" className="dropzone-label">
                <UploadCloud size={36} className="dropzone-icon" />
                <div>
                  <strong>Click to upload</strong> or drag and drop paper scan
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  PDF, JPG, PNG, WEBP (Max 10 MB)
                </div>
              </label>
            )}
          </div>

          {/* Rate Limit Note */}
          <div className="rate-limit-note">
            <AlertCircle size={14} />
            <span>Anti-Spam Protection: Maximum 5 uploads per hour per user.</span>
          </div>

          {/* Submit Actions */}
          <div className="upload-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-amber">
              Submit for Verification
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .upload-modal-container {
          padding: 1.75rem;
        }
        .upload-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .upload-subtitle {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }
        .file-dropzone {
          border: 2px dashed var(--border);
          border-radius: 14px;
          padding: 1.5rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          margin-bottom: 0.8rem;
        }
        .file-dropzone.drag-over {
          border-color: var(--highlight);
          background: rgba(208, 125, 34, 0.1);
        }
        .file-dropzone.has-file {
          border-color: var(--success);
          background: rgba(46, 125, 50, 0.1);
        }
        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }
        .dropzone-icon {
          color: var(--highlight);
        }
        .dropzone-file-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
        }
        .rate-limit-note {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-subtle);
          margin-bottom: 1.25rem;
        }
        .upload-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}
