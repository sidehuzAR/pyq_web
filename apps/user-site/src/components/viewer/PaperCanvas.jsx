import React from 'react';
import PdfViewer from './PdfViewer.jsx';

export default function PaperCanvas({ fileUrl, title, zoom = 1 }) {
  const isPdf = fileUrl?.toLowerCase().includes('.pdf');

  return (
    <div className="flex-1 bg-bauhaus-canvas overflow-auto flex flex-col items-center justify-start min-h-[400px]">
      {isPdf ? (
        <PdfViewer fileUrl={fileUrl} zoom={zoom} />
      ) : (
        <div
          className="transition-transform duration-200 ease-out border-4 border-bauhaus-border shadow-2xl bg-white m-6"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <img
            src={fileUrl}
            alt={title}
            className="max-w-full max-h-[70vh] object-contain block"
          />
        </div>
      )}
    </div>
  );
}
