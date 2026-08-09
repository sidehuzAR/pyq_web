// Pure filter and sort logic for PYARCHIVE

export function filterPapers(papers, { searchQuery = '', selectedExams = [], selectedSlots = [], selectedYears = [], selectedSemesters = [], onlyAnswerKeys = false, courseCodeFilter = '' }) {
  return papers.filter(paper => {
    // Scoped to specific subject course code if requested
    if (courseCodeFilter && paper.course_code.toLowerCase() !== courseCodeFilter.toLowerCase()) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const codeMatch = paper.course_code.toLowerCase().includes(q);
      const nameMatch = paper.subject_name.toLowerCase().includes(q);
      if (!codeMatch && !nameMatch) return false;
    }

    // Answer Key Only toggle
    if (onlyAnswerKeys && !paper.has_answer_key) {
      return false;
    }

    // Exam Type filter (OR within group, normalized matching)
    if (selectedExams.length > 0) {
      const normalize = s => String(s || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const paperExamNorm = normalize(paper.exam_type);
      const matches = selectedExams.some(e => normalize(e) === paperExamNorm);
      if (!matches) return false;
    }

    // Slot Tag filter (OR within group)
    if (selectedSlots.length > 0 && !selectedSlots.includes(paper.slot_tag)) {
      return false;
    }

    // Academic Year filter (OR within group)
    if (selectedYears.length > 0 && !selectedYears.includes(paper.academic_year)) {
      return false;
    }

    // Semester filter (OR within group)
    if (selectedSemesters.length > 0 && !selectedSemesters.includes(paper.semester)) {
      return false;
    }

    return true;
  });
}

export function sortPapers(papers, sortBy = 'year-desc') {
  return [...papers].sort((a, b) => {
    if (sortBy === 'year-desc') {
      return b.academic_year.localeCompare(a.academic_year);
    }
    if (sortBy === 'year-asc') {
      return a.academic_year.localeCompare(b.academic_year);
    }
    if (sortBy === 'code-asc') {
      return a.course_code.localeCompare(b.course_code);
    }
    return 0;
  });
}

// Dynamically extracts existing filter options for a subject
export function getAvailableSubjectFilters(subjectPapers) {
  const slots = Array.from(new Set(subjectPapers.map(p => p.slot_tag))).sort();
  const exams = Array.from(new Set(subjectPapers.map(p => p.exam_type))).sort();
  const years = Array.from(new Set(subjectPapers.map(p => p.academic_year))).sort().reverse();
  const semesters = Array.from(new Set(subjectPapers.map(p => p.semester))).sort();

  return { slots, exams, years, semesters };
}
