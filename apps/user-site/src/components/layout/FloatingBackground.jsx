import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Retro Grid Texture */}
      <div className="absolute inset-0 bg-grid-dots opacity-[0.10] dark:opacity-[0.16]" />

      {/* Soft Ambient Radial Blur Orbs */}
      <div
        className="absolute top-10 left-1/3 w-[600px] h-[600px] rounded-full animate-pulse-soft transform-gpu blur-md"
        style={{ background: 'radial-gradient(circle, rgba(217, 45, 32, 0.16) 0%, rgba(217, 45, 32, 0.04) 50%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full animate-pulse-soft delay-1000 transform-gpu blur-md"
        style={{ background: 'radial-gradient(circle, rgba(0, 212, 255, 0.16) 0%, rgba(0, 212, 255, 0.04) 50%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full animate-pulse-soft delay-2000 transform-gpu blur-md"
        style={{ background: 'radial-gradient(circle, rgba(232, 168, 56, 0.16) 0%, rgba(232, 168, 56, 0.04) 50%, transparent 70%)' }}
      />

      {/* VIBRANT FLOATING ACCENT LINES PASSING DIRECTLY BEHIND THE CARDS */}
      <div className="absolute top-[160px] left-0 right-0 flex items-center animate-float-slow opacity-60">
        <div className="h-[3px] bg-[#00D4FF] w-[45%] shadow-[0_0_12px_#00D4FF]" />
        <div className="h-[3px] bg-[#E8A838] w-[55%] shadow-[0_0_12px_#E8A838]" />
      </div>

      <div className="absolute top-[380px] left-0 right-0 flex items-center animate-float-reverse opacity-60">
        <div className="h-[3px] bg-[#D92D20] w-[60%] shadow-[0_0_12px_#D92D20]" />
        <div className="h-[3px] bg-[#00D4FF] w-[40%] shadow-[0_0_12px_#00D4FF]" />
      </div>

      <div className="absolute top-[620px] left-0 right-0 flex items-center animate-float-drift opacity-60">
        <div className="h-[3px] bg-[#E8A838] w-[50%] shadow-[0_0_12px_#E8A838]" />
        <div className="h-[3px] bg-[#D92D20] w-[50%] shadow-[0_0_12px_#D92D20]" />
      </div>

      {/* FLOATING SHAPES & BADGES DIRECTLY PASSING BEHIND HERO & MAIN CARDS */}

      {/* 1. Cyan ACE Square Node */}
      <div className="absolute top-[138px] left-[55%] animate-float-slow opacity-70">
        <div className="w-16 h-16 bg-[#00D4FF]/20 border-2 border-[#00D4FF] shadow-[0_0_20px_#00D4FF] sharp flex items-center justify-center backdrop-blur-xs">
          <span className="font-mono text-xs font-black text-[#00D4FF]">ACE</span>
        </div>
      </div>

      {/* 2. Crimson PYQ Red Square */}
      <div className="absolute top-[14%] left-[20%] animate-float-slow opacity-70">
        <div className="w-14 h-14 bg-bauhaus-red/25 border-2 border-bauhaus-red shadow-[0_0_25px_rgba(217,45,32,0.5)] sharp flex items-center justify-center backdrop-blur-xs">
          <span className="font-mono text-xs font-black text-bauhaus-red">PYQ</span>
        </div>
      </div>

      {/* 3. Cyan Circle Integral */}
      <div className="absolute top-[22%] right-[22%] animate-float-reverse opacity-70">
        <div className="w-16 h-16 rounded-full bg-bauhaus-blue/25 border-2 border-bauhaus-blue shadow-[0_0_25px_rgba(0,212,255,0.5)] flex items-center justify-center backdrop-blur-xs">
          <span className="font-mono text-xl font-black text-bauhaus-blue">∫</span>
        </div>
      </div>

      {/* 4. Yellow Diamond Sum Symbol */}
      <div className="absolute top-[32%] left-[42%] animate-float-drift opacity-70">
        <div className="w-14 h-14 bg-bauhaus-yellow/25 border-2 border-bauhaus-yellow shadow-[0_0_25px_rgba(232,168,56,0.5)] rotate-45 flex items-center justify-center backdrop-blur-xs">
          <span className="font-mono text-sm font-black text-bauhaus-yellow -rotate-45">∑</span>
        </div>
      </div>

      {/* 5. Floating CAT-1 Badge */}
      <div className="absolute top-[36%] left-[12%] animate-float-reverse opacity-70">
        <div className="px-3.5 py-1.5 bg-bauhaus-blue/25 border-2 border-bauhaus-blue text-bauhaus-blue font-mono text-xs font-black sharp tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.4)]">
          EXAM // CAT-1
        </div>
      </div>

      {/* 6. Floating FAT Badge */}
      <div className="absolute top-[42%] right-[14%] animate-float-slow opacity-70">
        <div className="px-4 py-1.5 bg-bauhaus-red/25 border-2 border-bauhaus-red text-bauhaus-red font-mono text-xs font-black sharp tracking-widest shadow-[0_0_20px_rgba(217,45,32,0.5)]">
          VIT :: FAT
        </div>
      </div>

      {/* 7. Floating Yellow Triangle Accent */}
      <div className="absolute top-[52%] left-[34%] animate-float-drift opacity-70">
        <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[44px] border-b-bauhaus-yellow filter drop-shadow-[0_0_20px_rgba(232,168,56,0.5)]" />
      </div>

      {/* 8. Floating CAT-2 Badge */}
      <div className="absolute top-[58%] left-[22%] animate-float-slow opacity-70">
        <div className="px-3.5 py-1.5 bg-bauhaus-yellow/25 border-2 border-bauhaus-yellow text-bauhaus-yellow font-mono text-xs font-black sharp tracking-widest shadow-[0_0_20px_rgba(232,168,56,0.4)]">
          [CAT-2 SCAN]
        </div>
      </div>

      {/* FLOATING MATH & ACADEMIC SYMBOLS */}
      <div className="absolute top-[16%] left-[32%] animate-float-slow opacity-35 dark:opacity-50 font-mono text-3xl font-black text-bauhaus-red drop-shadow-md">
        π
      </div>
      <div className="absolute top-[30%] left-[62%] animate-float-reverse opacity-35 dark:opacity-50 font-mono text-2xl font-black text-bauhaus-blue drop-shadow-md">
        Δ
      </div>
      <div className="absolute top-[26%] right-[36%] animate-float-drift opacity-35 dark:opacity-50 font-mono text-2xl font-black text-bauhaus-yellow drop-shadow-md">
        λ
      </div>
      <div className="absolute top-[54%] left-[26%] animate-float-slow opacity-35 dark:opacity-50 font-mono text-3xl font-black text-bauhaus-red drop-shadow-md">
        √
      </div>
      <div className="absolute top-[46%] right-[42%] animate-float-reverse opacity-35 dark:opacity-50 font-mono text-2xl font-black text-bauhaus-blue drop-shadow-md">
        ∞
      </div>
      <div className="absolute top-[70%] left-[45%] animate-float-drift opacity-35 dark:opacity-50 font-mono text-2xl font-black text-bauhaus-yellow drop-shadow-md">
        ƒ(x)
      </div>
    </div>
  );
}
