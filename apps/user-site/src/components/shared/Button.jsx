import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'tertiary' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-bauhaus-red text-white border-2 border-bauhaus-border hover:brightness-110 shadow-bauhaus-red hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(217,45,32,0.4)] active:scale-95 active:translate-y-0.5 active:shadow-none active:brightness-90';
      break;
    case 'secondary':
      variantStyles = 'bg-bauhaus-yellow text-bauhaus-canvas border-2 border-bauhaus-border hover:brightness-110 shadow-bauhaus-yellow font-black hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,168,56,0.4)] active:scale-95 active:translate-y-0.5 active:shadow-none active:brightness-90';
      break;
    case 'tertiary':
      variantStyles = 'bg-bauhaus-blue text-bauhaus-canvas border-2 border-bauhaus-border hover:brightness-110 shadow-bauhaus-blue font-black hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,212,255,0.4)] active:scale-95 active:translate-y-0.5 active:shadow-none active:brightness-90';
      break;
    case 'outline':
      variantStyles = 'bg-bauhaus-surface text-bauhaus-ink border-2 border-bauhaus-border hover:bg-bauhaus-elevated shadow-bauhaus hover:-translate-y-0.5 hover:shadow-md active:scale-95 active:translate-y-0.5 active:shadow-none active:bg-bauhaus-elevated';
      break;
    default:
      variantStyles = 'bg-bauhaus-red text-white border-2 border-bauhaus-border hover:brightness-110 shadow-bauhaus-red hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(217,45,32,0.4)] active:scale-95 active:translate-y-0.5 active:shadow-none active:brightness-90';
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-xs font-bold tracking-wider';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3.5 text-base font-extrabold tracking-wider';
      break;
    default:
      sizeStyles = 'px-4 py-2 text-sm font-bold tracking-wider';
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 sharp uppercase cursor-pointer transition-all duration-150 ease-out active:scale-95 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
