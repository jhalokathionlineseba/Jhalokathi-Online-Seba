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
          src="/JOS_LOGO.gif" alt="Logo" />
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
