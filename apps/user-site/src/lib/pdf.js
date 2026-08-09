import { jsPDF } from 'jspdf';

export async function downloadPaperAsPdf(paper) {
  if (!paper || !paper.file_url) {
    throw new Error('Paper has no valid file URL.');
  }

  const filename = `${paper.course_code}_${paper.exam_type}_${paper.slot_tag}_${paper.academic_year || 'scan'}.pdf`;

  try {
    const imgData = await loadImageAsDataUrl(paper.file_url);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Dark Header Banner
    pdf.setFillColor(17, 17, 17);
    pdf.rect(0, 0, pageWidth, 24, 'F');
    pdf.setFillColor(217, 45, 32);
    pdf.rect(0, 24, pageWidth, 2, 'F');

    // Title & Metadata Text
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(`PYARCHIVE — ${paper.course_code}`, 10, 12);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(242, 194, 48);
    pdf.text(`${paper.subject_name || ''} | ${paper.exam_type || ''} (${paper.slot_tag || ''}) | ${paper.academic_year || ''}`, 10, 18);

    // Image Placement
    const margin = 10;
    const topOffset = 30;
    const maxImgWidth = pageWidth - margin * 2;
    const maxImgHeight = pageHeight - topOffset - margin;

    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;

    let renderWidth = maxImgWidth;
    let renderHeight = maxImgWidth / imgRatio;

    if (renderHeight > maxImgHeight) {
      renderHeight = maxImgHeight;
      renderWidth = maxImgHeight * imgRatio;
    }

    const xPos = (pageWidth - renderWidth) / 2;
    pdf.addImage(imgData, 'JPEG', xPos, topOffset, renderWidth, renderHeight);
    pdf.save(filename);
    return filename;
  } catch (err) {
    const link = document.createElement('a');
    link.href = paper.file_url;
    link.download = filename;
    link.target = '_blank';
    link.click();
    return filename;
  }
}

function loadImageAsDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}
