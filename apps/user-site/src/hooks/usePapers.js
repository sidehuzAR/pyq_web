import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { getCdnUrl } from '../lib/cdn.js';
import { LIVE_PAPERS } from '../data/liveData.js';

const CACHE_KEY = 'pyq_approved_papers_cache';
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

// Fetch approved papers — with instant fallback to LIVE_PAPERS
export function useApprovedPapers() {
  const [approvedPapers, setApprovedPapers] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {}
    // Instant fallback if Supabase is quota-dropped: all 50 approved papers live!
    return LIVE_PAPERS.map(p => ({ ...p, file_url: getCdnUrl(p.file_url) }));
  });

  const [loading, setLoading] = useState(false);

  const fetchApproved = useCallback(async (force = false) => {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('status', 'approved')
        .order('uploaded_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const proxiedData = data.map(paper => ({
          ...paper,
          file_url: getCdnUrl(paper.file_url)
        }));
        setApprovedPapers(proxiedData);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: proxiedData, timestamp: Date.now() }));
      } else {
        // If Supabase returns error or dropped requests, use live verified papers
        const fallback = LIVE_PAPERS.map(p => ({ ...p, file_url: getCdnUrl(p.file_url) }));
        setApprovedPapers(fallback);
      }
    } catch (err) {
      console.warn('[useApprovedPapers] Supabase down or rate-limited. Serving offline live papers archive.');
      const fallback = LIVE_PAPERS.map(p => ({ ...p, file_url: getCdnUrl(p.file_url) }));
      setApprovedPapers(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApproved();
  }, [fetchApproved]);

  return { approvedPapers, loading, refreshApproved: () => fetchApproved(true) };
}

// Upload a new paper (goes to pending)
export function useUploadPaper() {
  const uploadPaper = async ({ file, metadata }) => {
    const { is_new_course, ...paperMetadata } = metadata;

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

    const fileExt = file.name.split('.').pop();
    const fileName = `${paperMetadata.course_code}_${paperMetadata.exam_type}_${Date.now()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('paper-scans')
      .upload(fileName, file, { upsert: false });

    if (storageError) return { error: storageError };

    const { data: urlData } = supabase.storage.from('paper-scans').getPublicUrl(storageData.path);

    const { error: dbError } = await supabase.from('papers').insert([{
      ...paperMetadata,
      file_url: urlData.publicUrl,
      status: 'pending',
    }]);

    return { error: dbError };
  };

  return { uploadPaper };
}
