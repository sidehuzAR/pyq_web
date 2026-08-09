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
    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${metadata.course_code}_${metadata.exam_type}_${Date.now()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('paper-scans')
      .upload(fileName, file, { upsert: false });

    if (storageError) return { error: storageError };

    const { data: urlData } = supabase.storage.from('paper-scans').getPublicUrl(storageData.path);

    // 2. Insert paper record with file_url and status 'pending'
    const { error: dbError } = await supabase.from('papers').insert([{
      ...metadata,
      file_url: urlData.publicUrl,
      status: 'pending',
    }]);

    return { error: dbError };
  };

  return { uploadPaper };
}
