import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Retro Grid Texture */}
      <div className="absolute inset-0 bg-grid-dots opacity-[0.12] dark:opacity-[0.20]" />

      {/* Vibrant Ambient Radial Glow Orbs (GPU Optimized with radial-gradient) */}
      <div
        className="absolute top-10 left-1/3 w-[500px] h-[500px] rounded-full animate-pulse-soft transform-gpu"
        style={{ background: 'radial-gradient(circle, rgba(217, 45, 32, 0.20) 0%, rgba(217, 45, 32, 0.05) 50%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full animate-pulse-soft delay-1000 transform-gpu"
        style={{ background: 'radial-gradient(circle, rgba(0, 212, 255, 0.20) 0%, rgba(0, 212, 255, 0.05) 50%, transparent 70%)' }}
      />

      {/* Floating Admin Badges & Geometric Elements */}
      <div className="absolute top-[15%] left-[25%] animate-float-slow">
        <div className="w-14 h-14 bg-bauhaus-red/30 border-2 border-bauhaus-red shadow-[0_0_20px_rgba(217,45,32,0.4)] sharp flex items-center justify-center">
          <span className="font-mono text-xs font-black text-bauhaus-red">ADM</span>
        </div>
      </div>

      <div className="absolute top-[22%] right-[30%] animate-float-reverse">
        <div className="w-16 h-16 rounded-full bg-bauhaus-blue/30 border-2 border-bauhaus-blue shadow-[0_0_25px_rgba(0,212,255,0.5)] flex items-center justify-center">
          <span className="font-mono text-xs font-black text-bauhaus-blue">SYS</span>
        </div>
      </div>

      <div className="absolute top-[45%] left-[40%] animate-float-drift">
        <div className="w-14 h-14 bg-bauhaus-yellow/30 border-2 border-bauhaus-yellow shadow-[0_0_25px_rgba(232,168,56,0.5)] rotate-45 flex items-center justify-center">
          <span className="font-mono text-xs font-black text-bauhaus-yellow -rotate-45">DB</span>
        </div>
      </div>
    </div>
  );
}
