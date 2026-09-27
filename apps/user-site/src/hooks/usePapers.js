import { getCdnUrl } from '../lib/cdn.js';

const CACHE_KEY = 'pyq_approved_papers_cache';
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

// Fetch only approved papers — cached in localStorage for 3k daily viewers
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
    return [];
  });
  const [loading, setLoading] = useState(approvedPapers.length === 0);

  const fetchApproved = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length > 0) {
            setApprovedPapers(data);
            setLoading(false);
            return;
          }
        }
      } catch {}
    }

    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('status', 'approved')
        .order('uploaded_at', { ascending: false });

      if (!error && data) {
        // Rewrite Supabase storage URLs to fast Netlify CDN edge proxy
        const proxiedData = data.map(paper => ({
          ...paper,
          file_url: getCdnUrl(paper.file_url)
        }));
        setApprovedPapers(proxiedData);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: proxiedData, timestamp: Date.now() }));
      }
    } catch (err) {
      console.warn('[useApprovedPapers] Failed to fetch, using cached/fallback data.', err);
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
