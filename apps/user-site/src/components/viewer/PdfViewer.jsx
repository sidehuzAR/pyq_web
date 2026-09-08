import React, { useEffect, useRef, useState } from 'react';

export default function PdfViewer({ fileUrl, zoom = 1 }) {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

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
        const pdfDoc = await loadingTask.promise;
        if (!active) return;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setLoading(false);
      } catch (err) {
        console.error("Error loading PDF via PDF.js:", err);
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

  if (loading) {
    return (
      <div className="flex-1 bg-bauhaus-canvas p-6 flex items-center justify-center min-h-[400px]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest animate-pulse text-bauhaus-muted">
          RENDERING DOCUMENT PAGES...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-bauhaus-canvas p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
        <span className="font-mono text-sm font-black text-bauhaus-red uppercase mb-2">
          PDF RENDERING FAILED
        </span>
        <p className="text-xs font-mono text-bauhaus-muted font-bold max-w-xs">
          WE COULD NOT SECURELY RENDER THIS PDF IN YOUR BROWSER.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-auto flex flex-col items-center gap-6 p-4 w-full bg-bauhaus-canvas">
      {Array.from({ length: numPages }, (_, i) => (
        <PdfPage key={i + 1} pdf={pdf} pageNumber={i + 1} zoom={zoom} />
      ))}
    </div>
  );
}

function PdfPage({ pdf, pageNumber, zoom }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const renderPage = async () => {
      setLoading(true);
      try {
        const page = await pdf.getPage(pageNumber);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        // Get natural viewport at scale 1.5 for crisp text rendering on high-DPI screens
        const baseViewport = page.getViewport({ scale: 1.5 * zoom });

        canvas.height = baseViewport.height;
        canvas.width = baseViewport.width;

        // Cancel previous render task if active
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          viewport: baseViewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (active) setLoading(false);
      } catch (err) {
        if (err.name !== 'HeadingStatus' && err.name !== 'RenderingCancelledException') {
          console.error("Render page error:", err);
        }
      }
    };

    renderPage();
    return () => {
      active = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdf, pageNumber, zoom]);

  return (
    <div className="relative border-4 border-bauhaus-border shadow-md bg-white max-w-full">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <span className="font-mono text-[10px] animate-pulse text-bauhaus-muted">LOADING PAGE {pageNumber}...</span>
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full block" style={{ height: 'auto' }} />
    </div>
  );
}
