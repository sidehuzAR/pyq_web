import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { validatePaperFile } from '../../lib/validators.js';

export default function Dropzone({ files = [], setFiles, onError }) {
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    const newPreviews = {};
    files.forEach((f) => {
      if (f.type.startsWith('image/')) {
        newPreviews[f.name] = URL.createObjectURL(f);
      }
    });
    setPreviews(newPreviews);
    
    return () => {
      Object.values(newPreviews).forEach(URL.revokeObjectURL);
    };
  }, [files]);

  const processIncomingFiles = (incomingFiles) => {
    const hasPdf = files.some(f => f.type === 'application/pdf') || incomingFiles.some(f => f.type === 'application/pdf');
    const hasImages = files.some(f => f.type.startsWith('image/')) || incomingFiles.some(f => f.type.startsWith('image/'));

    if (hasPdf && hasImages) {
      onError('Cannot mix PDFs and Images. Please upload either a single PDF or multiple images.');
      return;
    }

    if (hasPdf && (files.length > 0 || incomingFiles.length > 1)) {
      onError('Only one PDF file can be uploaded at a time.');
      return;
    }

    const validFiles = [];
    for (const file of incomingFiles) {
      const validation = validatePaperFile(file);
      if (!validation.valid) {
        onError(`File ${file.name}: ${validation.error}`);
        return;
      }
      validFiles.push(file);
    }

    setFiles([...files, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(Array.from(e.target.files));
    }
    e.target.value = null;
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    setFiles(newFiles);
  };

  return (
    <div className="space-y-3">
      {files.length > 0 && (
        <div className="space-y-2 mb-4">
          {files.map((file, idx) => {
            const isPdf = file.type === 'application/pdf';
            const previewUrl = previews[file.name];

            return (
              <div key={`${file.name}-${idx}`} className="flex items-center justify-between gap-3 bg-bauhaus-surface border-2 border-bauhaus-border p-2 sharp group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-bauhaus-canvas border border-bauhaus-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {isPdf ? (
                      <FileText size={20} className="text-bauhaus-muted" />
                    ) : previewUrl ? (
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-bauhaus-muted" />
                    )}
                  </div>
                  
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs font-bold text-bauhaus-ink truncate max-w-[150px] sm:max-w-xs">{file.name}</div>
                    <div className="text-[10px] font-mono text-bauhaus-muted font-bold">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB {isPdf ? '' : `• Page ${idx + 1}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!isPdf && files.length > 1 && (
                    <div className="flex flex-col">
                      <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="text-bauhaus-muted hover:text-bauhaus-ink disabled:opacity-30 p-0.5 cursor-pointer">
                        <ChevronUp size={16} />
                      </button>
                      <button type="button" onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="text-bauhaus-muted hover:text-bauhaus-ink disabled:opacity-30 p-0.5 cursor-pointer">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1.5 ml-2 text-bauhaus-muted hover:text-bauhaus-red bg-bauhaus-canvas border border-bauhaus-border sharp cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(!files.some(f => f.type === 'application/pdf')) && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-4 border-dashed p-6 text-center transition-all sharp cursor-pointer ${
            dragOver
              ? 'border-bauhaus-red bg-bauhaus-red/10'
              : 'border-bauhaus-border bg-bauhaus-canvas hover:bg-bauhaus-surface'
          }`}
        >
          <input
            type="file"
            id="file-upload-input"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleSelect}
            className="hidden"
          />

          <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
            <UploadCloud size={36} className="text-bauhaus-red" />
            <div className="text-sm font-black uppercase text-bauhaus-ink">
              {files.length > 0 ? 'CLICK OR DROP MORE IMAGES' : 'CLICK TO CHOOSE FILE(S) OR DRAG & DROP'}
            </div>
            <div className="text-xs font-mono font-bold text-bauhaus-muted uppercase">
              {files.length > 0 ? 'JPG, PNG, WEBP ONLY (MAX 10 MB EACH)' : '1 PDF OR MULTIPLE IMAGES (MAX 10 MB EACH)'}
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
