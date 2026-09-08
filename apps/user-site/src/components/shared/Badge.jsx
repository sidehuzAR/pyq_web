import React from 'react';

export default function Badge({
  children,
  variant = 'dark', // 'red' | 'blue' | 'yellow' | 'dark' | 'outline'
  className = ''
}) {
  let styleClass = '';

  switch (variant) {
    case 'red':
      styleClass = 'bg-bauhaus-red text-white border border-bauhaus-border';
      break;
    case 'blue':
      styleClass = 'bg-bauhaus-blue text-bauhaus-canvas font-extrabold border border-bauhaus-border';
      break;
    case 'yellow':
      styleClass = 'bg-bauhaus-yellow text-bauhaus-canvas font-extrabold border border-bauhaus-border';
      break;
    case 'outline':
      styleClass = 'bg-bauhaus-surface text-bauhaus-ink border border-bauhaus-border';
      break;
    default:
      styleClass = 'bg-bauhaus-elevated text-bauhaus-ink border border-bauhaus-border';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider sharp ${styleClass} ${className}`}>
      {children}
    </span>
  );
}
