import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

const LOCAL_STORAGE_KEY = 'pyarchive_course_requests_v1';

export function useCourseRequests() {
  const [submitting, setSubmitting] = useState(false);

  const requestCourse = async ({ course_code, subject_name, requested_by = 'Student' }) => {
    setSubmitting(true);
    const code = course_code.trim().toUpperCase();
    const name = subject_name.trim();

    // 1. Try Supabase insert
    const { error: dbError } = await supabase
      .from('course_requests')
      .insert([{ course_code: code, subject_name: name, requested_by, status: 'pending' }]);

    // 2. Also save to localStorage for offline / local-fallback mode
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const newReq = {
        id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        course_code: code,
        subject_name: name,
        requested_by,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newReq, ...existing]));
    } catch (e) {
      console.warn('localStorage save failed for course request:', e);
    }

    setSubmitting(false);

    // If Supabase table doesn't exist yet, we still succeed locally
    if (dbError && dbError.code === 'PGRST205') {
      return { error: null, localOnly: true };
    }

    return { error: dbError };
  };

  return { requestCourse, submitting };
}
