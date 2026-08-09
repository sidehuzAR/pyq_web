import React, { useState } from 'react';
import { Eye, Check, Trash2, CheckCircle2 } from 'lucide-react';
import Badge from '../shared/Badge.jsx';
import Button from '../shared/Button.jsx';
import InspectorModal from './InspectorModal.jsx';

export default function ModerationQueue({ pendingPapers = [], courses = [], onApprove, onReject, onEdit, onToast }) {
  const [inspectPaper, setInspectPaper] = useState(null);

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

  return (
    <div className="space-y-4">
      {pendingPapers.map(paper => (
        <div
          key={paper.id}
          className="bg-bauhaus-surface border-2 border-bauhaus-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-bauhaus sharp"
        >
          {/* Thumbnail & Info */}
          <div className="flex items-center gap-4 flex-1">
            <div
              onClick={() => setInspectPaper(paper)}
              className="w-24 h-20 bg-bauhaus-canvas border border-bauhaus-border overflow-hidden flex-shrink-0 cursor-pointer relative group"
            >
              <img
                src={paper.file_url}
                alt={paper.subject_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-bauhaus-canvas/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Eye size={16} className="text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp">
                  {paper.course_code}
                </span>
                <span className="font-mono text-[11px] text-bauhaus-muted font-bold">
                  {paper.uploaded_by || 'Student Submission'}
                </span>
              </div>
              <h4 className="text-base font-bold text-bauhaus-ink uppercase line-clamp-1">
                {paper.subject_name}
              </h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="red">{paper.exam_type}</Badge>
                <Badge variant="blue">SLOT {paper.slot_tag}</Badge>
                <Badge variant="yellow">{paper.academic_year}</Badge>
                <Badge variant="outline">{paper.semester}</Badge>
                {paper.has_answer_key && <Badge variant="dark">✓ KEY INCLUDED</Badge>}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectPaper(paper)}
            >
              <Eye size={14} />
              <span>INSPECT</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onApprove(paper.id);
                onToast(`Approved ${paper.course_code} ${paper.exam_type}!`, 'success');
              }}
            >
              <Check size={14} />
              <span>ACCEPT</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onReject(paper.id);
                onToast(`Rejected pending upload for ${paper.course_code}`, 'warning');
              }}
              className="text-bauhaus-red border-bauhaus-red"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}

      {inspectPaper && (
        <InspectorModal
          paper={inspectPaper}
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
