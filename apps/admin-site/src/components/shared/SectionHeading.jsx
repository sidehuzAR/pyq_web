import React from 'react';

export default function SectionHeading({
  number, // e.g. "01", "02"
  title, // e.g. "SEARCH & CATALOGUE MATRIX"
  subtitle,
  accentColor = 'red', // 'red' | 'blue' | 'yellow'
  className = ''
}) {
  let accentBarClass = 'bg-bauhaus-red';
  if (accentColor === 'blue') accentBarClass = 'bg-bauhaus-blue';
  if (accentColor === 'yellow') accentBarClass = 'bg-bauhaus-yellow';

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-3 mb-1">
        {number && (
          <span className="font-mono text-xs font-black tracking-widest text-bauhaus-canvas bg-bauhaus-yellow px-2 py-1 sharp">
            {number}
          </span>
        )}
        <div className={`h-3 w-8 ${accentBarClass}`}></div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-bauhaus-ink">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-sm font-medium text-bauhaus-muted max-w-2xl pl-0 sm:pl-11">
          {subtitle}
        </p>
      )}
    </div>
  );
}
