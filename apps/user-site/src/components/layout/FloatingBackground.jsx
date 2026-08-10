import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Retro Grid Texture */}
      <div className="absolute inset-0 bg-grid-dots opacity-[0.07] dark:opacity-[0.12]" />

      {/* Soft Ambient Radial Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-bauhaus-red/10 dark:bg-bauhaus-red/15 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-bauhaus-blue/10 dark:bg-bauhaus-blue/15 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-bauhaus-yellow/10 dark:bg-bauhaus-yellow/15 rounded-full blur-3xl animate-pulse-soft delay-2000" />

      {/* Floating Geometric Elements & Badges */}
      {/* 1. Top Left Floating Bauhaus Red Square */}
      <div className="absolute top-[12%] left-[5%] animate-float-slow">
        <div className="w-10 h-10 bg-bauhaus-red/15 border-2 border-bauhaus-red/40 dark:border-bauhaus-red/60 sharp shadow-sm flex items-center justify-center">
          <span className="font-mono text-[9px] font-bold text-bauhaus-red opacity-75">PYQ</span>
        </div>
      </div>

      {/* 2. Top Right Floating Blue Circle */}
      <div className="absolute top-[18%] right-[8%] animate-float-reverse">
        <div className="w-14 h-14 rounded-full bg-bauhaus-blue/15 border-2 border-bauhaus-blue/40 dark:border-bauhaus-blue/60 flex items-center justify-center">
          <span className="font-mono text-sm font-black text-bauhaus-blue opacity-80">∫</span>
        </div>
      </div>

      {/* 3. Mid Left Floating Yellow Triangle Accent */}
      <div className="absolute top-[42%] left-[3%] animate-float-drift">
        <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[32px] border-b-bauhaus-yellow/40 dark:border-bauhaus-yellow/60 filter drop-shadow-sm" />
      </div>

      {/* 4. Mid Right Floating CAT-1 Badge */}
      <div className="absolute top-[48%] right-[4%] animate-float-slow">
        <div className="px-2.5 py-1 bg-bauhaus-surface/80 border-2 border-bauhaus-border/30 dark:border-bauhaus-blue/50 text-bauhaus-blue font-mono text-[10px] font-black sharp tracking-widest backdrop-blur-xs">
          EXAM // CAT-1
        </div>
      </div>

      {/* 5. Lower Left Floating Diamond & Sum Symbol */}
      <div className="absolute bottom-[28%] left-[7%] animate-float-reverse">
        <div className="w-12 h-12 bg-bauhaus-yellow/15 border-2 border-bauhaus-yellow/40 dark:border-bauhaus-yellow/60 rotate-45 flex items-center justify-center">
          <span className="font-mono text-xs font-black text-bauhaus-yellow -rotate-45 opacity-90">∑</span>
        </div>
      </div>

      {/* 6. Lower Right Floating FAT Badge */}
      <div className="absolute bottom-[22%] right-[10%] animate-float-drift">
        <div className="px-3 py-1 bg-bauhaus-red/15 border-2 border-bauhaus-red/40 dark:border-bauhaus-red/60 text-bauhaus-red font-mono text-[10px] font-black sharp tracking-widest">
          VIT :: FAT
        </div>
      </div>

      {/* 7. Floating Math/Exam Floating Watermarks */}
      <div className="absolute top-[30%] left-[22%] animate-float-slow opacity-25 dark:opacity-35 font-mono text-2xl font-black text-bauhaus-ink">
        π
      </div>
      <div className="absolute top-[65%] left-[35%] animate-float-reverse opacity-20 dark:opacity-30 font-mono text-xl font-bold text-bauhaus-blue">
        Δ
      </div>
      <div className="absolute top-[25%] right-[25%] animate-float-drift opacity-25 dark:opacity-35 font-mono text-xl font-bold text-bauhaus-yellow">
        λ
      </div>
      <div className="absolute bottom-[15%] left-[28%] animate-float-slow opacity-20 dark:opacity-30 font-mono text-2xl font-black text-bauhaus-red">
        √
      </div>

      {/* Decorative Grid Lines Accent */}
      <div className="absolute top-[80px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-bauhaus-border/15 to-transparent" />
      <div className="absolute bottom-[100px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-bauhaus-border/15 to-transparent" />
    </div>
  );
}
