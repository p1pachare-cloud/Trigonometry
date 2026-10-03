// src/components/interactive/Clinometer.tsx
import React, { useState } from 'react';

interface ClinometerProps {
  initialAngle?: number;
  distanceMeters?: number;
  onAngleChange?: (angleDeg: number) => void;
  className?: string;
}

export const Clinometer: React.FC<ClinometerProps> = ({
  initialAngle = 32,
  distanceMeters = 50,
  onAngleChange,
  className = '',
}) => {
  const [angle, setAngle] = useState(initialAngle);

  const rad = (angle * Math.PI) / 180;
  const computedHeight = (distanceMeters * Math.tan(rad)).toFixed(1);

  const handleChange = (newAngle: number) => {
    const clamped = Math.max(5, Math.min(80, newAngle));
    setAngle(clamped);
    if (onAngleChange) onAngleChange(clamped);
  };

  return (
    <div className={`clinometer-container trig-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.15rem' }}>
          Virtual Surveyor's Clinometer
        </h4>
        <span className="side-pill side-pill-adj">
          Baseline Distance: {distanceMeters} m
        </span>
      </div>

      <div
        style={{
          background: 'var(--surface-inset)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 380 200"
          style={{ width: '100%', maxWidth: '360px', height: 'auto' }}
          role="img"
          aria-label={`Clinometer measuring elevation angle of ${angle} degrees.`}
        >
          {/* Ground datum */}
          <line x1="20" y1="170" x2="360" y2="170" stroke="var(--color-ink-deep)" strokeWidth="3" />
          <text x="30" y="190" fill="var(--text-muted)" fontSize="11">Ground Horizon (0°)</text>

          {/* Observer Stand */}
          <rect x="50" y="110" width="16" height="60" fill="var(--color-ink-soft)" rx="3" />
          <circle cx="58" cy="100" r="12" fill="var(--color-sunlight)" />

          {/* Sighting Telescope Ray (Rotates by angle) */}
          <g transform={`rotate(${-angle}, 58, 100)`}>
            {/* Theodolite Telescope */}
            <rect x="34" y="93" width="70" height="14" rx="4" fill="url(#brassGrad)" stroke="#4A3408" strokeWidth="2" />
            <line x1="104" y1="100" x2="360" y2="100" stroke="var(--color-side-opp)" strokeWidth="2.5" strokeDasharray="5 3" />
          </g>

          {/* Angle Arc */}
          <path
            d={`M 100 100 A 42 42 0 0 0 ${58 + 42 * Math.cos(rad)} ${100 - 42 * Math.sin(rad)}`}
            fill="none"
            stroke="var(--color-sunlight)"
            strokeWidth="3"
          />
          <text x="110" y="90" fill="var(--color-ink-deep)" fontWeight="800" fontSize="13">
            {angle}°
          </text>

          {/* Distant Target Tower */}
          <rect x="310" y={170 - Number(computedHeight) * 2} width="30" height={Number(computedHeight) * 2} fill="var(--color-zenith-blue)" rx="3" opacity="0.8" />
          <polygon points={`325,${155 - Number(computedHeight) * 2} 310,${170 - Number(computedHeight) * 2} 340,${170 - Number(computedHeight) * 2}`} fill="var(--color-sunlight)" />
        </svg>
      </div>

      {/* Tilt Controls */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
          <span>Aim Elevation Angle: <strong>{angle}°</strong></span>
          <span style={{ color: 'var(--color-side-opp)', fontWeight: 700 }}>Computed Height: {computedHeight} m</span>
        </div>
        <input
          type="range"
          min="10"
          max="70"
          value={angle}
          onChange={e => handleChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-sunlight)' }}
        />
      </div>
    </div>
  );
};
