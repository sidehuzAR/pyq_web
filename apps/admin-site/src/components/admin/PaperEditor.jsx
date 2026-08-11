import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, CheckCircle, XCircle, Save, X, Search, FileText, Image as ImageIcon, Eye, CheckSquare } from 'lucide-react';
import Badge from '../shared/Badge.jsx';
import Button from '../shared/Button.jsx';
import InspectorModal from './InspectorModal.jsx';

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown Date';
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
};

export default function PaperEditor({ papers = [], courses = [], onEdit, onDelete, onApprove, onReject, onToast, context = 'all' }) {
  const [editingId, setEditingId] = useState(null);
  const [inspectPaper, setInspectPaper] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Reset selection when context/papers change significantly
  useEffect(() => {
    setSelectedIds([]);
  }, [context]);

  const filtered = papers.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.course_code?.toLowerCase().includes(q) && !p.subject_name?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (yearFilter && p.academic_year !== yearFilter) return false;
    if (semFilter && p.semester !== semFilter) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime() || 0;
    const timeB = new Date(b.created_at).getTime() || 0;
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === sorted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sorted.map(p => p.id));
    }
  };

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
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-bauhaus-surface p-2 border-2 border-bauhaus-border sharp">
        <button
          onClick={toggleSelectAll}
          className="bg-bauhaus-canvas border-2 border-bauhaus-border text-bauhaus-ink px-3 py-1.5 font-mono text-xs font-bold uppercase sharp focus:outline-none focus:ring-2 focus:ring-bauhaus-yellow cursor-pointer flex items-center justify-center gap-2 hover:bg-bauhaus-elevated"
          title={selectedIds.length === sorted.length ? "Deselect All" : "Select All"}
        >
          <CheckSquare size={16} className={selectedIds.length === sorted.length ? "text-bauhaus-blue" : "text-bauhaus-muted"} />
          <span className="hidden sm:inline">SELECT ALL</span>
        </button>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search className="text-bauhaus-muted" size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold uppercase text-bauhaus-ink sharp focus:outline-none focus:ring-2 focus:ring-bauhaus-yellow transition-all"
            placeholder="SEARCH SUBJECT..."
          />
        </div>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="bg-bauhaus-canvas border-2 border-bauhaus-border text-bauhaus-ink px-2 py-1.5 font-mono text-xs font-bold uppercase sharp focus:outline-none focus:ring-2 focus:ring-bauhaus-yellow cursor-pointer">
          <option value="">ALL YEARS</option>
          {['2024-25', '2025-26', '2026-27'].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={semFilter} onChange={(e) => setSemFilter(e.target.value)} className="bg-bauhaus-canvas border-2 border-bauhaus-border text-bauhaus-ink px-2 py-1.5 font-mono text-xs font-bold uppercase sharp focus:outline-none focus:ring-2 focus:ring-bauhaus-yellow cursor-pointer">
          <option value="">ALL SEMESTERS</option>
          {['Fall Sem', 'Winter Sem', 'Summer Sem'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-bauhaus-canvas border-2 border-bauhaus-border text-bauhaus-ink px-2 py-1.5 font-mono text-xs font-bold uppercase sharp focus:outline-none focus:ring-2 focus:ring-bauhaus-yellow cursor-pointer">
          <option value="newest">NEWEST</option>
          <option value="oldest">OLDEST</option>
        </select>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-bauhaus-yellow text-bauhaus-ink p-3 border-2 border-bauhaus-border sharp flex flex-wrap items-center justify-between gap-3 shadow-bauhaus-sm">
          <span className="font-mono text-sm font-black uppercase tracking-wider">{selectedIds.length} SELECTED</span>
          <div className="flex flex-wrap gap-2">
            {(context === 'pending' || context === 'rejected') && (
              <Button variant="primary" size="sm" onClick={() => { selectedIds.forEach(id => onApprove(id)); setSelectedIds([]); }}>
                <CheckCircle size={14} className="mr-1" /> APPROVE
              </Button>
            )}
            {(context === 'pending' || context === 'active') && (
              <Button variant="outline" size="sm" className="bg-bauhaus-surface text-bauhaus-ink border-bauhaus-ink" onClick={() => { selectedIds.forEach(id => onReject(id)); setSelectedIds([]); }}>
                <XCircle size={14} className="mr-1" /> REJECT
              </Button>
            )}
            <Button variant="primary" size="sm" className="bg-bauhaus-red border-bauhaus-red text-white hover:bg-white hover:text-bauhaus-red" onClick={() => { selectedIds.forEach(id => onDelete(id)); setSelectedIds([]); }}>
              <Trash2 size={14} className="mr-1" /> {context === 'rejected' ? 'PERM. DELETE' : 'DELETE'}
            </Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-8 text-center">
          <p className="text-bauhaus-muted font-mono text-xs font-bold uppercase">NO PAPERS IN THIS CATEGORY</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map(paper => {
            const isPdf = paper.file_url?.toLowerCase().endsWith('.pdf');
            const isSelected = selectedIds.includes(paper.id);
            return (
            <div key={paper.id} className={`bg-bauhaus-surface border-2 ${isSelected ? 'border-bauhaus-blue bg-bauhaus-blue/5' : editingId === paper.id ? 'border-bauhaus-yellow' : 'border-bauhaus-border'} p-3 flex flex-col justify-between shadow-bauhaus sharp transition-all hover:border-bauhaus-blue`}>
              {editingId === paper.id ? (
                /* Edit Mode */
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                      <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Course</label>
                      <select value={editForm.course_code} onChange={e => { const course = courses.find(c => c.course_code === e.target.value); setEditForm(f => ({ ...f, course_code: e.target.value, subject_name: course ? course.subject_name : f.subject_name })); }} className={selectClass}>
                        {courses.map(c => <option key={c.course_code} value={c.course_code}>[{c.course_code}]</option>)}
                      </select>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Exam</label>
                          <select value={editForm.exam_type} onChange={e => setEditForm(f => ({ ...f, exam_type: e.target.value }))} className={selectClass}>
                            {['CAT1', 'CAT2', 'FAT', 'MODEL'].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Slot</label>
                          <input value={editForm.slot_tag} onChange={e => setEditForm(f => ({ ...f, slot_tag: e.target.value.toUpperCase() }))} className={inputClass} />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Sem</label>
                          <select value={editForm.semester} onChange={e => setEditForm(f => ({ ...f, semester: e.target.value }))} className={selectClass}>
                            {['Fall Sem', 'Win Sem', 'Others'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Year</label>
                          <select value={editForm.academic_year} onChange={e => setEditForm(f => ({ ...f, academic_year: e.target.value }))} className={selectClass}>
                            {['2026-27', '2025-26', '2024-25'].map(yr => <option key={yr} value={yr}>{yr}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-mono font-bold text-bauhaus-muted uppercase mb-1 block">Status</label>
                          <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className={selectClass}>
                            {['approved', 'pending', 'rejected'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id={`ak_${paper.id}`} checked={editForm.has_answer_key} onChange={e => setEditForm(f => ({ ...f, has_answer_key: e.target.checked }))} className="w-4 h-4 accent-bauhaus-red" />
                        <label htmlFor={`ak_${paper.id}`} className="text-[10px] font-mono font-bold text-bauhaus-ink uppercase cursor-pointer">Has Solutions</label>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t-2 border-bauhaus-border">
                    <Button variant="secondary" size="sm" onClick={() => saveEdit(paper.id)} disabled={saving} className="col-span-1 text-[10px] px-1">
                      <Save size={12} className="mr-1" /> SAVE
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="col-span-1 text-[10px] px-1">
                      <X size={12} className="mr-1" /> CANCEL
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(paper.id)}
                          className="w-4 h-4 accent-bauhaus-blue sharp cursor-pointer"
                        />
                        <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp">
                          {paper.course_code}
                        </span>
                        {context === 'all' && <Badge variant={statusColor[paper.status] || 'outline'}>{paper.status.toUpperCase()}</Badge>}
                      </div>
                      <div className="font-mono text-[10px] font-bold text-bauhaus-canvas bg-bauhaus-yellow px-1.5 py-0.5 border border-bauhaus-border sharp">
                        {paper.academic_year}
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-bold text-bauhaus-ink uppercase line-clamp-2 mb-2 h-10 cursor-pointer" onClick={() => toggleSelect(paper.id)}>
                      {paper.subject_name}
                    </h4>

                    {/* Thumbnail */}
                    <div
                      onClick={() => setInspectPaper(paper)}
                      className="relative h-32 bg-bauhaus-canvas mb-3 border border-bauhaus-border overflow-hidden cursor-pointer group flex items-center justify-center"
                    >
                      {isPdf ? (
                        <FileText size={32} className="text-bauhaus-muted" />
                      ) : (
                        <img
                          src={paper.file_url}
                          alt={paper.subject_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      )}
                      {!isPdf && <ImageIcon size={32} className="text-bauhaus-muted hidden" />}
                      <div className="absolute inset-0 bg-bauhaus-canvas/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="bg-bauhaus-red text-white text-[10px] font-black px-2 py-1 uppercase tracking-wider sharp border border-white">
                          INSPECT
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="red">{paper.exam_type}</Badge>
                      <Badge variant="blue">{paper.slot_tag}</Badge>
                      <Badge variant="outline">{paper.semester}</Badge>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-bauhaus-border flex justify-between gap-1">
                    <div className="flex flex-1 gap-1">
                      {paper.status === 'pending' && (
                        <>
                          <button onClick={() => onApprove(paper.id)} title="Approve" className="flex-1 flex justify-center items-center py-1 bg-bauhaus-blue text-white sharp border border-bauhaus-border cursor-pointer hover:opacity-90">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => onReject(paper.id)} title="Reject" className="flex-1 flex justify-center items-center py-1 bg-bauhaus-red text-white sharp border border-bauhaus-border cursor-pointer hover:opacity-90">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1 w-full justify-end">
                      <button onClick={() => startEdit(paper)} title="Edit" className="p-1.5 text-bauhaus-ink hover:bg-bauhaus-yellow sharp border border-bauhaus-border cursor-pointer transition-colors bg-bauhaus-surface">
                        <Edit3 size={14} />
                      </button>
                      {paper.status === 'rejected' ? (
                        <button onClick={() => onDelete(paper.id)} title="Permanent Delete" className="flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase text-white bg-bauhaus-red hover:opacity-90 sharp border border-bauhaus-border cursor-pointer transition-colors">
                          <Trash2 size={12} /> PERM. DELETE
                        </button>
                      ) : (
                        <button onClick={() => onDelete(paper.id)} title="Delete" className="p-1.5 text-white bg-bauhaus-red hover:opacity-90 sharp border border-bauhaus-border cursor-pointer transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {inspectPaper && (
        <InspectorModal
          paper={inspectPaper}
          papers={sorted}
          onSetPaper={setInspectPaper}
          courses={courses}
          onClose={() => setInspectPaper(null)}
          onApprove={(id) => {
            onApprove(id);
            onToast(`Approved ${inspectPaper.course_code}!`, 'success');
            setInspectPaper(null);
          }}
          onReject={(id) => {
            onReject(id);
            onToast(`Rejected submission`, 'warning');
            setInspectPaper(null);
          }}
          onEdit={async (id, updates) => {
            const { error } = await onEdit(id, updates);
            if (!error) {
              setInspectPaper({ ...inspectPaper, ...updates });
            }
            return { error };
          }}
        />
      )}
    </div>
  );
}
