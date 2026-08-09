import React, { useState, useEffect } from 'react';

export default function PaperCanvas({ fileUrl, title, zoom = 1 }) {
  const isPdf = fileUrl?.toLowerCase().includes('.pdf');
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    let url = null;
    if (fileUrl) {
      // Fetch as Blob to hide the real Supabase URL from the DOM & browser hover status
      fetch(fileUrl)
        .then(res => res.blob())
        .then(blob => {
          url = URL.createObjectURL(blob);
          setObjectUrl(url);
        })
        .catch(err => console.error("Error masking file URL:", err));
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    }
  }, [fileUrl]);

  if (!objectUrl) {
    return (
      <div className="flex-1 bg-bauhaus-canvas p-6 flex items-center justify-center relative min-h-[400px]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest animate-pulse text-bauhaus-muted">
          LOADING SECURE DOCUMENT...
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-bauhaus-canvas p-6 overflow-auto flex items-center justify-center relative min-h-[400px]">
      <div
        className={`transition-transform duration-200 ease-out border-4 border-bauhaus-border shadow-2xl bg-white ${isPdf ? 'w-full h-full max-h-[75vh]' : ''}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {isPdf ? (
          <object
            data={`${objectUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
            className="w-full h-full min-h-[60vh] block"
          >
            <p className="p-4 text-bauhaus-ink font-mono text-sm">
              Your browser does not support PDFs. <a href={fileUrl} target="_blank" rel="noreferrer" className="text-bauhaus-blue underline">View the PDF natively</a>.
            </p>
          </object>
        ) : (
          <img
            src={objectUrl}
            alt={title}
            className="max-w-full max-h-[70vh] object-contain block"
          />
        )}
      </div>
    </div>
  );
}
