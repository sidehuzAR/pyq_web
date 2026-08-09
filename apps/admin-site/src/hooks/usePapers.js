import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

// All papers (pending, approved, rejected) — admin sees everything
export function useAllPapers() {
  const [allPapers, setAllPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .order('uploaded_at', { ascending: false });
    if (!error) setAllPapers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel('admin-papers-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'papers' }, () => fetchAll())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchAll]);

  const pendingPapers = allPapers.filter(p => p.status === 'pending');
  const approvedPapers = allPapers.filter(p => p.status === 'approved');
  const rejectedPapers = allPapers.filter(p => p.status === 'rejected');

  return { allPapers, pendingPapers, approvedPapers, rejectedPapers, loading, refreshAll: fetchAll };
}

// Approve a pending paper
export function useApprovePaper(onSuccess) {
  const approve = async (paperId) => {
    const { error } = await supabase
      .from('papers').update({ status: 'approved' }).eq('id', paperId);
    if (!error && onSuccess) onSuccess();
    return { error };
  };
  return { approve };
}

// Reject a pending paper
export function useRejectPaper(onSuccess) {
  const reject = async (paperId) => {
    const { error } = await supabase
      .from('papers').update({ status: 'rejected' }).eq('id', paperId);
    if (!error && onSuccess) onSuccess();
    return { error };
  };
  return { reject };
}

// Edit any field on any paper
export function useEditPaper(onSuccess) {
  const editPaper = async (paperId, updates) => {
    const { error } = await supabase
      .from('papers').update(updates).eq('id', paperId);
    if (!error && onSuccess) onSuccess();
    return { error };
  };
  return { editPaper };
}

// Delete a paper (removes DB row only — Storage file stays unless you clean up)
export function useDeletePaper(onSuccess) {
  const deletePaper = async (paperId) => {
    const { error } = await supabase
      .from('papers').delete().eq('id', paperId);
    if (!error && onSuccess) onSuccess();
    return { error };
  };
  return { deletePaper };
}

// Admin adds a paper directly (bypasses pending, goes straight to approved)
export function useAdminAddPaper(onSuccess) {
  const adminAddPaper = async ({ file, metadata }) => {
    let file_url = metadata.file_url || null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${metadata.course_code}_${metadata.exam_type}_${Date.now()}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('paper-scans')
        .upload(fileName, file, { upsert: false });
      if (storageError) return { error: storageError };
      const { data: urlData } = supabase.storage.from('paper-scans').getPublicUrl(storageData.path);
      file_url = urlData.publicUrl;
    }

    const { error } = await supabase.from('papers').insert([{
      ...metadata,
      file_url,
      status: 'approved', // Admin-added papers are instantly live
    }]);

    if (!error && onSuccess) onSuccess();
    return { error };
  };

  return { adminAddPaper };
}
