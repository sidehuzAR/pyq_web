import React, { useEffect, useRef, useState } from 'react';

export default function PdfThumbnail({ fileUrl }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadPdf = async () => {
      setLoading(true);
      setError(false);
      try {
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        const loadingTask = window.pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        if (!active) return;

        const page = await pdf.getPage(1);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        // Render at a low scale for thumbnail
        const viewport = page.getViewport({ scale: 0.4 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
        
        if (active) setLoading(false);
      } catch (err) {
        console.error("Error rendering PDF thumbnail:", err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadPdf();
    return () => {
      active = false;
    };
  }, [fileUrl]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-bauhaus-elevated text-bauhaus-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-center px-2">PDF PREVIEW</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-bauhaus-canvas">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bauhaus-elevated z-10">
          <span className="font-mono text-[9px] animate-pulse text-bauhaus-muted">LOADING PREVIEW...</span>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
}
