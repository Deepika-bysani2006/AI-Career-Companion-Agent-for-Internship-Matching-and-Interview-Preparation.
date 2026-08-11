import React from 'react';

export const SkillBridgeLogo = ({ className = "h-10 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic SkillBridge Vector Emblem */}
      <svg viewBox="0 0 500 350" className="h-full w-auto aspect-[5/3.5] select-none filter drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Orange Arch */}
        <path d="M90 200 C150 100, 200 80, 250 180 L230 180 C180 95, 140 115, 100 200 Z" fill="#F59E0B" />
        <path d="M185 85 L185 180 M150 110 L150 190 M120 145 L120 195 M215 110 L215 180" stroke="#F59E0B" strokeWidth="4" />

        {/* Right Cyan Arch */}
        <path d="M410 200 C350 100, 300 80, 250 180 L270 180 C320 95, 360 115, 400 200 Z" fill="#00A8B5" />
        <path d="M315 85 L315 180 M350 110 L350 190 M380 145 L380 195 M285 110 L285 180" stroke="#00A8B5" strokeWidth="4" />

        {/* Reaching Person Figure */}
        <circle cx="255" cy="90" r="22" fill="#00A8B5" />
        <path d="M255 120 C220 150, 235 200, 310 160 C260 180, 240 140, 305 105 Z" fill="#00A8B5" />

        {/* Top Orange Star */}
        <path d="M305 60 L310 75 L325 80 L310 85 L305 100 L300 85 L285 80 L300 75 Z" fill="#F59E0B" />

        {/* Dark Navy Base Bridge Deck */}
        <path d="M80 200 Q 250 250 420 200 L420 225 Q 250 275 80 225 Z" fill="#0F2038" />
        <path d="M175 220 L175 240 M325 220 L325 240" stroke="#0F2038" strokeWidth="16" strokeLinecap="round" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center text-2xl font-extrabold tracking-tight leading-none">
            <span className="text-slate-900 dark:text-white">Skill</span>
            <span className="text-[#00A8B5]">Bridge</span>
          </div>
          <span className="text-[9px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-0.5">
            Connecting Skills to Opportunities
          </span>
        </div>
      )}
    </div>
  );
};
