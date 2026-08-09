import React from 'react';

export default function Toast({ toast, onClose }) {
  const { id, message, type } = toast;

  let bgClass = 'bg-bauhaus-elevated text-bauhaus-ink border-2 border-bauhaus-border';
  if (type === 'error') bgClass = 'bg-bauhaus-red text-white border-2 border-bauhaus-border';
  if (type === 'success') bgClass = 'bg-bauhaus-blue text-bauhaus-canvas font-black border-2 border-bauhaus-border';
  if (type === 'warning') bgClass = 'bg-bauhaus-yellow text-bauhaus-canvas font-black border-2 border-bauhaus-border';

  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider sharp shadow-bauhaus transition-all duration-200 ${bgClass}`}>
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-2 font-mono text-sm leading-none opacity-80 hover:opacity-100 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}
