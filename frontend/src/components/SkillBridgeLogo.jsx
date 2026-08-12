import React from 'react';

export const SkillBridgeLogo = ({ className = "h-11 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact Vector Emblem matching Official SkillBridge Brand Design */}
      <svg
        viewBox="0 0 600 460"
        className="h-full w-auto aspect-[6/4.6] filter drop-shadow-sm flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Orange Suspension Cables & Cable Stays */}
        <path
          d="M 90 200 Q 150 110 210 105 Q 260 170 300 185"
          stroke="#F97316"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M 125 152 L 125 200 M 150 128 L 150 200 M 175 112 L 175 200 M 195 107 L 195 200" stroke="#F97316" strokeWidth="4.5" />
        <rect x="202" y="100" width="16" height="100" rx="3" fill="#F97316" />

        {/* Right Cyan Suspension Cables & Cable Stays */}
        <path
          d="M 510 200 Q 450 110 390 105 Q 340 170 300 185"
          stroke="#00A8B5"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M 475 152 L 475 200 M 450 128 L 450 200 M 425 112 L 425 200 M 405 107 L 405 200" stroke="#00A8B5" strokeWidth="4.5" />
        <rect x="382" y="100" width="16" height="100" rx="3" fill="#00A8B5" />

        {/* Center Rising Candidate Figure (Reaching for Opportunity) */}
        <circle cx="300" cy="118" r="19" fill="#00A8B5" />
        <path
          d="M 282 185 C 275 145 285 130 310 122 C 340 110 355 85 362 65 C 345 95 320 120 295 138 C 285 148 280 165 282 185 Z"
          fill="#00A8B5"
        />

        {/* Top 4-Pointed Bright Orange Opportunity Star */}
        <path
          d="M 365 42 L 371 58 L 387 64 L 371 70 L 365 86 L 359 70 L 343 64 L 359 58 Z"
          fill="#F59E0B"
        />

        {/* Dark Navy Arch Bridge Base Deck */}
        <path
          d="M 75 200 Q 300 245 525 200 C 530 220 500 255 300 255 C 100 255 70 220 75 200 Z"
          fill="#0F2038"
        />
        {/* Bridge Pillars */}
        <path d="M 190 230 L 190 262 M 410 230 L 410 262" stroke="#0F2038" strokeWidth="22" strokeLinecap="round" />

        {/* Brand Name Text: Skill (Navy) Bridge (Cyan) */}
        <text x="35" y="340" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="88" fill="#0F2038" className="dark:fill-white">
          Skill
        </text>
        <text x="250" y="340" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="88" fill="#00A8B5">
          Bridge
        </text>

        {/* Tagline Accent Lines & Text */}
        <line x1="35" y1="380" x2="90" y2="380" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
        <text x="105" y="385" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="22" letterSpacing="3.5" fill="#0F2038" className="dark:fill-slate-300">
          CONNECTING SKILLS TO OPPORTUNITIES
        </text>
        <line x1="510" y1="380" x2="565" y2="380" stroke="#00A8B5" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>
  );
};
