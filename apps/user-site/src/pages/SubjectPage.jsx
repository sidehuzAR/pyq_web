import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, BookOpen } from 'lucide-react';
import FilterBar from '../components/catalogue/FilterBar.jsx';
import SortControl from '../components/catalogue/SortControl.jsx';
import PaperCard from '../components/catalogue/PaperCard.jsx';
import Button from '../components/shared/Button.jsx';
import { filterPapers, sortPapers, getAvailableSubjectFilters } from '../lib/filters.js';
import { createPapersZip } from '../lib/zip.js';

export default function SubjectPage({
  courses = [],
  approvedPapers = [],
  onViewPaper,
  onDownloadPaper,
  onToast
}) {
  const { course_code } = useParams();
  const navigate = useNavigate();

  const course = courses.find(
    c => c.course_code.toLowerCase() === (course_code || '').toLowerCase()
  ) || {
    course_code: course_code ? course_code.toUpperCase() : 'UNKNOWN',
    subject_name: course_code ? course_code.toUpperCase() : 'Unknown Subject'
  };

  // Get papers belonging strictly to this subject
  const subjectPapers = useMemo(() => {
    return approvedPapers.filter(
      p => p.course_code.toLowerCase() === (course_code || '').toLowerCase()
    );
  }, [approvedPapers, course_code]);

  // Extract available filter options strictly for this subject
  const availableOptions = useMemo(() => {
    return getAvailableSubjectFilters(subjectPapers);
  }, [subjectPapers]);

  // Subject scoped filters state
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [onlyAnswerKeys, setOnlyAnswerKeys] = useState(false);
  const [sortBy, setSortBy] = useState('year-desc');
  const [isZipping, setIsZipping] = useState(false);

  const filteredSubjectPapers = useMemo(() => {
    const filtered = filterPapers(subjectPapers, {
      courseCodeFilter: course.course_code,
      selectedExams,
      selectedSlots,
      selectedYears,
      selectedSemesters,
      onlyAnswerKeys
    });
    return sortPapers(filtered, sortBy);
  }, [subjectPapers, course.course_code, selectedExams, selectedSlots, selectedYears, selectedSemesters, onlyAnswerKeys, sortBy]);

  const handleResetFilters = () => {
    setSelectedExams([]);
    setSelectedSlots([]);
    setSelectedYears([]);
    setSelectedSemesters([]);
    setOnlyAnswerKeys(false);
  };

  const handleDownloadAllSubjectZip = async () => {
    if (filteredSubjectPapers.length === 0) {
      onToast('No papers available to download.', 'warning');
      return;
    }

    setIsZipping(true);
    onToast(`Bundling ${filteredSubjectPapers.length} papers for ${course.course_code}...`, 'info');

    try {
      const filename = await createPapersZip(filteredSubjectPapers, `${course.course_code}_all_papers.zip`);
      onToast(`Downloaded ${filename}!`, 'success');
    } catch {
      onToast('Failed to generate ZIP archive.', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb Back */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/catalogue')}>
          <ArrowLeft size={14} />
          <span>BACK TO MAIN CATALOGUE</span>
        </Button>
        <span className="font-mono text-xs font-bold text-bauhaus-muted">
          / {course.course_code}
        </span>
      </div>

      {/* Subject Header Banner */}
      <div className="bg-bauhaus-surface border-4 border-bauhaus-border p-6 sm:p-8 shadow-bauhaus-lg sharp relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <span className="font-mono text-base font-black text-bauhaus-canvas bg-bauhaus-blue px-3 py-1 sharp border border-bauhaus-border">
            {course.course_code}
          </span>
          <span className="font-mono text-xs font-black bg-bauhaus-yellow text-bauhaus-canvas px-3 py-1 border border-bauhaus-border sharp">
            {subjectPapers.length} PAPERS UPLOADED
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-bauhaus-ink uppercase tracking-tight mb-3">
          {course.subject_name}
        </h1>

        <p className="text-sm font-medium text-bauhaus-muted max-w-2xl mb-6">
          Complete question paper repository for {course.subject_name} ({course.course_code}). Filters below automatically display available timetable slots, exam categories, and academic terms for this specific course.
        </p>

        <div>
          <Button
            variant="secondary"
            size="md"
            disabled={isZipping || filteredSubjectPapers.length === 0}
            onClick={handleDownloadAllSubjectZip}
          >
            <Download size={16} />
            <span>{isZipping ? 'PACKAGING ZIP...' : `DOWNLOAD ALL PAPERS ZIP (${filteredSubjectPapers.length})`}</span>
          </Button>
        </div>
      </div>

      {/* Smart Scoped Filter Bar */}
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
        availableOptions={availableOptions}
      />

      {/* Sort Control */}
      <SortControl
        sortBy={sortBy}
        setSortBy={setSortBy}
        resultCount={filteredSubjectPapers.length}
      />

      {/* Papers Grid */}
      {filteredSubjectPapers.length === 0 ? (
        <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-12 text-center shadow-bauhaus sharp">
          <h3 className="text-xl font-black uppercase text-bauhaus-ink mb-2">
            NO PAPERS MATCH YOUR FILTERS FOR {course.course_code}
          </h3>
          <p className="text-xs font-mono text-bauhaus-muted font-bold uppercase mb-4">
            Try clearing slot or exam filters above.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-bauhaus-red text-white text-xs font-black uppercase tracking-wider sharp shadow-bauhaus-red cursor-pointer"
          >
            CLEAR SUBJECT FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjectPapers.map(paper => (
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
  );
}
