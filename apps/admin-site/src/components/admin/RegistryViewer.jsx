import React, { useState } from 'react';
import { Search, Edit3, Trash2, Check, X } from 'lucide-react';

export default function RegistryViewer({ courses = [], onUpdate, onDelete, onToast }) {
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const filteredCourses = filter.trim()
    ? courses.filter(c =>
        c.course_code.toLowerCase().includes(filter.toLowerCase().trim()) ||
        c.subject_name.toLowerCase().includes(filter.toLowerCase().trim())
      )
    : courses;

  const startEdit = (course) => {
    setEditingId(course.course_code);
    setEditName(course.subject_name);
  };

  const handleSave = async (courseCode) => {
    if (!editName.trim()) {
      onToast('Subject name cannot be empty.', 'error');
      return;
    }
    const { error } = await onUpdate(courseCode, { subject_name: editName.trim() });
    if (!error) {
      setEditingId(null);
      onToast('Course updated successfully.', 'success');
    } else {
      onToast('Failed to update course: ' + error.message, 'error');
    }
  };

  const handleDelete = async (courseCode) => {
    if (window.confirm(`Are you sure you want to delete ${courseCode}? This will also delete all papers associated with it.`)) {
      const { error } = await onDelete(courseCode);
      if (error) {
        onToast('Failed to delete course: ' + error.message, 'error');
      } else {
        onToast('Course deleted successfully.', 'success');
      }
    }
  };

  return (
    <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-5 shadow-bauhaus flex flex-col h-full sharp">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-xs font-bold uppercase text-bauhaus-blue">
          REGISTERED SUBJECTS ({courses.length})
        </span>
      </div>

      {/* Filter search */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-2.5 top-3 text-bauhaus-muted" />
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="FILTER REGISTRY..."
          className="w-full pl-8 pr-3 py-2 bg-bauhaus-canvas border border-bauhaus-border text-xs font-mono font-bold uppercase text-bauhaus-ink placeholder-[#8B949E] sharp"
        />
      </div>

      {/* Registry list */}
      <div className="flex-1 overflow-y-auto max-h-[320px] divide-y divide-[#30363D] border border-bauhaus-border">
        {filteredCourses.map(c => (
          <div key={c.course_code} className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-bauhaus-elevated">
            
            {editingId === c.course_code ? (
              <div className="flex-1 flex items-center gap-2">
                <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp flex-shrink-0">
                  {c.course_code}
                </span>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-2 py-1 bg-bauhaus-canvas border border-bauhaus-border text-xs font-bold text-bauhaus-ink sharp"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-xs font-black text-bauhaus-canvas bg-bauhaus-blue px-2 py-0.5 sharp flex-shrink-0">
                  {c.course_code}
                </span>
                <span className="text-xs font-bold text-bauhaus-ink truncate">
                  {c.subject_name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {editingId === c.course_code ? (
                <>
                  <button onClick={() => handleSave(c.course_code)} className="p-1.5 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white sharp border border-bauhaus-border cursor-pointer transition-colors" title="Save">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 text-bauhaus-red hover:bg-bauhaus-red hover:text-white sharp border border-bauhaus-border cursor-pointer transition-colors" title="Cancel">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(c)} className="p-1.5 text-bauhaus-yellow hover:bg-bauhaus-yellow hover:text-bauhaus-canvas sharp border border-bauhaus-border cursor-pointer transition-colors" title="Edit Subject Name">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(c.course_code)} className="p-1.5 text-bauhaus-red hover:bg-bauhaus-red hover:text-white sharp border border-bauhaus-border cursor-pointer transition-colors" title="Delete Course">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
