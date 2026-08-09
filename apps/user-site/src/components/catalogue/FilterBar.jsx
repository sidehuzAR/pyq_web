import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { EXAM_TYPES, SLOT_TAGS, ACADEMIC_YEARS, SEMESTERS } from '../../constants/enums.js';

export default function FilterBar({
  selectedExams = [],
  setSelectedExams,
  selectedSlots = [],
  setSelectedSlots,
  selectedYears = [],
  setSelectedYears,
  selectedSemesters = [],
  setSelectedSemesters,
  onlyAnswerKeys = false,
  setOnlyAnswerKeys,
  onResetFilters,
  availableOptions = null
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleArrayItem = (list, setList, val) => {
    if (list.includes(val)) {
      setList(list.filter(v => v !== val));
    } else {
      setList([...list, val]);
    }
  };

  const examsToRender = (availableOptions?.exams && availableOptions.exams.length > 0)
    ? availableOptions.exams
    : EXAM_TYPES;

  const yearsToRender = (availableOptions?.years && availableOptions.years.length > 0)
    ? availableOptions.years
    : ACADEMIC_YEARS;

  const semsToRender = (availableOptions?.semesters && availableOptions.semesters.length > 0)
    ? availableOptions.semesters
    : SEMESTERS;

  // Slots to render — fallback to full SLOT_TAGS if availableOptions slots list is empty
  const theorySlots = (availableOptions?.slots && availableOptions.slots.length > 0)
    ? SLOT_TAGS.theory.filter(s => availableOptions.slots.includes(s))
    : SLOT_TAGS.theory;

  const tutorialSlots = (availableOptions?.slots && availableOptions.slots.length > 0)
    ? SLOT_TAGS.tutorial.filter(s => availableOptions.slots.includes(s))
    : SLOT_TAGS.tutorial;

  const labSlots = (availableOptions?.slots && availableOptions.slots.length > 0)
    ? SLOT_TAGS.lab.filter(s => availableOptions.slots.includes(s))
    : SLOT_TAGS.lab;

  const hasActiveFilters =
    selectedExams.length > 0 ||
    selectedSlots.length > 0 ||
    selectedYears.length > 0 ||
    selectedSemesters.length > 0 ||
    onlyAnswerKeys;

  return (
    <div className="bg-bauhaus-surface border-2 border-bauhaus-border p-4 shadow-bauhaus mb-6 transition-colors duration-200">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-bauhaus-elevated text-bauhaus-ink text-xs font-bold uppercase tracking-wider sharp border border-bauhaus-border cursor-pointer hover:bg-bauhaus-red hover:text-white transition-colors"
          >
            <Filter size={14} />
            <span>{isExpanded ? 'HIDE FILTERS' : 'SHOW FILTER CONSOLE'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Quick Answer Key Checkbox */}
          <label className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-bauhaus-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAnswerKeys}
              onChange={e => setOnlyAnswerKeys(e.target.checked)}
              className="w-4 h-4 accent-bauhaus-red sharp"
            />
            <span>SOLUTIONS ONLY</span>
          </label>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-bauhaus-canvas text-bauhaus-ink border border-bauhaus-border text-xs font-bold uppercase tracking-wider hover:bg-bauhaus-red hover:text-white cursor-pointer sharp transition-colors"
          >
            <RotateCcw size={12} />
            <span>RESET FILTERS</span>
          </button>
        )}
      </div>

      {/* Expandable Filter Console */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-bauhaus-border flex flex-col gap-4">
          {/* Exam Type Row */}
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-bauhaus-blue mb-2">
              EXAM CATEGORY:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {examsToRender.map(exam => {
                const isActive = selectedExams.includes(exam);
                return (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => toggleArrayItem(selectedExams, setSelectedExams, exam)}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider sharp border border-bauhaus-border transition-all ${
                      isActive
                        ? 'bg-bauhaus-red text-white shadow-bauhaus-red'
                        : 'bg-bauhaus-canvas text-bauhaus-ink hover:bg-bauhaus-yellow hover:text-bauhaus-canvas'
                    }`}
                  >
                    {exam}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timetable Slot Tags */}
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-bauhaus-blue mb-2">
              TIMETABLE SLOTS:
            </div>

            <div className="flex flex-col gap-2">
              {/* Theory */}
              {theorySlots.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-bauhaus-muted w-16">Theory:</span>
                  {theorySlots.map(slot => {
                    const isActive = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleArrayItem(selectedSlots, setSelectedSlots, slot)}
                        className={`px-2 py-0.5 text-xs font-mono font-bold sharp border border-bauhaus-border ${
                          isActive
                            ? 'bg-bauhaus-yellow text-bauhaus-canvas shadow-bauhaus'
                            : 'bg-bauhaus-canvas text-bauhaus-ink hover:bg-bauhaus-yellow/40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tutorial */}
              {tutorialSlots.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-bauhaus-muted w-16">Tutorial:</span>
                  {tutorialSlots.map(slot => {
                    const isActive = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleArrayItem(selectedSlots, setSelectedSlots, slot)}
                        className={`px-2 py-0.5 text-xs font-mono font-bold sharp border border-bauhaus-border ${
                          isActive
                            ? 'bg-bauhaus-yellow text-bauhaus-canvas shadow-bauhaus'
                            : 'bg-bauhaus-canvas text-bauhaus-ink hover:bg-bauhaus-yellow/40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Lab */}
              {labSlots.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-bauhaus-muted w-16">Lab:</span>
                  {labSlots.map(slot => {
                    const isActive = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleArrayItem(selectedSlots, setSelectedSlots, slot)}
                        className={`px-2 py-0.5 text-xs font-mono font-bold sharp border border-bauhaus-border ${
                          isActive
                            ? 'bg-bauhaus-yellow text-bauhaus-canvas shadow-bauhaus'
                            : 'bg-bauhaus-canvas text-bauhaus-ink hover:bg-bauhaus-yellow/40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Years & Semesters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic Years */}
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-bauhaus-blue mb-2">
                ACADEMIC YEAR:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {yearsToRender.map(yr => {
                  const isActive = selectedYears.includes(yr);
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => toggleArrayItem(selectedYears, setSelectedYears, yr)}
                      className={`px-2.5 py-1 text-xs font-mono font-bold sharp border border-bauhaus-border ${
                        isActive
                          ? 'bg-bauhaus-blue text-bauhaus-canvas shadow-bauhaus-blue font-extrabold'
                          : 'bg-bauhaus-canvas text-bauhaus-ink hover:bg-bauhaus-blue hover:text-bauhaus-canvas'
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Semesters */}
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-bauhaus-blue mb-2">
                SEMESTER:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {semsToRender.map(sem => {
                  const isActive = selectedSemesters.includes(sem);
                  return (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => toggleArrayItem(selectedSemesters, setSelectedSemesters, sem)}
                      className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider sharp border border-bauhaus-border ${
                        isActive
                          ? 'bg-bauhaus-elevated text-bauhaus-ink border-bauhaus-blue'
                          : 'bg-bauhaus-canvas text-bauhaus-ink hover:bg-bauhaus-elevated'
                      }`}
                    >
                      {sem}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
