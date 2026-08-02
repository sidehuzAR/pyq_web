// LocalStorage Persistence Service for pyarchive
import { INITIAL_COURSES, INITIAL_PAPERS, INITIAL_PENDING_PAPERS } from '../data/initialData.js';

const STORAGE_KEYS = {
  COURSES: 'pyarchive_courses_v1',
  PAPERS: 'pyarchive_approved_papers_v1',
  PENDING_PAPERS: 'pyarchive_pending_papers_v1',
  UPLOAD_COUNT: 'pyarchive_upload_count_v1'
};

// Rate limiting: Max 5 uploads per hour per user
const MAX_UPLOADS_PER_HOUR = 5;
const ONE_HOUR_MS = 60 * 60 * 1000;

export function getStoredCourses() {
  const data = localStorage.getItem(STORAGE_KEYS.COURSES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COURSES;
  }
}

export function saveCourse(newCourse) {
  const current = getStoredCourses();
  // Avoid duplicates
  const exists = current.some(c => c.course_code.toLowerCase() === newCourse.course_code.toLowerCase());
  if (exists) return current;

  const updated = [...current, newCourse];
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
  return updated;
}

export function getApprovedPapers() {
  const data = localStorage.getItem(STORAGE_KEYS.PAPERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(INITIAL_PAPERS));
    return INITIAL_PAPERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PAPERS;
  }
}

export function getPendingPapers() {
  const data = localStorage.getItem(STORAGE_KEYS.PENDING_PAPERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(INITIAL_PENDING_PAPERS));
    return INITIAL_PENDING_PAPERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PENDING_PAPERS;
  }
}

export function addPendingUpload(uploadData) {
  const pending = getPendingPapers();
  const newPaper = {
    id: `pending_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...uploadData,
    created_at: new Date().toISOString(),
    status: 'pending'
  };

  const updatedPending = [newPaper, ...pending];
  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(updatedPending));
  return newPaper;
}

export function approvePendingPaper(paperId) {
  const pending = getPendingPapers();
  const target = pending.find(p => p.id === paperId);
  if (!target) return { pending, approved: getApprovedPapers() };

  const updatedPending = pending.filter(p => p.id !== paperId);
  const approved = getApprovedPapers();

  const livePaper = {
    ...target,
    id: `paper_${Date.now()}`,
    status: 'approved'
  };

  const updatedApproved = [livePaper, ...approved];

  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(updatedPending));
  localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(updatedApproved));

  // Check if course needs to be added automatically
  saveCourse({
    course_code: target.course_code,
    subject_name: target.subject_name
  });

  return { pending: updatedPending, approved: updatedApproved };
}

export function rejectPendingPaper(paperId) {
  const pending = getPendingPapers();
  const updatedPending = pending.filter(p => p.id !== paperId);
  localStorage.setItem(STORAGE_KEYS.PENDING_PAPERS, JSON.stringify(updatedPending));
  return updatedPending;
}

export function checkRateLimit() {
  const now = Date.now();
  const rawData = localStorage.getItem(STORAGE_KEYS.UPLOAD_COUNT);
  let record = { count: 0, resetAt: now + ONE_HOUR_MS };

  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (now > parsed.resetAt) {
        record = { count: 0, resetAt: now + ONE_HOUR_MS };
      } else {
        record = parsed;
      }
    } catch {
      record = { count: 0, resetAt: now + ONE_HOUR_MS };
    }
  }

  if (record.count >= MAX_UPLOADS_PER_HOUR) {
    const minsLeft = Math.ceil((record.resetAt - now) / 60000);
    return {
      allowed: false,
      error: `Rate limit reached. Max 5 uploads/hour. Please try again in ${minsLeft} minute(s).`
    };
  }

  record.count += 1;
  localStorage.setItem(STORAGE_KEYS.UPLOAD_COUNT, JSON.stringify(record));
  return { allowed: true };
}
