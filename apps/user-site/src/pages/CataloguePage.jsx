import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '../components/shared/SectionHeading.jsx';
import SubjectCard from '../components/catalogue/SubjectCard.jsx';
import FilterBar from '../components/catalogue/FilterBar.jsx';
import PaperCard from '../components/catalogue/PaperCard.jsx';
import { Search } from 'lucide-react';
import { useCourses } from '../hooks/useCourses.js';
import { filterPapers } from '../lib/filters.js';

export default function CataloguePage({
  approvedPapers = [],
  onViewPaper,
  onDownloadPaper
}) {
  const { courses, loading: coursesLoading } = useCourses();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Active filters state — initialized from URL search params
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [onlyAnswerKeys, setOnlyAnswerKeys] = useState(false);

  useEffect(() => {
    const examParam = searchParams.get('exam');
    if (examParam) setSelectedExams([examParam]);

    const slotParam = searchParams.get('slot');
    if (slotParam) setSelectedSlots([slotParam]);

    const yearParam = searchParams.get('year');
    if (yearParam) setSelectedYears([yearParam]);
  }, [searchParams]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const lowerQuery = searchQuery.toLowerCase();
    return courses.filter(c =>
      c.course_code.toLowerCase().includes(lowerQuery) ||
      c.subject_name.toLowerCase().includes(lowerQuery)
    );
  }, [courses, searchQuery]);

  // Filter papers based on active filter bar selections
  const filteredPapers = useMemo(() => {
    return filterPapers(approvedPapers, {
      searchQuery,
      selectedExams,
      selectedSlots,
      selectedYears,
      selectedSemesters,
      onlyAnswerKeys
    });
  }, [approvedPapers, searchQuery, selectedExams, selectedSlots, selectedYears, selectedSemesters, onlyAnswerKeys]);

  const hasActiveFilters =
    selectedExams.length > 0 ||
    selectedSlots.length > 0 ||
    selectedYears.length > 0 ||
    selectedSemesters.length > 0 ||
    onlyAnswerKeys;

  const handleResetFilters = () => {
    setSelectedExams([]);
    setSelectedSlots([]);
    setSelectedYears([]);
    setSelectedSemesters([]);
    setOnlyAnswerKeys(false);
    setSearchQuery('');
  };

  // Helper to get number of approved papers for a given course
  const getPaperCount = (courseCode) => {
    return approvedPapers.filter(p => p.course_code.toLowerCase() === courseCode.toLowerCase()).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <SectionHeading
        number="01"
        title="EXAM PAPERS CATALOGUE"
        subtitle="Browse all available subjects or use the filter console below to filter papers by CAT-1, CAT-2, FAT, timetable slots, and terms."
        accentColor="red"
      />

      {/* Filter Bar Console */}
      <FilterBar
        selectedExams={selectedExams}
        setSelectedExams={setSelectedExams}
        selectedSlots={selectedSlots}
        setSelectedSlots={setSelectedSlots}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        selectedSemesters={selectedSemesters}
        setSelectedSemesters={setSelectedSemesters}
        onlyAnswerKeys={onlyAnswerKeys}
        setOnlyAnswerKeys={setOnlyAnswerKeys}
        onResetFilters={handleResetFilters}
      />

      {/* Search Input */}
      <div className="bg-bauhaus-surface border-4 border-bauhaus-border p-4 shadow-bauhaus sharp flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-bauhaus-muted" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-bauhaus-border text-base font-mono font-bold uppercase placeholder-gray-500 text-black sharp focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow focus:border-black transition-all"
            placeholder="SEARCH BY COURSE CODE OR SUBJECT NAME..."
          />
        </div>
      </div>

      {/* Filtered Papers Grid (When filters are active) */}
      {hasActiveFilters && (
        <div className="space-y-4 pt-4 border-t-2 border-bauhaus-border">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-black uppercase text-bauhaus-red tracking-wider">
              FILTERED QUESTION PAPERS ({filteredPapers.length})
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-mono font-bold text-bauhaus-muted hover:text-bauhaus-red underline uppercase cursor-pointer"
            >
              CLEAR ALL FILTERS
            </button>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-8 text-center sharp">
              <h4 className="text-lg font-black uppercase text-bauhaus-ink mb-1">
                NO PAPERS MATCH ACTIVE FILTERS
              </h4>
              <p className="text-xs font-mono text-bauhaus-muted font-bold uppercase">
                Try toggling off specific slots or exam categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map(paper => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onViewPaper={onViewPaper}
                  onDownloadPaper={onDownloadPaper}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subjects Grid */}
      <div className="space-y-4 pt-4">
        <h3 className="font-mono text-sm font-black uppercase text-bauhaus-blue tracking-wider">
          ALL SUBJECTS ARCHIVE ({filteredCourses.length})
        </h3>

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
    </div>
  );
}
