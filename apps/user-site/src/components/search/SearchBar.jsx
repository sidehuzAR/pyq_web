import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import AutocompleteDropdown from './AutocompleteDropdown.jsx';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  courses = [],
  placeholder = "SEARCH COURSE CODE OR SUBJECT...",
  className = ""
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  const matchingCourses = searchQuery.trim()
    ? courses.filter(c =>
        c.course_code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        c.subject_name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-xl ${className}`} ref={containerRef}>
      <div className="relative flex items-center bg-bauhaus-surface border-2 border-bauhaus-border shadow-bauhaus focus-within:ring-2 focus-within:ring-bauhaus-yellow focus-within:border-bauhaus-yellow transition-colors duration-200">
        <Search size={18} className="absolute left-3 text-bauhaus-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (searchQuery.trim()) setShowDropdown(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white text-black text-sm font-bold placeholder-gray-500 uppercase tracking-wider focus:outline-none sharp"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setShowDropdown(false);
            }}
            className="absolute right-3 font-mono font-bold text-base text-bauhaus-muted hover:text-bauhaus-red cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <AutocompleteDropdown
          matchingCourses={matchingCourses}
          searchQuery={searchQuery}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
