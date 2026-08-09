import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../shared/Button.jsx';
import { submitReport } from '../../lib/storage.js';

export default function ReportModal({ paperId, onClose, onToast }) {
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      onToast('Please describe the tag error or scan issue.', 'warning');
      return;
    }
    if (!email.includes('@')) {
      onToast('Please enter a valid email address.', 'warning');
      return;
    }

    submitReport({
      paper_id: paperId,
      report_comment: comment.trim(),
      student_email: email.trim()
    });

    onToast('Tag correction report submitted successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-bauhaus-canvas/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-bauhaus-surface border-4 border-bauhaus-border shadow-bauhaus-lg max-w-md w-full p-6 relative sharp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-bauhaus-muted hover:text-bauhaus-red font-mono text-xl font-bold cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="bg-bauhaus-red text-white p-2 sharp">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-bauhaus-ink leading-none">
              REPORT TAG ERROR
            </h3>
            <span className="font-mono text-[11px] text-bauhaus-muted font-bold uppercase">
              FEEDBACK FOR MODERATORS
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-bauhaus-ink mb-1">
              ISSUE DETAILS *
            </label>
            <textarea
              rows="3"
              required
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="e.g. Paper is CAT-2 instead of CAT-1, or wrong slot tag..."
              className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold text-bauhaus-ink placeholder-[#8B949E] focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow sharp"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-bauhaus-ink mb-1">
              STUDENT EMAIL ADDRESS *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@vit.ac.in"
              className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold text-bauhaus-ink placeholder-[#8B949E] focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow sharp"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm" type="submit">
              SUBMIT REPORT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
