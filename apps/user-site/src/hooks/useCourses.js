import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

const COURSES_CACHE_KEY = 'pyq_courses_cache';
const COURSES_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export function useCourses() {
  const [courses, setCourses] = useState(() => {
    try {
      const cached = localStorage.getItem(COURSES_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < COURSES_CACHE_TTL && Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState(courses.length === 0);

  const fetchCourses = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = localStorage.getItem(COURSES_CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < COURSES_CACHE_TTL && Array.isArray(data) && data.length > 0) {
            setCourses(data);
            setLoading(false);
            return;
          }
        }
      } catch {}
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('course_code', { ascending: true });
      if (!error && data) {
        setCourses(data);
        localStorage.setItem(COURSES_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      }
    } catch (err) {
      console.warn('[useCourses] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (newCourse) => {
    const { error } = await supabase.from('courses').insert([newCourse]);
    if (!error) fetchCourses();
    return { error };
  };

  const updateCourse = async (courseCode, updates) => {
    const { error } = await supabase
      .from('courses')
      .update(updates)
      .eq('course_code', courseCode);
    if (!error) fetchCourses();
    return { error };
  };

  const deleteCourse = async (courseCode) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('course_code', courseCode);
    if (!error) fetchCourses();
    return { error };
  };

  return { courses, loading, addCourse, updateCourse, deleteCourse, refreshCourses: fetchCourses };
}
