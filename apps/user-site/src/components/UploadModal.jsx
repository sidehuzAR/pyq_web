import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
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

    // Rate Limit Check
    const limitResult = checkRateLimit();
    if (!limitResult.allowed) {
      onToast(limitResult.error);
      return;
    }

    if (!courseCode || !subjectName) {
      onToast('Please provide Course Code and Subject Name.');
      return;
    }

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
    onToast('Paper submitted for verification!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cyber-card upload-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="upload-header">
          <div>
            <div className="section-label"><span>◇</span> CONTRIBUTE ARCHIVE</div>
            <h2>Upload Question Paper</h2>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Linked Course Code & Name */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Course Code (Linked)</label>
              <input
                type="text"
                className="cyber-input"
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
                className="cyber-input"
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
                className="cyber-input"
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
                className="cyber-input"
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
                className="cyber-input"
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
                className="cyber-input"
                value={semester}
                onChange={e => setSemester(e.target.value)}
              >
                {SEMESTERS.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Answer Key Toggle */}
          <div className="form-group" style={{ marginBottom: '0.8rem' }}>
            <label className="cyber-toggle-label">
              <input
                type="checkbox"
                checked={hasAnswerKey}
                onChange={e => setHasAnswerKey(e.target.checked)}
              />
              <span className="cyber-toggle-box"></span>
              <span>Includes Verified Answer Key / Solution</span>
            </label>
          </div>

          {/* Dropzone */}
          <div
            className={`cyber-dropzone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
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
              <div className="file-info">
                <CheckCircle2 size={28} style={{ color: '#4ade80' }} />
                <div>
                  <strong>{file.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
              <label htmlFor="file-upload-input" className="dropzone-inner">
                <UploadCloud size={32} style={{ color: 'var(--crimson-main)' }} />
                <div>
                  <strong>Click to choose scan</strong> or drag and drop file
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  PDF, JPG, PNG, WEBP (Max 10 MB)
                </div>
              </label>
            )}
          </div>

          {/* Rate Limit Info */}
          <div className="rate-info">
            <AlertCircle size={13} />
            <span>Anti-Spam Protection: Max 5 uploads per hour per user.</span>
          </div>

          {/* Actions */}
          <div className="upload-footer">
            <button type="button" className="btn btn-cyber-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-cyber-amber">
              Submit for Verification
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .upload-container {
          width: 100%;
          max-width: 600px;
          padding: 1.75rem;
        }
        .upload-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }
        .form-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.2rem;
          display: block;
        }
        .cyber-dropzone {
          border: 2px dashed var(--border-dark);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.4);
          margin-bottom: 0.8rem;
        }
        .cyber-dropzone.drag-over {
          border-color: var(--crimson-main);
          background: rgba(211, 7, 14, 0.1);
        }
        .cyber-dropzone.has-file {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
        }
        .dropzone-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }
        .file-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .rate-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-subtle);
          margin-bottom: 1rem;
        }
        .upload-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}
