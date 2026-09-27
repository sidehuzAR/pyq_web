// Helper to route Supabase storage links through Netlify CDN edge proxy
export function getCdnUrl(fileUrl) {
  if (!fileUrl) return '';

  // If already proxied
  if (fileUrl.startsWith('/cdn/scans/')) return fileUrl;

  // If it's a Supabase storage URL, map to /cdn/scans/:filename
  const match = fileUrl.match(/\/paper-scans\/(.+)$/);
  if (match && match[1]) {
    return `/cdn/scans/${match[1]}`;
  }

  return fileUrl;
}
