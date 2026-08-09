// JSZip client-side batch download helper
import JSZip from 'jszip';

export async function createPapersZip(papers, customFilename = null) {
  if (!papers || papers.length === 0) {
    throw new Error('No papers selected for ZIP bundling.');
  }

  const zip = new JSZip();

  for (const paper of papers) {
    const filename = `${paper.course_code}_${paper.exam_type}_${paper.slot_tag}_${paper.academic_year}.jpg`;
    try {
      const resp = await fetch(paper.file_url);
      const blob = await resp.blob();
      zip.file(filename, blob);
    } catch {
      // Fallback text entry if fetch fails in dev
      zip.file(filename + '.txt', `Scan content for ${paper.course_code} ${paper.exam_type} (${paper.slot_tag})`);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadName = customFilename || `pyarchive_bundle_${Date.now()}.zip`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = downloadName;
  link.click();
  URL.revokeObjectURL(link.href);

  return downloadName;
}
