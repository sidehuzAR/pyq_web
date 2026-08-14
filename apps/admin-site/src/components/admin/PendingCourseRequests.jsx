import React from 'react';
import { Check, Trash2, BookOpen, Clock } from 'lucide-react';
import Button from '../shared/Button.jsx';

export default function PendingCourseRequests({ requests = [], onApprove, onReject, onToast }) {
  if (requests.length === 0) {
    return (
      <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-6 text-center shadow-bauhaus sharp">
        <BookOpen size={32} className="mx-auto text-bauhaus-yellow mb-2 opacity-80" />
        <h4 className="text-sm font-black uppercase text-bauhaus-ink">
          NO PENDING COURSE ADDITION REQUESTS
        </h4>
        <p className="text-[11px] font-mono text-bauhaus-muted uppercase font-bold mt-1">
          When students request new subjects to be registered, they will appear here for review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-4 shadow-bauhaus sharp space-y-3">
      <div className="flex items-center justify-between border-b-2 border-bauhaus-border pb-2">
        <div className="flex items-center gap-2">
          <Clock className="text-bauhaus-yellow" size={16} />
          <h4 className="font-mono text-xs font-black uppercase tracking-wider text-bauhaus-ink">
            STUDENT COURSE ADDITION REQUESTS ({requests.length})
          </h4>
        </div>
        <span className="font-mono text-[10px] text-bauhaus-yellow font-bold uppercase">
          AWAITING MODERATION
        </span>
      </div>

      <div className="divide-y divide-bauhaus-border">
        {requests.map((req) => (
          <div
            key={req.id || req.course_code}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black bg-bauhaus-yellow text-bauhaus-canvas px-2 py-0.5 sharp">
                  {req.course_code}
                </span>
                <span className="font-mono text-[10px] text-bauhaus-muted font-bold">
                  Requested by {req.requested_by || 'Student'}
                </span>
              </div>
              <h5 className="text-sm font-bold uppercase text-bauhaus-ink">
                {req.subject_name}
              </h5>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  const { error } = await onApprove(req);
                  if (error) {
                    onToast('Failed to approve request: ' + error.message, 'error');
                  } else {
                    onToast(`Approved ${req.course_code} — added to registry!`, 'success');
                  }
                }}
              >
                <Check size={14} />
                <span>APPROVE & ADD TO REGISTRY</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await onReject(req);
                  onToast(`Dismissed request for ${req.course_code}`, 'warning');
                }}
                className="text-bauhaus-red border-bauhaus-red"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
