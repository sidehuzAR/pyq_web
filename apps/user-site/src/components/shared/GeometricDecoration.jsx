import React from 'react';

export default function GeometricDecoration({ className = '' }) {
  return (
    <div className={`relative w-full max-w-sm aspect-square flex items-center justify-center p-4 ${className}`}>
      {/* Outer framing rectangle */}
      <div className="absolute inset-0 border-4 border-bauhaus-border bg-bauhaus-surface shadow-bauhaus-lg transition-colors duration-200"></div>

      {/* Blue Background Strip */}
      <div className="absolute top-4 left-4 right-12 bottom-12 bg-bauhaus-blue/20 border-2 border-bauhaus-blue"></div>

      {/* Red Circle */}
      <div className="absolute w-36 h-36 rounded-full bg-bauhaus-red border-4 border-bauhaus-border top-10 right-10 flex items-center justify-center shadow-bauhaus-red transition-colors duration-200">
        <div className="w-12 h-12 bg-bauhaus-canvas rounded-full border-2 border-bauhaus-yellow transition-colors duration-200"></div>
      </div>

      {/* Yellow Triangle SVG */}
      <div className="absolute bottom-6 left-8 w-32 h-32 z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[3px_3px_0px_var(--border-base)] transition-colors duration-200">
          <polygon points="50,10 90,90 10,90" fill="var(--accent-yellow)" stroke="var(--border-base)" strokeWidth="4" />
        </svg>
      </div>

      {/* Diagonal Grid Accent Lines */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        <div className="w-3 h-16 bg-bauhaus-border transition-colors duration-200"></div>
        <div className="w-3 h-12 bg-bauhaus-red transition-colors duration-200"></div>
        <div className="w-3 h-8 bg-bauhaus-blue transition-colors duration-200"></div>
      </div>

      {/* Stamp text */}
      <div className="absolute top-2 left-6 bg-bauhaus-border text-bauhaus-yellow px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest z-30 transition-colors duration-200">
        BAUHAUS DYNAMIC 1919
      </div>
    </div>
  );
}
