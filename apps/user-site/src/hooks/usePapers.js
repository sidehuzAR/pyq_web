import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

// Fetch only approved papers — user side, RLS enforces this anyway
export function useApprovedPapers() {
  const [approvedPapers, setApprovedPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApproved = useCallback(async () => {
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .eq('status', 'approved')
      .order('uploaded_at', { ascending: false });
    if (!error) setApprovedPapers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApproved();

    // Real-time listener — update instantly when admin approves/rejects
    const channel = supabase
      .channel('papers-approved')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'papers' }, () => {
        fetchApproved();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchApproved]);

  return { approvedPapers, loading, refreshApproved: fetchApproved };
}

// Upload a new paper (goes to pending)
export function useUploadPaper() {
  const uploadPaper = async ({ file, metadata }) => {
    // Destructure the is_new_course flag (not a DB column)
    const { is_new_course, ...paperMetadata } = metadata;

    // If the course doesn't exist in the registry, auto-register it first
    // so the FK constraint on papers.course_code is satisfied
    if (is_new_course) {
      const { error: courseError } = await supabase
        .from('courses')
        .upsert(
          [{ course_code: paperMetadata.course_code, subject_name: paperMetadata.subject_name }],
          { onConflict: 'course_code' }
        );
      if (courseError) {
        console.error('Course registration error:', courseError);
        return { 
          error: { 
            message: `Failed to register new course "${paperMetadata.course_code}": ${courseError.message}` 
          } 
        };
      }
    }

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${paperMetadata.course_code}_${paperMetadata.exam_type}_${Date.now()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('paper-scans')
      .upload(fileName, file, { upsert: false });

    if (storageError) return { error: storageError };

    const { data: urlData } = supabase.storage.from('paper-scans').getPublicUrl(storageData.path);

    // 2. Insert paper record with file_url and status 'pending'
    const { error: dbError } = await supabase.from('papers').insert([{
      ...paperMetadata,
      file_url: urlData.publicUrl,
      status: 'pending',
    }]);

    return { error: dbError };
  };

  return { uploadPaper };
}
