// src/app/SunArc.tsx
import React from 'react';
import { useApp } from './state/AppContext';

export const SunArc: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { state } = useApp();
  const { phase, level } = state.nav;

  // Phase progress fraction in [0, 1]
  const phaseOrder = ['wonder', 'story', 'simulate', 'practice', 'boss'] as const;
  const currentIdx = phaseOrder.indexOf(phase as any);
  const progressFraction = Math.max(0.05, Math.min(0.95, (currentIdx + 0.5) / phaseOrder.length));

  // Sine Wave Geometry: width = 240, height = 44
  // y = 34 - sin(pi * p) * 22
  const width = 240;
  const sunX = progressFraction * width;
  const sunY = 34 - Math.sin(Math.PI * progressFraction) * 22;

  // Build SVG sine curve path
  let pathD = '';
  for (let x = 0; x <= width; x += 4) {
    const p = x / width;
    const y = 34 - Math.sin(Math.PI * p) * 22;
    pathD += `${x === 0 ? 'M' : 'L'} ${x} ${y} `;
  }

  return (
    <div
      className={`sun-arc-widget ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 12px',
        background: 'var(--surface-glass)',
        backdropFilter: 'var(--surface-glass-blur)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--surface-glass-border)',
      }}
    >
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-sunlight)' }}>
        ☀ Sun Arc:
      </span>

      <svg
        viewBox={`0 0 ${width} 44`}
        style={{ width: '130px', height: '28px', overflow: 'visible' }}
        role="img"
        aria-label={`Sun arc progress: phase ${phase} in level ${level}`}
      >
        {/* Sine Wave Arc Path */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-ink-muted)"
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.5"
        />

        {/* Traveling Golden Sun Indicator */}
        <circle
          cx={sunX}
          cy={sunY}
          r="6"
          fill="var(--color-sunlight)"
          stroke="#ffffff"
          strokeWidth="1.5"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(255,201,51,0.8))',
            transition: 'cx 0.4s ease-out, cy 0.4s ease-out',
          }}
        />
      </svg>
    </div>
  );
};
