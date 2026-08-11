import React, { useState } from 'react';
import ModerationQueue from '../components/admin/ModerationQueue.jsx';
import CourseRegistryForm from '../components/admin/CourseRegistryForm.jsx';
import RegistryViewer from '../components/admin/RegistryViewer.jsx';
import PaperEditor from '../components/admin/PaperEditor.jsx';
import SectionHeading from '../components/shared/SectionHeading.jsx';
import Button from '../components/shared/Button.jsx';
import { ShieldCheck, CheckCircle2, PlusCircle, Edit3, Archive, AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const TABS = [
  { id: 'active', label: 'ACTIVE PAPERS', icon: CheckCircle2 },
  { id: 'pending', label: 'PENDING', icon: AlertCircle },
  { id: 'rejected', label: 'REJECTED', icon: XCircle },
  { id: 'add', label: 'ADD PAPER', icon: PlusCircle },
  { id: 'registry', label: 'COURSE REGISTRY', icon: Archive },
];

export default function AdminPage({
  pendingPapers = [],
  approvedPapers = [],
  rejectedPapers = [],
  allPapers = [],
  courses = [],
  loading = false,
  onRefresh,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onToast,
}) {
  const [activeTab, setActiveTab] = useState('active');

  // Paper actions
  const handleApprove = async (paperId) => {
    const { error } = await supabase.from('papers').update({ status: 'approved' }).eq('id', paperId);
    if (error) { onToast('Approve failed: ' + error.message, 'error'); }
    else { onToast('Paper approved — now live!', 'success'); onRefresh(); }
  };

  const handleReject = async (paperId) => {
    const { error } = await supabase.from('papers').update({ status: 'rejected' }).eq('id', paperId);
    if (error) { onToast('Reject failed: ' + error.message, 'error'); }
    else { onToast('Paper rejected.', 'warning'); onRefresh(); }
  };

  const handleEdit = async (paperId, updates) => {
    const { error } = await supabase.from('papers').update(updates).eq('id', paperId);
    if (error) { onToast('Edit failed: ' + error.message, 'error'); }
    else { onToast('Paper updated.', 'success'); onRefresh(); }
    return { error };
  };

  const handleDelete = async (paperId) => {
    if (!window.confirm('Delete this paper permanently?')) return;
    const { error } = await supabase.from('papers').delete().eq('id', paperId);
    if (error) { onToast('Delete failed: ' + error.message, 'error'); }
    else { onToast('Paper deleted.', 'success'); onRefresh(); }
  };

  const handleAdminAdd = async ({ file, metadata }) => {
    let file_url = metadata.file_url || null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${metadata.course_code}_${metadata.exam_type}_${Date.now()}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('paper-scans').upload(fileName, file, { upsert: false });
      if (storageError) { onToast('Upload failed: ' + storageError.message, 'error'); return; }
      const { data: urlData } = supabase.storage.from('paper-scans').getPublicUrl(storageData.path);
      file_url = urlData.publicUrl;
    }

    const { error } = await supabase.from('papers').insert([{ ...metadata, file_url, status: 'approved' }]);
    if (error) { onToast('Add failed: ' + error.message, 'error'); }
    else { onToast('Paper added and live!', 'success'); onRefresh(); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Bar */}
      <div className="bg-bauhaus-surface text-bauhaus-ink p-5 border-4 border-bauhaus-border shadow-bauhaus-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 sharp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bauhaus-red text-white flex items-center justify-center sharp border border-bauhaus-border">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-bauhaus-ink">
              ADMIN MODERATION CONSOLE
            </h1>
            <span className="font-mono text-xs font-bold text-bauhaus-yellow">
              {loading ? 'LOADING...' : `${allPapers.length} TOTAL PAPERS · ${pendingPapers.length} PENDING`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-bold text-bauhaus-muted uppercase">
          <span className="text-bauhaus-blue">{approvedPapers.length} APPROVED</span>
          <span className="text-bauhaus-red">{rejectedPapers.length} REJECTED</span>
          <span className="text-bauhaus-yellow">{pendingPapers.length} PENDING</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 border-b-4 border-bauhaus-border pb-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider sharp transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-bauhaus-red text-white border-2 border-bauhaus-border shadow-bauhaus-red'
                : 'bg-bauhaus-surface text-bauhaus-ink border-2 border-bauhaus-border hover:bg-bauhaus-yellow hover:text-bauhaus-canvas'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
            {id === 'pending' && pendingPapers.length > 0 && (
              <span className="bg-bauhaus-yellow text-bauhaus-canvas px-2 py-0.5 text-[10px] font-black sharp">
                {pendingPapers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Active Papers */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <SectionHeading number="01" title="ACTIVE PAPERS" subtitle="Manage currently live papers. Edit metadata or delete." accentColor="blue" />
          <PaperEditor
            papers={approvedPapers}
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            onToast={onToast}
            context="active"
          />
        </div>
      )}

      {/* Tab: Pending Papers */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <SectionHeading number="02" title="PENDING MODERATION" subtitle="Review student submissions. Approved papers go live instantly." accentColor="yellow" />
          <PaperEditor
            papers={pendingPapers}
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            onToast={onToast}
            context="pending"
          />
        </div>
      )}

      {/* Tab: Rejected Papers */}
      {activeTab === 'rejected' && (
        <div className="space-y-4">
          <SectionHeading number="03" title="REJECTED PAPERS" subtitle="Papers that failed moderation. They are not visible to users." accentColor="red" />
          <PaperEditor
            papers={rejectedPapers}
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            onToast={onToast}
            context="rejected"
          />
        </div>
      )}

      {/* Tab: Admin Add Paper */}
      {activeTab === 'add' && (
        <div className="space-y-4">
          <SectionHeading number="04" title="ADD PAPER DIRECTLY" subtitle="Upload a paper directly as approved — bypasses the pending queue and goes live immediately." accentColor="yellow" />
          <AdminAddPaperForm courses={courses} onSubmit={handleAdminAdd} onToast={onToast} />
        </div>
      )}

      {/* Tab: Course Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <SectionHeading number="05" title="COURSE REGISTRY MANAGEMENT" subtitle="Add, edit, or remove courses. Changes propagate instantly to upload forms and search." accentColor="blue" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <CourseRegistryForm onAddCourse={onAddCourse} onToast={onToast} />
            <RegistryViewer courses={courses} onUpdate={onUpdateCourse} onDelete={onDeleteCourse} onToast={onToast} />
          </div>
        </div>
      )}
    </div>
  );
}

// Inline mini form for admin-direct paper add
function AdminAddPaperForm({ courses, onSubmit, onToast }) {
  const [form, setForm] = useState({
    course_code: '', subject_name: '', exam_type: 'CAT-1', slot_tag: 'A1', semester: 'Fall Sem', academic_year: '2025-26', has_answer_key: false
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { onToast('Please attach a file.', 'error'); return; }
    setSubmitting(true);
    await onSubmit({ file, metadata: form });
    setSubmitting(false);
    setForm({ course_code: '', subject_name: '', exam_type: 'CAT-1', slot_tag: 'A1', semester: 'Fall Sem', academic_year: '2025-26', has_answer_key: false });
    setFile(null);
  };

  const selectClass = "w-full bg-bauhaus-canvas border-2 border-bauhaus-border text-bauhaus-ink px-3 py-2 font-mono text-xs font-bold uppercase sharp focus:outline-none focus:ring-2 focus:ring-bauhaus-yellow cursor-pointer";
  const inputClass = "w-full bg-bauhaus-canvas border-2 border-bauhaus-border text-bauhaus-ink px-3 py-2 font-mono text-xs font-bold uppercase placeholder-bauhaus-muted sharp focus:outline-none focus:ring-2 focus:ring-bauhaus-yellow";
  const label = "block text-[11px] font-mono font-bold uppercase tracking-widest text-bauhaus-muted mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-bauhaus-surface border-2 border-bauhaus-border p-6 shadow-bauhaus grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={label}>Course Code</label>
        <select value={form.course_code} onChange={e => {
          const c = courses.find(c => c.course_code === e.target.value);
          set('course_code', e.target.value);
          if (c) set('subject_name', c.subject_name);
        }} className={selectClass} required>
          <option value="">-- SELECT COURSE --</option>
          {courses.map(c => <option key={c.course_code} value={c.course_code}>[{c.course_code}] {c.subject_name}</option>)}
        </select>
      </div>

      <div>
        <label className={label}>Exam Type</label>
        <select value={form.exam_type} onChange={e => set('exam_type', e.target.value)} className={selectClass}>
          {['CAT-1', 'CAT-2', 'FAT'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className={label}>Slot Tag</label>
        <input value={form.slot_tag} onChange={e => set('slot_tag', e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. A1, A1 + TA1" required />
      </div>

      <div>
        <label className={label}>Semester</label>
        <select value={form.semester} onChange={e => set('semester', e.target.value)} className={selectClass}>
          {['Fall Sem', 'Win Sem', 'Others'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={label}>Academic Year</label>
        <select value={form.academic_year} onChange={e => set('academic_year', e.target.value)} className={selectClass}>
          {['2026-27', '2025-26', '2024-25'].map(yr => <option key={yr} value={yr}>{yr}</option>)}
        </select>
      </div>

      <div>
        <label className={label}>Paper File (PDF/Image)</label>
        <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])}
          className="w-full text-xs font-mono text-bauhaus-ink file:bg-bauhaus-elevated file:border file:border-bauhaus-border file:px-3 file:py-1 file:text-xs file:font-bold file:font-mono file:uppercase file:cursor-pointer file:text-bauhaus-ink cursor-pointer" required />
      </div>

      <div className="flex items-center gap-2 md:col-span-2">
        <input type="checkbox" id="has_answer_key" checked={form.has_answer_key} onChange={e => set('has_answer_key', e.target.checked)} className="w-4 h-4 accent-bauhaus-red" />
        <label htmlFor="has_answer_key" className="text-xs font-mono font-bold uppercase text-bauhaus-ink cursor-pointer">Has Answer Key / Solutions</label>
      </div>

      <div className="md:col-span-2">
        <Button variant="secondary" size="md" className="w-full" type="submit" disabled={submitting}>
          {submitting ? 'UPLOADING...' : 'ADD PAPER (GOES LIVE INSTANTLY) →'}
        </Button>
      </div>
    </form>
  );
}
