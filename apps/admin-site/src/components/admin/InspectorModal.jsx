import React, { useState } from 'react';
import { X, Check, Trash2, Edit3, Save } from 'lucide-react';
import Badge from '../shared/Badge.jsx';
import Button from '../shared/Button.jsx';

export default function InspectorModal({ paper, courses = [], onClose, onApprove, onReject, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    course_code: paper.course_code || '',
    subject_name: paper.subject_name || '',
    exam_type: paper.exam_type || '',
    slot_tag: paper.slot_tag || '',
    academic_year: paper.academic_year || '',
    semester: paper.semester || '',
    has_answer_key: paper.has_answer_key || false,
  });

  const handleSaveEdit = async () => {
    await onEdit(paper.id, editForm);
    setIsEditing(false);
  };

  const handleCourseChange = (e) => {
    const code = e.target.value;
    const c = courses.find(c => c.course_code === code);
    if (c) {
      setEditForm({ ...editForm, course_code: code, subject_name: c.subject_name });
    } else {
      setEditForm({ ...editForm, course_code: code });
    }
  };

  if (!paper) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bauhaus-canvas/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-bauhaus-surface border-4 border-bauhaus-border shadow-bauhaus-lg max-w-5xl w-full max-h-[90vh] flex flex-col sharp">
        {/* Header */}
        <div className="bg-bauhaus-elevated text-bauhaus-ink p-4 border-b-2 border-bauhaus-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-yellow px-2 py-0.5 sharp">
              INSPECT SCAN
            </span>
            <span className="font-mono text-sm font-bold text-bauhaus-ink">{paper.course_code} - {paper.subject_name}</span>
          </div>
          <button onClick={onClose} className="font-mono text-lg font-bold text-bauhaus-muted hover:text-bauhaus-red cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Side-by-side Grid */}
        <div className="flex-1 overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scan Image Container */}
          <div className="bg-bauhaus-canvas border-2 border-bauhaus-border p-2 flex items-center justify-center min-h-[300px]">
            <img
              src={paper.file_url}
              alt="Scan Preview"
              className="max-w-full max-h-[70vh] object-contain block border border-bauhaus-border"
            />
          </div>

          {/* Submitted Metadata */}
          <div className="bg-bauhaus-canvas border-2 border-bauhaus-border p-4 flex flex-col justify-between overflow-auto">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-bauhaus-blue">
                  SUBMITTED METADATA
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-bauhaus-muted hover:text-bauhaus-ink transition-colors"
                >
                  <Edit3 size={12} /> {isEditing ? 'CANCEL EDIT' : 'EDIT'}
                </button>
              </div>

              {!isEditing ? (
                <>
                  <h3 className="text-xl font-black text-bauhaus-ink uppercase mb-4">
                    {paper.subject_name}
                  </h3>

                  <div className="space-y-2 text-xs font-bold text-bauhaus-ink mb-4">
                    <div className="flex justify-between py-1 border-b border-bauhaus-border">
                      <span className="font-mono text-bauhaus-muted">COURSE CODE:</span>
                      <span className="font-mono font-black text-bauhaus-blue">{paper.course_code}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-bauhaus-border">
                      <span className="font-mono text-bauhaus-muted">EXAM CATEGORY:</span>
                      <span>{paper.exam_type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-bauhaus-border">
                      <span className="font-mono text-bauhaus-muted">SLOT TAG:</span>
                      <span className="font-mono font-black">{paper.slot_tag}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-bauhaus-border">
                      <span className="font-mono text-bauhaus-muted">ACADEMIC YEAR:</span>
                      <span className="font-mono font-black text-bauhaus-yellow">{paper.academic_year}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-bauhaus-border">
                      <span className="font-mono text-bauhaus-muted">SEMESTER:</span>
                      <span>{paper.semester}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-bauhaus-border">
                      <span className="font-mono text-bauhaus-muted">SOLUTIONS INCLUDED:</span>
                      <span className={paper.has_answer_key ? 'text-bauhaus-blue' : 'text-bauhaus-muted'}>
                        {paper.has_answer_key ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-bauhaus-border">
                      <span className="font-mono text-bauhaus-muted">UPLOADER IP:</span>
                      <span className="font-mono text-[11px] text-bauhaus-muted">{paper.uploaded_by || 'Student'}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-bauhaus-muted mb-1">Course Code</label>
                    <select
                      value={editForm.course_code}
                      onChange={handleCourseChange}
                      className="w-full bg-bauhaus-surface border-2 border-bauhaus-border p-1.5 text-xs font-mono font-bold uppercase"
                    >
                      <option value="OTHERS">OTHERS</option>
                      {courses.map(c => <option key={c.course_code} value={c.course_code}>{c.course_code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-bauhaus-muted mb-1">Subject Name</label>
                    <input
                      type="text"
                      value={editForm.subject_name}
                      onChange={e => setEditForm({...editForm, subject_name: e.target.value})}
                      className="w-full bg-bauhaus-surface border-2 border-bauhaus-border p-1.5 text-xs font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-bauhaus-muted mb-1">Exam Type</label>
                      <select
                        value={editForm.exam_type}
                        onChange={e => setEditForm({...editForm, exam_type: e.target.value})}
                        className="w-full bg-bauhaus-surface border-2 border-bauhaus-border p-1.5 text-xs font-bold"
                      >
                        {['CAT-1', 'CAT-2', 'FAT', 'MODEL'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-bauhaus-muted mb-1">Slot Tag</label>
                      <input
                        type="text"
                        value={editForm.slot_tag}
                        onChange={e => setEditForm({...editForm, slot_tag: e.target.value.toUpperCase()})}
                        className="w-full bg-bauhaus-surface border-2 border-bauhaus-border p-1.5 text-xs font-mono font-bold uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-bauhaus-muted mb-1">Semester</label>
                      <select
                        value={editForm.semester}
                        onChange={e => setEditForm({...editForm, semester: e.target.value})}
                        className="w-full bg-bauhaus-surface border-2 border-bauhaus-border p-1.5 text-xs font-bold"
                      >
                        {['Fall Sem', 'Winter Sem', 'Summer Sem'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-bauhaus-muted mb-1">Academic Year</label>
                      <select
                        value={editForm.academic_year}
                        onChange={e => setEditForm({...editForm, academic_year: e.target.value})}
                        className="w-full bg-bauhaus-surface border-2 border-bauhaus-border p-1.5 text-xs font-bold"
                      >
                        {['2024-25', '2025-26', '2026-27'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={editForm.has_answer_key}
                      onChange={e => setEditForm({...editForm, has_answer_key: e.target.checked})}
                      className="w-4 h-4 accent-bauhaus-red"
                    />
                    <label className="text-xs font-mono font-bold uppercase">Has Answer Key</label>
                  </div>
                  <Button variant="primary" size="sm" onClick={handleSaveEdit} className="w-full mt-2">
                    <Save size={14} /> SAVE METADATA
                  </Button>
                </div>
              )}
            </div>

            {/* Moderation Actions */}
            {!isEditing && (
              <div className="flex gap-2 pt-4 border-t-2 border-bauhaus-border mt-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => { onApprove(paper.id); onClose(); }}
                >
                  <Check size={16} />
                  <span>ACCEPT & PUSH LIVE</span>
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => { onReject(paper.id); onClose(); }}
                  className="text-bauhaus-red border-bauhaus-red"
                >
                  <Trash2 size={16} />
                  <span>REJECT</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
