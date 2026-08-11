import React, { useState } from 'react';
import { Eye, Check, Trash2, CheckCircle2, FileText, Image as ImageIcon, Search } from 'lucide-react';
import Badge from '../shared/Badge.jsx';
import Button from '../shared/Button.jsx';
import InspectorModal from './InspectorModal.jsx';

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown Date';
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
};

export default function ModerationQueue({ pendingPapers = [], courses = [], onApprove, onReject, onEdit, onToast }) {
  const [inspectPaper, setInspectPaper] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');

  if (pendingPapers.length === 0) {
    return (
      <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-12 text-center shadow-bauhaus sharp">
        <CheckCircle2 size={48} className="mx-auto text-bauhaus-blue mb-3" />
        <h3 className="text-xl font-black uppercase text-bauhaus-ink mb-1">
          NO PENDING SUBMISSIONS
        </h3>
        <p className="text-xs font-mono text-bauhaus-muted font-bold uppercase">
          ALL STUDENT PAPER UPLOADS HAVE BEEN MODERATED & VERIFIED
        </p>
      </div>
    );
  }

  const filteredPapers = pendingPapers.filter(p => {
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

  const sortedPapers = [...filteredPapers].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime() || 0;
    const timeB = new Date(b.created_at).getTime() || 0;
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 mb-4 bg-bauhaus-surface p-2 border-2 border-bauhaus-border sharp">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedPapers.map(paper => {
          const isPdf = paper.file_url?.toLowerCase().endsWith('.pdf');
          
          return (
            <div
              key={paper.id}
              className="bg-bauhaus-surface border-2 border-bauhaus-border p-3 flex flex-col justify-between shadow-bauhaus sharp transition-all hover:border-bauhaus-blue"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp">
                    {paper.course_code}
                  </span>
                  <div className="font-mono text-[10px] font-bold text-bauhaus-canvas bg-bauhaus-yellow px-1.5 py-0.5 border border-bauhaus-border sharp">
                    {paper.academic_year}
                  </div>
                </div>
                
                <h4 className="text-sm font-bold text-bauhaus-ink uppercase line-clamp-2 mb-2 h-10">
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

              {/* Actions */}
              <div className="pt-2 border-t-2 border-bauhaus-border grid grid-cols-2 gap-1.5">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onApprove(paper.id);
                    onToast(`Approved ${paper.course_code}!`, 'success');
                  }}
                  className="col-span-1 text-[10px] px-1"
                >
                  <Check size={12} className="mr-1" /> ACCEPT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onReject(paper.id);
                    onToast(`Rejected upload`, 'warning');
                  }}
                  className="col-span-1 text-bauhaus-red border-bauhaus-red text-[10px] px-1"
                >
                  <Trash2 size={12} className="mr-1" /> REJECT
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {inspectPaper && (
        <InspectorModal
          paper={inspectPaper}
          papers={sortedPapers}
          onSetPaper={setInspectPaper}
          courses={courses}
          onClose={() => setInspectPaper(null)}
          onApprove={(id) => {
            onApprove(id);
            onToast(`Approved ${inspectPaper.course_code}!`, 'success');
          }}
          onReject={(id) => {
            onReject(id);
            onToast(`Rejected pending submission`, 'warning');
          }}
          onEdit={async (id, updates) => {
            const { error } = await onEdit(id, updates);
            if (!error) {
              setInspectPaper({ ...inspectPaper, ...updates });
            }
          }}
        />
      )}
    </div>
  );
}
