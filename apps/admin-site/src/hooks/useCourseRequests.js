import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

const LOCAL_STORAGE_KEY = 'pyarchive_course_requests_v1';

export function useCourseRequests() {
  const [courseRequests, setCourseRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    let supabaseRequests = [];

    // 1. Try fetching from Supabase
    try {
      const { data, error } = await supabase
        .from('course_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && data) {
        supabaseRequests = data;
      }
    } catch (err) {
      console.warn('Supabase course_requests fetch error:', err);
    }

    // 2. Also fetch from localStorage
    let localRequests = [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        localRequests = JSON.parse(raw).filter(r => r.status === 'pending');
      }
    } catch (err) {
      console.warn('localStorage read error:', err);
    }

    // Deduplicate by course_code
    const combinedMap = new Map();
    [...localRequests, ...supabaseRequests].forEach(req => {
      combinedMap.set(req.course_code.toUpperCase(), req);
    });

    setCourseRequests(Array.from(combinedMap.values()));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const approveRequest = async (request, onAddCourse) => {
    // Add course to registry using onAddCourse callback
    const { error: addError } = await onAddCourse({
      course_code: request.course_code,
      subject_name: request.subject_name
    });

    if (addError) return { error: addError };

    // Update status in Supabase if possible
    if (request.id && !request.id.toString().startsWith('req_')) {
      await supabase
        .from('course_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);
    }

    // Update localStorage
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw).map(r => 
          r.course_code.toUpperCase() === request.course_code.toUpperCase()
            ? { ...r, status: 'approved' }
            : r
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
    } catch (err) {
      console.warn('localStorage update error:', err);
    }

    fetchRequests();
    return { error: null };
  };

  const rejectRequest = async (request) => {
    // Update status in Supabase if possible
    if (request.id && !request.id.toString().startsWith('req_')) {
      await supabase
        .from('course_requests')
        .update({ status: 'rejected' })
        .eq('id', request.id);
    }

    // Update localStorage
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw).filter(r => 
          r.course_code.toUpperCase() !== request.course_code.toUpperCase()
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
    } catch (err) {
      console.warn('localStorage reject error:', err);
    }

    fetchRequests();
    return { error: null };
  };

  return {
    courseRequests,
    loading,
    refreshRequests: fetchRequests,
    approveRequest,
    rejectRequest
  };
}
