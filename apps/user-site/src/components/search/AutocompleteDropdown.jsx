import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function AutocompleteDropdown({
  matchingCourses = [],
  searchQuery = '',
  onSelectCourse,
  onClose
}) {
  const navigate = useNavigate();

  if (!searchQuery.trim()) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-bauhaus-surface border-2 border-bauhaus-border shadow-bauhaus-lg max-h-72 overflow-y-auto transition-colors duration-200">
      <div className="bg-bauhaus-elevated text-bauhaus-yellow border-b border-bauhaus-border text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 flex justify-between items-center transition-colors duration-200">
        <span>MATCHING COURSES ({matchingCourses.length})</span>
      </div>

      {matchingCourses.length === 0 ? (
        <div className="p-4 text-center text-xs font-bold uppercase tracking-wider text-bauhaus-muted">
          NO COURSES MATCHING "{searchQuery}"
        </div>
      ) : (
        <div className="divide-y divide-bauhaus-border transition-colors duration-200">
          {matchingCourses.map(course => (
            <div
              key={course.course_code}
              onClick={() => {
                if (onSelectCourse) {
                  onSelectCourse(course.course_code);
                } else {
                  navigate(`/catalogue/${course.course_code}`);
                }
                if (onClose) onClose();
              }}
              className="flex items-center justify-between p-3 hover:bg-bauhaus-yellow hover:text-bauhaus-canvas cursor-pointer transition-colors duration-150 group"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp">
                  {course.course_code}
                </span>
                <span className="text-sm font-bold text-bauhaus-ink group-hover:text-bauhaus-canvas group-hover:underline">
                  {course.subject_name}
                </span>
              </div>
              <ChevronRight size={16} className="text-bauhaus-muted group-hover:text-bauhaus-canvas" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
