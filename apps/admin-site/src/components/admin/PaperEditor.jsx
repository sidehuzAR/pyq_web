import React, { useState } from 'react';
import { Edit3, Trash2, CheckCircle, XCircle, Save, X } from 'lucide-react';
import Badge from '../shared/Badge.jsx';
import Button from '../shared/Button.jsx';

export default function PaperEditor({ papers = [], courses = [], onEdit, onDelete, onApprove, onReject, onToast }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  const filtered = filter === 'all' ? papers : papers.filter(p => p.status === filter);

  const startEdit = (paper) => {
    setEditingId(paper.id);
    setEditForm({
      exam_type: paper.exam_type,
      slot_tag: paper.slot_tag,
      semester: paper.semester,
      academic_year: paper.academic_year,
      has_answer_key: paper.has_answer_key,
      status: paper.status,
    });
  };

  const saveEdit = async (paperId) => {
    setSaving(true);
    const { error } = await onEdit(paperId, editForm);
    setSaving(false);
    if (!error) setEditingId(null);
  };

  const statusColor = { approved: 'blue', pending: 'yellow', rejected: 'red' };

  const inputClass = "bg-bauhaus-canvas border border-bauhaus-border text-bauhaus-ink px-2 py-1 font-mono text-xs sharp focus:outline-none focus:ring-1 focus:ring-bauhaus-yellow w-full";
  const selectClass = inputClass + " cursor-pointer";

  return (
    <div className="space-y-3">
      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'approved', 'pending', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 text-xs font-mono font-bold uppercase sharp border transition-colors cursor-pointer ${
              filter === s
                ? 'bg-bauhaus-red text-white border-bauhaus-border'
                : 'bg-bauhaus-surface text-bauhaus-ink border-bauhaus-border hover:bg-bauhaus-elevated'
            }`}>
            {s} {s === 'all' ? `(${papers.length})` : `(${papers.filter(p => p.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-8 text-center">
          <p className="text-bauhaus-muted font-mono text-xs font-bold uppercase">NO PAPERS IN THIS CATEGORY</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(paper => (
            <div key={paper.id} className={`bg-bauhaus-surface border-2 ${editingId === paper.id ? 'border-bauhaus-yellow' : 'border-bauhaus-border'} p-4 sharp transition-colors`}>
              {editingId === paper.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Course</label>
                      <select 
                        value={editForm.course_code} 
                        onChange={e => {
                          const course = courses.find(c => c.course_code === e.target.value);
                          setEditForm(f => ({ ...f, course_code: e.target.value, subject_name: course ? course.subject_name : f.subject_name }));
                        }} 
                        className={selectClass}
                      >
                        {courses.map(c => <option key={c.course_code} value={c.course_code}>[{c.course_code}] {c.subject_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Exam Type</label>
                      <select value={editForm.exam_type} onChange={e => setEditForm(f => ({ ...f, exam_type: e.target.value }))} className={selectClass}>
                        {['CAT1', 'CAT2', 'FAT', 'MODEL'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Slot</label>
                      <input value={editForm.slot_tag} onChange={e => setEditForm(f => ({ ...f, slot_tag: e.target.value.toUpperCase() }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Semester</label>
                      <select value={editForm.semester} onChange={e => setEditForm(f => ({ ...f, semester: e.target.value }))} className={selectClass}>
                        {['Fall Sem', 'Win Sem', 'Others'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Academic Year</label>
                      <select value={editForm.academic_year} onChange={e => setEditForm(f => ({ ...f, academic_year: e.target.value }))} className={selectClass}>
                        {['2026-27', '2025-26', '2024-25'].map(yr => <option key={yr} value={yr}>{yr}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Status</label>
                      <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className={selectClass}>
                        {['approved', 'pending', 'rejected'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex items-end gap-2 col-span-2">
                      <input type="checkbox" id={`ak_${paper.id}`} checked={editForm.has_answer_key} onChange={e => setEditForm(f => ({ ...f, has_answer_key: e.target.checked }))} className="w-4 h-4 accent-bauhaus-red" />
                      <label htmlFor={`ak_${paper.id}`} className="text-[10px] font-mono font-bold text-bauhaus-ink uppercase cursor-pointer">Has Solutions</label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => saveEdit(paper.id)} disabled={saving}>
                      <Save size={13} /> {saving ? 'SAVING...' : 'SAVE'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      <X size={13} /> CANCEL
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp flex-shrink-0">
                      {paper.course_code}
                    </span>
                    <span className="text-sm font-bold text-bauhaus-ink truncate max-w-[200px]">{paper.subject_name}</span>
                    <Badge variant={statusColor[paper.status] || 'outline'}>{paper.status.toUpperCase()}</Badge>
                    <Badge variant="outline">{paper.exam_type}</Badge>
                    <Badge variant="outline">SLOT {paper.slot_tag}</Badge>
                    <span className="text-xs font-mono text-bauhaus-muted">{paper.academic_year}</span>
                    
                    {/* Link to view/download file */}
                    {paper.file_url && (
                      <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-[10px] font-mono font-bold uppercase text-bauhaus-blue hover:underline">
                        [ VIEW FILE ]
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {paper.status === 'pending' && (
                      <>
                        <button onClick={() => onApprove(paper.id)} title="Approve" className="p-1.5 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white sharp border border-bauhaus-border cursor-pointer transition-colors">
                          <CheckCircle size={14} />
                        </button>
                        <button onClick={() => onReject(paper.id)} title="Reject" className="p-1.5 text-bauhaus-red hover:bg-bauhaus-red hover:text-white sharp border border-bauhaus-border cursor-pointer transition-colors">
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    <button onClick={() => startEdit(paper)} title="Edit" className="p-1.5 text-bauhaus-yellow hover:bg-bauhaus-yellow hover:text-bauhaus-canvas sharp border border-bauhaus-border cursor-pointer transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => onDelete(paper.id)} title="Delete" className="p-1.5 text-bauhaus-red hover:bg-bauhaus-red hover:text-white sharp border border-bauhaus-border cursor-pointer transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
