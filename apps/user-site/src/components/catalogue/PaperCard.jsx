import React from 'react';
import { Eye, Download, CheckSquare, Square, CheckCircle } from 'lucide-react';
import Badge from '../shared/Badge.jsx';
import Button from '../shared/Button.jsx';
import PdfThumbnail from './PdfThumbnail.jsx';
import { normalizeSemesterName } from '../../lib/filters.js';

export default function PaperCard({
  paper,
  isSelected = false,
  onToggleSelect,
  onViewPaper,
  onDownloadPaper,
  onSelectCourse
}) {
  return (
    <div
      className={`bg-bauhaus-surface/85 backdrop-blur-md border-2 border-bauhaus-border p-4 flex flex-col justify-between relative transition-all duration-300 ease-out sharp ${
        isSelected
          ? 'bg-bauhaus-yellow/10 border-4 border-bauhaus-red shadow-bauhaus-red scale-[1.01]'
          : 'shadow-bauhaus hover:border-bauhaus-blue hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]'
      }`}
    >
      {/* Top Bar: Checkbox + Year visual prominence */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSelect && onToggleSelect(paper.id)}
              className="text-bauhaus-ink hover:text-bauhaus-red cursor-pointer"
              title={isSelected ? 'Deselect Paper' : 'Select Paper'}
            >
              {isSelected ? (
                <CheckSquare size={20} className="text-bauhaus-red fill-bauhaus-yellow" />
              ) : (
                <Square size={20} />
              )}
            </button>
            <span
              onClick={() => onSelectCourse && onSelectCourse(paper.course_code)}
              className="font-mono text-sm font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp cursor-pointer hover:bg-bauhaus-red hover:text-white transition-colors"
            >
              {paper.course_code}
            </span>
          </div>

          {/* Prominent Architectural Year Block */}
          <div className="font-display text-lg font-black text-bauhaus-canvas bg-bauhaus-yellow px-2.5 py-0.5 border border-bauhaus-border sharp">
            {paper.academic_year}
          </div>
        </div>

        {/* Subject Title */}
        <h3
          onClick={() => onSelectCourse && onSelectCourse(paper.course_code)}
          className="text-base font-bold text-bauhaus-ink mb-3 hover:text-bauhaus-blue cursor-pointer transition-colors line-clamp-2"
        >
          {paper.subject_name}
        </h3>

        {/* Visual Document Preview Card (Zero-bandwidth, instant render) */}
        <div
          onClick={() => onViewPaper && onViewPaper(paper)}
          className="relative h-32 bg-bauhaus-elevated mb-3 border-2 border-bauhaus-border overflow-hidden cursor-pointer group flex flex-col justify-between p-3 select-none transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-black tracking-widest text-bauhaus-muted uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-bauhaus-blue animate-pulse"></span>
              {paper.file_url?.toLowerCase().includes('.pdf') ? 'PDF DOCUMENT' : 'EXAM SCAN'}
            </span>
            <span className="font-mono text-[9px] font-bold text-bauhaus-ink/60 border border-bauhaus-border px-1.5 py-0.5">
              VERIFIED
            </span>
          </div>

          <div className="space-y-0.5 my-auto">
            <div className="font-mono text-xs font-black text-bauhaus-red tracking-tight truncate">
              {paper.course_code} • {paper.exam_type}
            </div>
            <div className="text-[11px] font-medium text-bauhaus-muted font-mono truncate">
              SLOT: {paper.slot_tag} | {paper.academic_year}
            </div>
          </div>

          <div className="absolute inset-0 bg-bauhaus-canvas/85 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150 backdrop-blur-[2px]">
            <span className="bg-bauhaus-red text-white text-xs font-black px-4 py-2 uppercase tracking-wider sharp border border-white shadow-bauhaus-red">
              INSPECT SCAN →
            </span>
          </div>
        </div>

        {/* Badges Matrix */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="red">{paper.exam_type}</Badge>
          <Badge variant="blue">{paper.slot_tag}</Badge>
          <Badge variant="outline">{normalizeSemesterName(paper.semester)}</Badge>
          {paper.has_answer_key && (
            <Badge variant="yellow">
              <CheckCircle size={11} className="inline mr-1" />
              SOLUTIONS INCLUDED
            </Badge>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t-2 border-bauhaus-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewPaper && onViewPaper(paper)}
        >
          <Eye size={14} />
          <span>VIEW</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDownloadPaper && onDownloadPaper(paper)}
        >
          <Download size={14} />
        </Button>
      </div>
    </div>
  );
}
