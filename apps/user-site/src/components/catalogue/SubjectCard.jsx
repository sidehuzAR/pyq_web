import React from 'react';
import { ArrowRight, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubjectCard({ course, paperCount }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/catalogue/${course.course_code}`)}
      className="bg-bauhaus-surface border-4 border-bauhaus-border p-5 flex flex-col justify-between relative transition-all duration-150 sharp cursor-pointer shadow-bauhaus hover:border-bauhaus-blue hover:translate-x-[-4px] hover:translate-y-[-4px] group"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-4">
          <span className="font-mono text-sm font-black text-bauhaus-canvas bg-bauhaus-blue px-3 py-1 sharp border-2 border-bauhaus-border group-hover:bg-bauhaus-red transition-colors">
            {course.course_code}
          </span>
          <div className="flex items-center gap-1 bg-bauhaus-yellow px-2 py-0.5 border border-bauhaus-border sharp">
            <Book size={12} className="text-bauhaus-ink" />
            <span className="font-mono text-xs font-black text-bauhaus-ink">
              {paperCount} {paperCount === 1 ? 'PAPER' : 'PAPERS'}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-black text-bauhaus-ink mb-2 leading-tight group-hover:text-bauhaus-blue transition-colors line-clamp-3">
          {course.subject_name}
        </h3>
      </div>

      <div className="pt-4 mt-2 border-t-2 border-bauhaus-border flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-bauhaus-muted uppercase group-hover:text-bauhaus-red transition-colors">
          VIEW ARCHIVE
        </span>
        <ArrowRight size={18} className="text-bauhaus-muted group-hover:text-bauhaus-red transition-colors group-hover:translate-x-1" />
      </div>
    </div>
  );
}
