// Initial Seed Registry for Courses and Papers

export const INITIAL_COURSES = [
  { course_code: 'BPHY101L', subject_name: 'Engineering Physics' },
  { course_code: 'BMAT101L', subject_name: 'Calculus for Engineers' },
  { course_code: 'BCSE202L', subject_name: 'Data Structures and Algorithms' },
  { course_code: 'BCSE101E', subject_name: 'Computer Programming (Python)' },
  { course_code: 'BEEE101L', subject_name: 'Basic Electrical & Electronics Engineering' },
  { course_code: 'BCSE301L', subject_name: 'Software Engineering' },
  { course_code: 'BCSE204L', subject_name: 'Database Management Systems' }
];

export const INITIAL_PAPERS = [
  {
    id: 'paper-101',
    course_code: 'BPHY101L',
    subject_name: 'Engineering Physics',
    exam_type: 'CAT-1',
    slot_tag: 'E2',
    academic_year: '2025-26',
    semester: 'Fall Sem',
    has_answer_key: true,
    status: 'approved',
    created_at: '2025-09-15T10:30:00Z',
    file_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    description: 'Continuous Assessment Test 1 (Fall 2025-26) with detailed solution key.'
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
    status: 'approved',
    created_at: '2024-10-20T14:20:00Z',
    file_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=80',
    description: 'CAT-2 question paper for BPHY101L.'
  },
  {
    id: 'paper-103',
    course_code: 'BMAT101L',
    subject_name: 'Calculus for Engineers',
    exam_type: 'FAT',
    slot_tag: 'A1',
    academic_year: '2024-25',
    semester: 'Win Sem',
    has_answer_key: true,
    status: 'approved',
    created_at: '2025-05-10T11:00:00Z',
    file_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80',
    description: 'Final Assessment Test FAT Winter 2024-25.'
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
    status: 'approved',
    created_at: '2025-09-18T09:15:00Z',
    file_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=80',
    description: 'CAT-1 exam paper focusing on trees and graph algorithms.'
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
    status: 'approved',
    created_at: '2024-12-05T16:00:00Z',
    file_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    description: 'Python programming lab and theory combined FAT paper.'
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
    status: 'pending',
    created_at: '2026-08-02T19:00:00Z',
    file_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    uploaded_by: 'Student (IP: 106.213.xxx.xxx)'
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
    status: 'pending',
    created_at: '2026-08-02T21:15:00Z',
    file_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    uploaded_by: 'Student (IP: 182.73.xxx.xxx)'
  }
];

export const AVAILABLE_SLOTS = {
  theory: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2'],
  tutorial: ['TA1', 'TA2', 'TB1', 'TB2', 'TC1', 'TC2', 'TD1', 'TD2', 'TE1', 'TE2', 'TF1', 'TF2', 'TG1', 'TG2'],
  lab: ['L1+L2', 'L3+L4', 'L5+L6', 'L31+L32', 'L33+L34', 'L35+L36', 'L59+L60']
};

export const ACADEMIC_YEARS = ['2025-26', '2024-25', '2023-24', '2022-23'];
export const SEMESTERS = ['Fall Sem', 'Winter Sem', 'Others'];
export const EXAM_TYPES = ['CAT-1', 'CAT-2', 'FAT'];
