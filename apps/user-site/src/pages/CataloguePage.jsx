import React, { useState, useMemo } from 'react';
import SectionHeading from '../components/shared/SectionHeading.jsx';
import SubjectCard from '../components/catalogue/SubjectCard.jsx';
import { Search } from 'lucide-react';
import { useCourses } from '../hooks/useCourses.js';

export default function CataloguePage({ approvedPapers = [] }) {
  const { courses, loading: coursesLoading } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const lowerQuery = searchQuery.toLowerCase();
    return courses.filter(c => 
      c.course_code.toLowerCase().includes(lowerQuery) || 
      c.subject_name.toLowerCase().includes(lowerQuery)
    );
  }, [courses, searchQuery]);

  // Helper to get number of approved papers for a given course
  const getPaperCount = (courseCode) => {
    return approvedPapers.filter(p => p.course_code.toLowerCase() === courseCode.toLowerCase()).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <SectionHeading
        number="01"
        title="COURSE CATALOGUE"
        subtitle="Browse all available subjects. Select a subject to view its previous year exam papers, categorised by slots, types, and semesters."
        accentColor="red"
      />

      {/* Catalogue Search Bar */}
      <div className="bg-bauhaus-surface border-4 border-bauhaus-border p-4 shadow-bauhaus sharp flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-bauhaus-muted" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-bauhaus-border text-lg font-mono font-bold uppercase placeholder-gray-500 text-black sharp focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow focus:border-black transition-all"
            placeholder="SEARCH BY COURSE CODE OR SUBJECT NAME..."
          />
        </div>
      </div>

      {/* Subjects Grid */}
      {coursesLoading ? (
        <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-12 text-center shadow-bauhaus sharp">
          <h3 className="text-xl font-black uppercase text-bauhaus-ink mb-2 animate-pulse">
            LOADING COURSES...
          </h3>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-12 text-center shadow-bauhaus sharp">
          <h3 className="text-xl font-black uppercase text-bauhaus-ink mb-2">
            NO SUBJECTS FOUND
          </h3>
          <p className="text-xs font-mono text-bauhaus-muted font-bold uppercase mb-4">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <SubjectCard
              key={course.id || course.course_code}
              course={course}
              paperCount={getPaperCount(course.course_code)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
