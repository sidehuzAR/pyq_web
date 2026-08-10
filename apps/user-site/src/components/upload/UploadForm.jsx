import React, { useState, useRef, useEffect } from 'react';

import Dropzone from './Dropzone.jsx';
import Button from '../shared/Button.jsx';
import AutocompleteDropdown from '../search/AutocompleteDropdown.jsx';
import { EXAM_TYPES, ACADEMIC_YEARS, SEMESTERS } from '../../constants/enums.js';
import { checkRateLimit, incrementRateLimitCount } from '../../lib/rateLimit.js';

export default function UploadForm({ courses = [], onSubmitUpload, onToast }) {
  const [courseCode, setCourseCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [examType, setExamType] = useState('CAT-1');
  const [slotTag, setSlotTag] = useState('A1');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [semester, setSemester] = useState('Fall Sem');
  const [hasAnswerKey, setHasAnswerKey] = useState(false);
  const [file, setFile] = useState(null);
  const [isCustomCourse, setIsCustomCourse] = useState(false);

  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);

  const codeContainerRef = useRef(null);
  const nameContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (codeContainerRef.current && !codeContainerRef.current.contains(e.target)) {
        setShowCodeDropdown(false);
      }
      if (nameContainerRef.current && !nameContainerRef.current.contains(e.target)) {
        setShowNameDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingCodeCourses = courseCode.trim() 
    ? courses.filter(c => c.course_code.toLowerCase().includes(courseCode.toLowerCase().trim())) 
    : [];

  const matchingNameCourses = subjectName.trim() 
    ? courses.filter(c => c.subject_name.toLowerCase().includes(subjectName.toLowerCase().trim())) 
    : [];

  // Bidirectional auto-linking: typing code auto-populates name
  const handleCourseCodeChange = (code) => {
    setCourseCode(code);
    setShowCodeDropdown(true);
    const matched = courses.find(c => c.course_code.toLowerCase() === code.toLowerCase().trim());
    if (matched) {
      setSubjectName(matched.subject_name);
    }
  };

  // Typing name auto-populates code
  const handleSubjectNameChange = (name) => {
    setSubjectName(name);
    setShowNameDropdown(true);
    const matched = courses.find(c => c.subject_name.toLowerCase() === name.toLowerCase().trim());
    if (matched) {
      setCourseCode(matched.course_code);
    }
  };

  const handleSelectCourse = (selectedCode) => {
    const matched = courses.find(c => c.course_code === selectedCode);
    if (matched) {
      setCourseCode(matched.course_code);
      setSubjectName(matched.subject_name);
    }
    setShowCodeDropdown(false);
    setShowNameDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Rate Limit Enforcement (02-functional-spec.md §6)
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      onToast(rateCheck.error, 'error');
      return;
    }

    if (!courseCode.trim() || !subjectName.trim()) {
      onToast('Please fill in both Course Code and Subject Name.', 'warning');
      return;
    }

    let fileUrl = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80';
    if (file) {
      try {
        fileUrl = URL.createObjectURL(file);
      } catch {
        // Fallback preview
      }
    }

    let finalCourseCode = courseCode.trim().toUpperCase();
    let finalSubjectName = subjectName.trim();

    // Check if the typed course exists in the registry
    const courseExists = courses.some(c => c.course_code.toUpperCase() === finalCourseCode);

    const payload = {
      course_code: finalCourseCode,
      subject_name: finalSubjectName,
      exam_type: examType,
      slot_tag: slotTag,
      academic_year: academicYear,
      semester: semester,
      has_answer_key: hasAnswerKey,
      is_new_course: !courseExists
    };

    incrementRateLimitCount();
    onSubmitUpload({ file, metadata: payload });

    // Reset form
    setCourseCode('');
    setSubjectName('');
    setHasAnswerKey(false);
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-bauhaus-surface border-4 border-bauhaus-border p-6 shadow-bauhaus-lg space-y-4 sharp max-w-2xl mx-auto">
      <div className="bg-bauhaus-elevated text-bauhaus-ink border border-bauhaus-border p-3 sharp flex items-center justify-between mb-2">
        <span className="font-display font-black text-base uppercase tracking-wider">
          CONTRIBUTE EXAM PAPER
        </span>
        <span className="font-mono text-[10px] text-bauhaus-yellow font-bold uppercase">
          MODERATED QUEUE
        </span>
      </div>

      {/* Linked Course Code & Subject Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
        <div className="sm:col-span-1 relative" ref={codeContainerRef}>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1 flex items-center justify-between">
            <span>COURSE CODE *</span>
          </label>
          <input
            type="text"
            required
            value={courseCode}
            onChange={e => handleCourseCodeChange(e.target.value)}
            onFocus={() => { if (courseCode.trim() && !isCustomCourse) setShowCodeDropdown(true) }}
            placeholder="e.g. BCSE202L"
            className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold uppercase text-bauhaus-ink placeholder-[#8B949E] sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow"
          />
          {showCodeDropdown && !isCustomCourse && (
            <AutocompleteDropdown
              matchingCourses={matchingCodeCourses}
              searchQuery={courseCode}
              onSelectCourse={handleSelectCourse}
              onClose={() => setShowCodeDropdown(false)}
            />
          )}
        </div>

        <div className="sm:col-span-2 relative" ref={nameContainerRef}>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
            SUBJECT NAME *
          </label>
          <input
            type="text"
            required
            value={subjectName}
            onChange={e => handleSubjectNameChange(e.target.value)}
            onFocus={() => { if (subjectName.trim() && !isCustomCourse) setShowNameDropdown(true) }}
            placeholder="e.g. Data Structures and Algorithms"
            className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold text-bauhaus-ink placeholder-[#8B949E] sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow"
          />
          {showNameDropdown && !isCustomCourse && (
            <AutocompleteDropdown
              matchingCourses={matchingNameCourses}
              searchQuery={subjectName}
              onSelectCourse={handleSelectCourse}
              onClose={() => setShowNameDropdown(false)}
            />
          )}
        </div>

        <div className="sm:col-span-3">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[10px] font-bold uppercase tracking-wider text-bauhaus-muted hover:text-bauhaus-ink transition-colors">
            <input
              type="checkbox"
              checked={isCustomCourse}
              onChange={e => {
                setIsCustomCourse(e.target.checked);
                setShowCodeDropdown(false);
                setShowNameDropdown(false);
              }}
              className="w-3 h-3 accent-bauhaus-blue sharp"
            />
            <span>SUBJECT NOT FOUND? ENTER MANUALLY</span>
          </label>
        </div>
      </div>

      {/* Exam Type & Slot Tag */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
            EXAM CATEGORY *
          </label>
          <select
            value={examType}
            onChange={e => setExamType(e.target.value)}
            className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold uppercase text-bauhaus-ink sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow cursor-pointer"
          >
            {EXAM_TYPES.map(exam => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
            TIMETABLE SLOT TAG *
          </label>
          <input
            type="text"
            required
            value={slotTag}
            onChange={e => setSlotTag(e.target.value.toUpperCase())}
            placeholder="e.g. A1, A1 + TA1"
            className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold uppercase text-bauhaus-ink placeholder-[#8B949E] sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow"
          />
        </div>
      </div>

      {/* Academic Year & Semester */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
            ACADEMIC YEAR *
          </label>
          <select
            value={academicYear}
            onChange={e => setAcademicYear(e.target.value)}
            className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold text-bauhaus-ink sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow cursor-pointer"
          >
            {ACADEMIC_YEARS.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
            SEMESTER *
          </label>
          <select
            value={semester}
            onChange={e => setSemester(e.target.value)}
            className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold uppercase text-bauhaus-ink sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow cursor-pointer"
          >
            {SEMESTERS.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Verified Solution Key Checkbox */}
      <div className="bg-bauhaus-canvas p-3 border-2 border-bauhaus-border sharp">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-bauhaus-ink">
          <input
            type="checkbox"
            checked={hasAnswerKey}
            onChange={e => setHasAnswerKey(e.target.checked)}
            className="w-4 h-4 accent-bauhaus-red sharp"
          />
          <span>INCLUDES VERIFIED ANSWER KEY / SOLUTION</span>
        </label>
      </div>

      {/* Dropzone */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
          PAPER SCAN FILE *
        </label>
        <Dropzone file={file} setFile={setFile} onError={err => onToast(err, 'error')} />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button variant="primary" size="lg" className="w-full" type="submit">
          SUBMIT PAPER FOR VERIFICATION →
        </Button>
      </div>
    </form>
  );
}
