import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  whiteText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  whiteText = false,
}) => {
  const sizeMap = {
    sm: { icon: 34, title: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 46, title: 'text-base font-bold', sub: 'text-xs' },
    lg: { icon: 60, title: 'text-xl font-extrabold', sub: 'text-sm' },
    xl: { icon: 84, title: 'text-2xl font-black', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Circular Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="josGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            <linearGradient id="josGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="josWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>

          {/* Outer Ring */}
          <circle cx="50" cy="50" r="48" fill="url(#josGreenGrad)" stroke="url(#josGoldGrad)" strokeWidth="3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* Riverside Sun & Light rays */}
          <circle cx="50" cy="38" r="14" fill="#fbbf24" opacity="0.95" />
          <path d="M50 20 L50 16 M64 26 L67 23 M36 26 L33 23" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />

          {/* Traditional Boat (Nouka / Sampan) */}
          <path
            d="M26 62 Q50 72 74 62 L66 69 Q50 76 34 69 Z"
            fill="url(#josGoldGrad)"
          />
          <path d="M48 62 L48 44 L60 54 Z" fill="#ffffff" opacity="0.9" />

          {/* River Waves of Dhanshiri / Sugandha */}
          <path
            d="M12 70 Q30 64 50 70 T88 70"
            fill="none"
            stroke="url(#josWaterGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M16 80 Q32 75 50 80 T84 80"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Center JOS Letters */}
          <rect x="36" y="81" width="28" height="11" rx="4" fill="#047857" stroke="url(#josGoldGrad)" strokeWidth="1" />
          <text
            x="50"
            y="90"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7.5"
            fontWeight="bold"
            letterSpacing="0.8px"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            JOS
          </text>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`tracking-tight leading-tight ${currentSize.title} ${
                whiteText ? 'text-white' : 'text-emerald-950 font-bold'
              }`}
            >
              ঝালকাঠি অনলাইন সেবা
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
              JOS
            </span>
          </div>
          <span
            className={`font-medium ${currentSize.sub} ${
              whiteText ? 'text-emerald-200' : 'text-emerald-700'
            }`}
          >
            আপনার এলাকার সকল সেবা, এখন এক ঠিকানায়
          </span>
        </div>
      )}
    </div>
  );
};
