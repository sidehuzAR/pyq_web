// Central constants & enums from 01-data-schema.md

export const EXAM_TYPES = ['CAT-1', 'CAT-2', 'FAT'];

export const SLOT_TAGS = {
  theory: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2'],
  tutorial: ['TA1', 'TA2', 'TB1', 'TB2', 'TC1', 'TC2', 'TD1', 'TD2', 'TE1', 'TE2', 'TF1', 'TF2', 'TG1', 'TG2'],
  lab: ['L1+L2', 'L3+L4', 'L5+L6', 'L31+L32', 'L33+L34', 'L35+L36', 'L59+L60']
};

export const ACADEMIC_YEARS = ['2026-27', '2025-26', '2024-25'];

export const SEMESTERS = ['Fall Sem', 'Winter Sem', 'Others'];

export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const STORAGE_KEYS = {
  COURSES: 'pyarchive_courses_v1',
  APPROVED_PAPERS: 'pyarchive_approved_papers_v1',
  PENDING_PAPERS: 'pyarchive_pending_papers_v1',
  UPLOAD_COUNT: 'pyarchive_upload_count_v1'
};
