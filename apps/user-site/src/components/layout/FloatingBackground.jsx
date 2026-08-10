import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Retro Grid Texture */}
      <div className="absolute inset-0 bg-grid-dots opacity-[0.12] dark:opacity-[0.20]" />

      {/* Vibrant Ambient Radial Glow Orbs */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-bauhaus-red/20 dark:bg-bauhaus-red/25 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-bauhaus-blue/20 dark:bg-bauhaus-blue/25 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-bauhaus-yellow/20 dark:bg-bauhaus-yellow/25 rounded-full blur-3xl animate-pulse-soft delay-2000" />

      {/* FLOATING SHAPES & BADGES DIRECTLY PASSING BEHIND HERO & MAIN CARDS */}

      {/* 1. Glowing Crimson Red Square - Upper Center-Left (Drifts Behind Hero Title) */}
      <div className="absolute top-[14%] left-[22%] animate-float-slow">
        <div className="w-14 h-14 bg-bauhaus-red/30 border-2 border-bauhaus-red shadow-[0_0_20px_rgba(217,45,32,0.4)] sharp flex items-center justify-center backdrop-blur-xs">
          <span className="font-mono text-xs font-black text-bauhaus-red">PYQ</span>
        </div>
      </div>

      {/* 2. Glowing Cyan Circle - Upper Center-Right (Drifts Behind Hero Search) */}
      <div className="absolute top-[20%] right-[28%] animate-float-reverse">
        <div className="w-16 h-16 rounded-full bg-bauhaus-blue/30 border-2 border-bauhaus-blue shadow-[0_0_25px_rgba(0,212,255,0.5)] flex items-center justify-center backdrop-blur-xs">
          <span className="font-mono text-xl font-black text-bauhaus-blue">∫</span>
        </div>
      </div>

      {/* 3. Glowing Yellow Diamond - Mid Center (Drifts Behind Stats Card) */}
      <div className="absolute top-[28%] left-[48%] animate-float-drift">
        <div className="w-14 h-14 bg-bauhaus-yellow/30 border-2 border-bauhaus-yellow shadow-[0_0_25px_rgba(232,168,56,0.5)] rotate-45 flex items-center justify-center backdrop-blur-xs">
          <span className="font-mono text-sm font-black text-bauhaus-yellow -rotate-45">∑</span>
        </div>
      </div>

      {/* 4. Floating CAT-1 Badge - Upper Mid Left */}
      <div className="absolute top-[34%] left-[12%] animate-float-reverse">
        <div className="px-3 py-1.5 bg-bauhaus-blue/20 border-2 border-bauhaus-blue text-bauhaus-blue font-mono text-xs font-black sharp tracking-widest shadow-[0_0_15px_rgba(0,212,255,0.3)]">
          EXAM // CAT-1
        </div>
      </div>

      {/* 5. Floating FAT Badge - Upper Mid Right (Behind Stats Card) */}
      <div className="absolute top-[38%] right-[16%] animate-float-slow">
        <div className="px-3.5 py-1.5 bg-bauhaus-red/25 border-2 border-bauhaus-red text-bauhaus-red font-mono text-xs font-black sharp tracking-widest shadow-[0_0_20px_rgba(217,45,32,0.4)]">
          VIT :: FAT
        </div>
      </div>

      {/* 6. Floating Yellow Triangle Accent - Mid Section */}
      <div className="absolute top-[52%] left-[38%] animate-float-drift">
        <div className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-b-[40px] border-b-bauhaus-yellow filter drop-shadow-[0_0_15px_rgba(232,168,56,0.5)]" />
      </div>

      {/* 7. Floating CAT-2 Cyber Pill - Lower Mid Left */}
      <div className="absolute top-[60%] left-[18%] animate-float-slow">
        <div className="px-3 py-1 bg-bauhaus-yellow/20 border-2 border-bauhaus-yellow text-bauhaus-yellow font-mono text-xs font-black sharp tracking-widest shadow-[0_0_15px_rgba(232,168,56,0.3)]">
          [CAT-2 SCAN]
        </div>
      </div>

      {/* 8. Glowing Blue Square - Lower Right */}
      <div className="absolute top-[68%] right-[22%] animate-float-reverse">
        <div className="w-12 h-12 bg-bauhaus-blue/25 border-2 border-bauhaus-blue shadow-[0_0_20px_rgba(0,212,255,0.4)] sharp flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-bauhaus-blue">ACE</span>
        </div>
      </div>

      {/* FLOATING MATH & ACADEMIC SYMBOLS (HIGH VISIBILITY) */}
      <div className="absolute top-[16%] left-[34%] animate-float-slow opacity-50 dark:opacity-65 font-mono text-3xl font-black text-bauhaus-red drop-shadow-md">
        π
      </div>
      <div className="absolute top-[32%] left-[62%] animate-float-reverse opacity-45 dark:opacity-60 font-mono text-2xl font-black text-bauhaus-blue drop-shadow-md">
        Δ
      </div>
      <div className="absolute top-[26%] right-[38%] animate-float-drift opacity-50 dark:opacity-65 font-mono text-2xl font-black text-bauhaus-yellow drop-shadow-md">
        λ
      </div>
      <div className="absolute top-[55%] left-[28%] animate-float-slow opacity-45 dark:opacity-60 font-mono text-3xl font-black text-bauhaus-red drop-shadow-md">
        √
      </div>
      <div className="absolute top-[45%] right-[45%] animate-float-reverse opacity-50 dark:opacity-65 font-mono text-2xl font-black text-bauhaus-blue drop-shadow-md">
        ∞
      </div>
      <div className="absolute top-[72%] left-[44%] animate-float-drift opacity-45 dark:opacity-60 font-mono text-2xl font-black text-bauhaus-yellow drop-shadow-md">
        ƒ(x)
      </div>

      {/* Decorative Floating Horizontal & Vertical Line Traces */}
      <div className="absolute top-[180px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-bauhaus-red/30 to-transparent" />
      <div className="absolute top-[420px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-bauhaus-blue/30 to-transparent" />
      <div className="absolute top-[680px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-bauhaus-yellow/30 to-transparent" />
    </div>
  );
}
