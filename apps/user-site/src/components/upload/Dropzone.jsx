import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import { validatePaperFile } from '../../lib/validators.js';

export default function Dropzone({ file, setFile, onError }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      const validation = validatePaperFile(dropped);
      if (!validation.valid) {
        onError(validation.error);
        return;
      }
      setFile(dropped);
    }
  };

  const handleSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const validation = validatePaperFile(selected);
      if (!validation.valid) {
        onError(validation.error);
        return;
      }
      setFile(selected);
    }
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-4 border-dashed p-6 text-center transition-all sharp cursor-pointer ${
        dragOver
          ? 'border-bauhaus-red bg-bauhaus-red/10'
          : file
          ? 'border-bauhaus-blue bg-bauhaus-blue/10'
          : 'border-bauhaus-border bg-bauhaus-canvas hover:bg-bauhaus-surface'
      }`}
    >
      <input
        type="file"
        id="file-upload-input"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleSelect}
        className="hidden"
      />

      {file ? (
        <div className="flex items-center justify-between gap-3 bg-bauhaus-surface border-2 border-bauhaus-border p-3 sharp">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-bauhaus-blue" />
            <div className="text-left">
              <div className="text-xs font-bold text-bauhaus-ink line-clamp-1">{file.name}</div>
              <div className="text-[11px] font-mono text-bauhaus-muted font-bold">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            className="p-1 text-bauhaus-muted hover:text-bauhaus-red font-mono font-bold"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
          <UploadCloud size={36} className="text-bauhaus-red" />
          <div className="text-sm font-black uppercase text-bauhaus-ink">
            CLICK TO CHOOSE FILE SCAN <span className="text-bauhaus-red">OR DRAG & DROP</span>
          </div>
          <div className="text-xs font-mono font-bold text-bauhaus-muted uppercase">
            PDF, JPG, PNG, WEBP (MAXIMUM 10 MB)
          </div>
        </label>
      )}
    </div>
  );
}
