import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Badge from '../shared/Badge.jsx';
import Button from '../shared/Button.jsx';

export default function MetadataBar({ paper, onOpenReport }) {
  if (!paper) return null;

  return (
    <div className="bg-bauhaus-elevated p-4 border-t-2 border-bauhaus-border flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Paper Information */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-black text-bauhaus-canvas bg-bauhaus-blue px-2.5 py-0.5 sharp">
            {paper.course_code}
          </span>
          <h2 className="text-lg font-black text-bauhaus-ink uppercase tracking-tight">
            {paper.subject_name}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="red">{paper.exam_type}</Badge>
          <Badge variant="blue">SLOT {paper.slot_tag}</Badge>
          <Badge variant="yellow">{paper.academic_year}</Badge>
          <Badge variant="outline">{paper.semester}</Badge>
          {paper.has_answer_key && (
            <Badge variant="dark">
              <CheckCircle size={12} className="inline mr-1 text-bauhaus-yellow" />
              VERIFIED SOLUTIONS
            </Badge>
          )}
        </div>
      </div>

      {/* Report wrong tags button */}
      <div>
        <Button variant="outline" size="sm" onClick={onOpenReport}>
          <AlertTriangle size={14} className="text-bauhaus-red" />
          <span>REPORT ISSUE / WRONG TAGS</span>
        </Button>
      </div>
    </div>
  );
}
