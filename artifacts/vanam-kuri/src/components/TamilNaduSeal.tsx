import React, { useState } from 'react';

interface TamilNaduSealProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

/**
 * Official Tamil Nadu Government Seal Component
 * Displays the iconic Gopuram temple tower & Ashoka lion emblem with graceful fallback.
 */
export const TamilNaduSeal: React.FC<TamilNaduSealProps> = ({ 
  size = 40, 
  className = '',
  showText = false 
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative shrink-0 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-2xs border border-amber-500/30 p-0.5"
        style={{ width: size, height: size }}
      >
        {!imgError ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Seal_of_Tamil_Nadu.svg"
            alt="Seal of Tamil Nadu"
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
            crossOrigin="anonymous"
          />
        ) : (
          /* High-Fidelity SVG Fallback of Tamil Nadu State Seal */
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer golden circle */}
            <circle cx="50" cy="50" r="48" fill="#FFFDF8" stroke="#D97706" strokeWidth="3.5" />
            <circle cx="50" cy="50" r="43" fill="none" stroke="#006A4E" strokeWidth="1.5" strokeDasharray="2 1.5" />
            
            {/* Inner green disc */}
            <circle cx="50" cy="50" r="38" fill="#006A4E" opacity="0.08" />
            
            {/* Tamil Nadu Temple Gopuram (Tower) Silhouette */}
            <path 
              d="M50 18 L52 23 L55 24 L56 30 L59 31 L60 38 L62 39 L63 48 L65 49 L66 60 L34 60 L35 49 L37 48 L38 39 L40 38 L41 31 L44 30 L45 24 L48 23 Z" 
              fill="#006A4E" 
              stroke="#D97706" 
              strokeWidth="0.8"
            />
            {/* Gopuram Kalasams (Finials on top) */}
            <circle cx="50" cy="15" r="2.5" fill="#D97706" />
            <line x1="50" y1="15" x2="50" y2="18" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="45" cy="19" r="1.5" fill="#D97706" />
            <circle cx="55" cy="19" r="1.5" fill="#D97706" />

            {/* Gopuram entrance gate */}
            <path d="M46 60 L46 48 Q50 43 54 48 L54 60 Z" fill="#FFFDF8" />
            <path d="M48 60 L48 51 Q50 48 52 51 L52 60 Z" fill="#006A4E" />

            {/* Ashoka Lion Capital Emblem at bottom */}
            <rect x="42" y="64" width="16" height="4" rx="1" fill="#D97706" />
            <circle cx="50" cy="73" r="4" fill="#006A4E" stroke="#D97706" strokeWidth="1" />
            {/* Indian Flag Tri-color ribbon accent */}
            <path d="M30 80 Q50 76 70 80" stroke="#FF9933" strokeWidth="2" fill="none" />
            <path d="M30 83 Q50 79 70 83" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <path d="M30 86 Q50 82 70 86" stroke="#138808" strokeWidth="2" fill="none" />

            {/* Circular Text Tamil Nadu Government */}
            <text x="50" y="93" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#006A4E" fontFamily="sans-serif">
              தமிழ்நாடு அரசு
            </text>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className="font-extrabold text-xs tracking-tight text-slate-900">
            தமிழ்நாடு அரசு
          </span>
          <span className="text-[10px] font-semibold text-[#006A4E] tracking-wider uppercase">
            Govt. of Tamil Nadu
          </span>
        </div>
      )}
    </div>
  );
};
