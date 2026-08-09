import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('course_code', { ascending: true });
    if (!error) setCourses(data || []);
    setLoading(false);
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
