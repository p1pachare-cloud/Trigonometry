// src/components/mascot/Theo.tsx
import React from 'react';

export type TheoMood = 'idle' | 'curious' | 'measuring' | 'thinking' | 'encouraging' | 'celebrating';

interface TheoProps {
  mood?: TheoMood;
  size?: number;
  speechText?: string;
  className?: string;
}

export const Theo: React.FC<TheoProps> = ({
  mood = 'idle',
  size = 120,
  speechText,
  className = '',
}) => {
  // Mood parameters
  let eyeTilt = 0;
  let eyeGlow = '#FFC933';
  let bubblePos = 0;
  let bodyAnim = '';

  switch (mood) {
    case 'curious':
      eyeTilt = -15;
      eyeGlow = '#60A5FA';
      bubblePos = -4;
      break;
    case 'measuring':
      eyeTilt = 10;
      eyeGlow = '#10B981';
      bubblePos = 0;
      break;
    case 'thinking':
      eyeTilt = -5;
      eyeGlow = '#F59E0B';
      bubblePos = 3;
      break;
    case 'encouraging':
      eyeTilt = 0;
      eyeGlow = '#F472B6';
      bubblePos = 0;
      break;
    case 'celebrating':
      eyeTilt = 12;
      eyeGlow = '#FFD700';
      bubblePos = 0;
      bodyAnim = 'float-bob';
      break;
    default:
      eyeTilt = 0;
      eyeGlow = '#FFC933';
      bubblePos = 0;
      break;
  }

  return (
    <div className={`theo-container ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={bodyAnim}
        style={{ overflow: 'visible', filter: 'drop-shadow(0 8px 16px rgba(14,27,61,0.2))' }}
        role="img"
        aria-label={`Theo the Theodolite Robot, looking ${mood}`}
      >
        <defs>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D061" />
            <stop offset="50%" stopColor="#D49B24" />
            <stop offset="100%" stopColor="#9C6B0D" />
          </linearGradient>
          <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor={eyeGlow} />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <radialGradient id="glowFilter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={eyeGlow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={eyeGlow} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Light Halo */}
        <circle cx="80" cy="70" r="45" fill="url(#glowFilter)" />

        {/* Tripod Legs */}
        <path d="M50 148 L76 104 L84 104 L110 148" stroke="#4A3B18" strokeWidth="6" strokeLinecap="round" />
        <path d="M80 104 L80 152" stroke="#6B5422" strokeWidth="6" strokeLinecap="round" />
        {/* Brass Tripod Shoes */}
        <circle cx="50" cy="148" r="4" fill="#D49B24" />
        <circle cx="80" cy="152" r="4" fill="#D49B24" />
        <circle cx="110" cy="148" r="4" fill="#D49B24" />

        {/* Base Turntable & Azimuth Dial */}
        <ellipse cx="80" cy="104" rx="28" ry="10" fill="url(#brassGrad)" stroke="#5B4010" strokeWidth="2" />
        <line x1="62" y1="104" x2="62" y2="101" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="80" y1="104" x2="80" y2="100" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="98" y1="104" x2="98" y2="101" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Theodolite Fork Standards */}
        <path d="M60 102 L60 68 Q60 62 66 62 L70 62 L70 100 Z" fill="url(#brassGrad)" stroke="#5B4010" strokeWidth="1.5" />
        <path d="M100 102 L100 68 Q100 62 94 62 L90 62 L90 100 Z" fill="url(#brassGrad)" stroke="#5B4010" strokeWidth="1.5" />

        {/* Tilting Telescope Barrel & Eyepiece */}
        <g transform={`rotate(${eyeTilt}, 80, 68)`} style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          {/* Main Barrel */}
          <rect x="52" y="58" width="56" height="20" rx="6" fill="url(#brassGrad)" stroke="#4A3408" strokeWidth="2" />
          <rect x="42" y="61" width="12" height="14" rx="3" fill="#8C5E09" />
          {/* Objective Lens Hood */}
          <path d="M106 55 L118 52 L118 84 L106 81 Z" fill="#D49B24" stroke="#4A3408" strokeWidth="1.5" />
          {/* Glowing Lens Glass */}
          <ellipse cx="117" cy="68" rx="4" ry="14" fill="url(#lensGrad)" />
          {/* Lens Specular Reflection */}
          <ellipse cx="117" cy="63" rx="1.5" ry="4" fill="#FFFFFF" opacity="0.8" />

          {/* Spirit Bubble Level on Top of Barrel */}
          <rect x="66" y="50" width="28" height="7" rx="3.5" fill="#E2E8F0" stroke="#4A3408" strokeWidth="1.5" />
          <circle cx={80 + bubblePos} cy="53.5" r="2.5" fill="#10B981" />
        </g>

        {/* Brass Vernier Adjustment Knobs */}
        <circle cx="56" cy="78" r="4.5" fill="#FFE27A" stroke="#7A530E" strokeWidth="1.5" />
        <circle cx="104" cy="78" r="4.5" fill="#FFE27A" stroke="#7A530E" strokeWidth="1.5" />
      </svg>

      {/* Optional Speech Bubble */}
      {speechText && (
        <div
          className="trig-card"
          style={{
            marginTop: '8px',
            padding: '10px 14px',
            maxWidth: '280px',
            fontSize: '0.9rem',
            lineHeight: 1.35,
            borderLeft: '4px solid var(--color-sunlight)',
            background: 'var(--card-bg)',
          }}
        >
          {speechText}
        </div>
      )}
    </div>
  );
};
