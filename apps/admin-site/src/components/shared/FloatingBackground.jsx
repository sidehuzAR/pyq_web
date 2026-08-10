import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Retro Grid Texture */}
      <div className="absolute inset-0 bg-grid-dots opacity-[0.07] dark:opacity-[0.12]" />

      {/* Soft Ambient Radial Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-bauhaus-red/10 dark:bg-bauhaus-red/15 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-bauhaus-blue/10 dark:bg-bauhaus-blue/15 rounded-full blur-3xl animate-pulse-soft delay-1000" />

      {/* Floating Geometric Elements & Admin Badges */}
      <div className="absolute top-[15%] left-[6%] animate-float-slow">
        <div className="w-10 h-10 bg-bauhaus-red/15 border-2 border-bauhaus-red/40 dark:border-bauhaus-red/60 sharp flex items-center justify-center">
          <span className="font-mono text-[9px] font-bold text-bauhaus-red">ADM</span>
        </div>
      </div>

      <div className="absolute top-[20%] right-[8%] animate-float-reverse">
        <div className="w-12 h-12 rounded-full bg-bauhaus-blue/15 border-2 border-bauhaus-blue/40 dark:border-bauhaus-blue/60 flex items-center justify-center">
          <span className="font-mono text-xs font-black text-bauhaus-blue">SYS</span>
        </div>
      </div>

      <div className="absolute bottom-[25%] left-[8%] animate-float-reverse">
        <div className="w-11 h-11 bg-bauhaus-yellow/15 border-2 border-bauhaus-yellow/40 dark:border-bauhaus-yellow/60 rotate-45 flex items-center justify-center">
          <span className="font-mono text-[10px] font-black text-bauhaus-yellow -rotate-45">DB</span>
        </div>
      </div>

      <div className="absolute bottom-[20%] right-[10%] animate-float-drift">
        <div className="px-2.5 py-1 bg-bauhaus-surface/80 border-2 border-bauhaus-border/30 text-bauhaus-ink font-mono text-[10px] font-bold sharp tracking-widest backdrop-blur-xs">
          ADMIN :: CONSOLE
        </div>
      </div>
    </div>
  );
}
