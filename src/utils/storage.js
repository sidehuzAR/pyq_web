// LocalStorage Persistence Service for papersvitc

import { INITIAL_COURSES, INITIAL_PAPERS, INITIAL_PENDING_PAPERS } from '../data/initialData.js';

const STORAGE_KEYS = {
  COURSES: 'papersvitc_courses_v1',
  PAPERS: 'papersvitc_approved_papers_v1',
  PENDING_PAPERS: 'papersvitc_pending_papers_v1',
  PINNED_SUBJECTS: 'papersvitc_pinned_subjects_v1',
  UPLOAD_COUNT: 'papersvitc_upload_count_v1'
};

export function getStoredCourses() {
  const data = localStorage.getItem(STORAGE_KEYS.COURSES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  return JSON.parse(data);
}

export function saveCourse(newCourse) {
  const courses = getStoredCourses();
  // Check if course code already exists
  const existingIndex = courses.findIndex(c => c.course_code.toLowerCase() === newCourse.course_code.toLowerCase());
  if (existingIndex >= 0) {
    courses[existingIndex] = newCourse;
  } else {
    courses.push(newCourse);
  }
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  return courses;
}

export function getApprovedPapers() {
  const data = localStorage.getItem(STORAGE_KEYS.PAPERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(INITIAL_PAPERS));
    return INITIAL_PAPERS;
  }
  return JSON.parse(data);
}

export function getPendingPapers() {
  const data = localStorage.getItem(STORAGE_KEYS.PENDING_PAPERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(INITIAL_PENDING_PAPERS));
    return INITIAL_PENDING_PAPERS;
  }
  return JSON.parse(data);
}

export function addPendingUpload(uploadData) {
  const pending = getPendingPapers();
  const newRecord = {
    id: 'pending-' + Date.now(),
    ...uploadData,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  pending.unshift(newRecord);
  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(pending));
  return newRecord;
}

export function approvePendingPaper(paperId) {
  const pending = getPendingPapers();
  const approved = getApprovedPapers();

  const index = pending.findIndex(p => p.id === paperId);
  if (index === -1) return { pending, approved };

  const [paperToApprove] = pending.splice(index, 1);
  paperToApprove.status = 'approved';
  paperToApprove.approved_at = new Date().toISOString();

  approved.unshift(paperToApprove);

  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(pending));
  localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(approved));

  return { pending, approved };
}

export function rejectPendingPaper(paperId) {
  const pending = getPendingPapers();
  const updatedPending = pending.filter(p => p.id !== paperId);
  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(updatedPending));
  return updatedPending;
}

export function getPinnedSubjects() {
  const data = localStorage.getItem(STORAGE_KEYS.PINNED_SUBJECTS);
  return data ? JSON.parse(data) : ['BPHY101L', 'BCSE202L'];
}

export function togglePinSubject(courseCode) {
  const pinned = getPinnedSubjects();
  let updated;
  if (pinned.includes(courseCode)) {
    updated = pinned.filter(c => c !== courseCode);
  } else {
    updated = [...pinned, courseCode];
  }
  localStorage.setItem(STORAGE_KEYS.PINNED_SUBJECTS, JSON.stringify(updated));
  return updated;
}

// Anti-Bombing Rate Limiter Check (Max 5 uploads per hour)
export function checkRateLimit() {
  const raw = localStorage.getItem(STORAGE_KEYS.UPLOAD_COUNT);
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  let state = raw ? JSON.parse(raw) : { count: 0, resetAt: now + ONE_HOUR };

  if (now > state.resetAt) {
    state = { count: 0, resetAt: now + ONE_HOUR };
  }

  if (state.count >= 5) {
    const minsLeft = Math.ceil((state.resetAt - now) / (60 * 1000));
    return { allowed: false, error: `Rate limit reached (max 5 uploads/hour). Please try again in ${minsLeft} minutes.` };
  }

  state.count += 1;
  localStorage.setItem(STORAGE_KEYS.UPLOAD_COUNT, JSON.stringify(state));
  return { allowed: true };
}
