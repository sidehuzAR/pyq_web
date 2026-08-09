// localStorage Data Storage Layer for pyarchive (01-data-schema.md)
// This module is the ONLY file that directly reads/writes localStorage.

import { STORAGE_KEYS, STATUS } from '../constants/enums.js';

export const INITIAL_COURSES = [
  { course_code: 'BPHY101L', subject_name: 'Engineering Physics' },
  { course_code: 'BMAT101L', subject_name: 'Calculus for Engineers' },
  { course_code: 'BCSE202L', subject_name: 'Data Structures and Algorithms' },
  { course_code: 'BCSE101E', subject_name: 'Computer Programming (Python)' },
  { course_code: 'BEEE101L', subject_name: 'Basic Electrical & Electronics Engineering' },
  { course_code: 'BCSE301L', subject_name: 'Software Engineering' },
  { course_code: 'BCSE204L', subject_name: 'Database Management Systems' }
];

export const INITIAL_APPROVED_PAPERS = [
  {
    id: 'paper-101',
    course_code: 'BPHY101L',
    subject_name: 'Engineering Physics',
    exam_type: 'CAT-1',
    slot_tag: 'E2',
    academic_year: '2025-26',
    semester: 'Fall Sem',
    has_answer_key: true,
    status: STATUS.APPROVED,
    created_at: '2025-09-15T10:30:00Z',
    file_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    description: 'Continuous Assessment Test 1 with verified answer key.'
  },
  {
    id: 'paper-102',
    course_code: 'BPHY101L',
    subject_name: 'Engineering Physics',
    exam_type: 'CAT-2',
    slot_tag: 'B2',
    academic_year: '2024-25',
    semester: 'Fall Sem',
    has_answer_key: false,
    status: STATUS.APPROVED,
    created_at: '2024-10-20T14:20:00Z',
    file_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=80',
    description: 'CAT-2 question paper scan.'
  },
  {
    id: 'paper-103',
    course_code: 'BMAT101L',
    subject_name: 'Calculus for Engineers',
    exam_type: 'FAT',
    slot_tag: 'A1',
    academic_year: '2024-25',
    semester: 'Winter Sem',
    has_answer_key: true,
    status: STATUS.APPROVED,
    created_at: '2025-05-10T11:00:00Z',
    file_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80',
    description: 'Final Assessment Test FAT Winter term.'
  },
  {
    id: 'paper-104',
    course_code: 'BCSE202L',
    subject_name: 'Data Structures and Algorithms',
    exam_type: 'CAT-1',
    slot_tag: 'C1',
    academic_year: '2025-26',
    semester: 'Fall Sem',
    has_answer_key: false,
    status: STATUS.APPROVED,
    created_at: '2025-09-18T09:15:00Z',
    file_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=80',
    description: 'CAT-1 exam paper focusing on trees & graph algorithms.'
  },
  {
    id: 'paper-105',
    course_code: 'BCSE101E',
    subject_name: 'Computer Programming (Python)',
    exam_type: 'FAT',
    slot_tag: 'L1+L2',
    academic_year: '2024-25',
    semester: 'Fall Sem',
    has_answer_key: true,
    status: STATUS.APPROVED,
    created_at: '2024-12-05T16:00:00Z',
    file_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    description: 'Python programming combined theory and lab FAT paper.'
  }
];

export const INITIAL_PENDING_PAPERS = [
  {
    id: 'pending-201',
    course_code: 'BCSE301L',
    subject_name: 'Software Engineering',
    exam_type: 'CAT-2',
    slot_tag: 'D1',
    academic_year: '2025-26',
    semester: 'Fall Sem',
    has_answer_key: false,
    status: STATUS.PENDING,
    created_at: '2026-08-02T19:00:00Z',
    file_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    uploaded_by: 'Student (IP: 106.213.x.x)'
  },
  {
    id: 'pending-202',
    course_code: 'BEEE101L',
    subject_name: 'Basic Electrical & Electronics Engineering',
    exam_type: 'CAT-1',
    slot_tag: 'TA1',
    academic_year: '2025-26',
    semester: 'Fall Sem',
    has_answer_key: true,
    status: STATUS.PENDING,
    created_at: '2026-08-02T21:15:00Z',
    file_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    uploaded_by: 'Student (IP: 182.73.x.x)'
  }
];

// Course Registry Operations
export function getCourses() {
  const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_COURSES;
  }
}

export function saveCourse(course) {
  const courses = getCourses();
  const code = course.course_code.trim().toUpperCase();
  const name = course.subject_name.trim();

  const exists = courses.some(c => c.course_code.toUpperCase() === code);
  if (exists) return courses;

  const updated = [...courses, { course_code: code, subject_name: name }];
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
  return updated;
}

// Approved Papers Operations
export function getApprovedPapers() {
  const raw = localStorage.getItem(STORAGE_KEYS.APPROVED_PAPERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.APPROVED_PAPERS, JSON.stringify(INITIAL_APPROVED_PAPERS));
    return INITIAL_APPROVED_PAPERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPROVED_PAPERS;
  }
}

// Pending Papers Operations
export function getPendingPapers() {
  const raw = localStorage.getItem(STORAGE_KEYS.PENDING_PAPERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(INITIAL_PENDING_PAPERS));
    return INITIAL_PENDING_PAPERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_PENDING_PAPERS;
  }
}

export function addPendingPaper(paperData) {
  const pending = getPendingPapers();
  const newPaper = {
    id: `pending_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...paperData,
    course_code: paperData.course_code.trim().toUpperCase(),
    subject_name: paperData.subject_name.trim(),
    status: STATUS.PENDING,
    created_at: new Date().toISOString()
  };

  const updated = [newPaper, ...pending];
  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(updated));
  return newPaper;
}

// Admin Mutation Operations
export function approvePaper(paperId) {
  const pending = getPendingPapers();
  const target = pending.find(p => p.id === paperId);
  if (!target) return { pending, approved: getApprovedPapers() };

  const updatedPending = pending.filter(p => p.id !== paperId);
  const approved = getApprovedPapers();

  const livePaper = {
    ...target,
    id: `paper_${Date.now()}`,
    status: STATUS.APPROVED
  };

  const updatedApproved = [livePaper, ...approved];

  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(updatedPending));
  localStorage.setItem(STORAGE_KEYS.APPROVED_PAPERS, JSON.stringify(updatedApproved));

  // Auto-register course code if not already in registry
  saveCourse({
    course_code: target.course_code,
    subject_name: target.subject_name
  });

  return { pending: updatedPending, approved: updatedApproved };
}

export function rejectPaper(paperId) {
  const pending = getPendingPapers();
  const updatedPending = pending.filter(p => p.id !== paperId);
  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(updatedPending));
  return updatedPending;
}

// Issue / Tag Correction Reports
export function submitReport(reportData) {
  const existing = JSON.parse(localStorage.getItem('pyarchive_reports_v1') || '[]');
  const newReport = {
    id: `report_${Date.now()}`,
    ...reportData,
    created_at: new Date().toISOString()
  };
  localStorage.setItem('pyarchive_reports_v1', JSON.stringify([newReport, ...existing]));
  return newReport;
}
