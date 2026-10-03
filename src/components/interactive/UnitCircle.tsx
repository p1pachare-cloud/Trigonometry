// src/components/interactive/UnitCircle.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { degToRad, getQuadrant, getReferenceAngle, normalizeDegrees360 } from '../../engine/trigMath';

interface UnitCircleProps {
  initialAngle?: number;
  useRadians?: boolean;
  showProjections?: boolean;
  showReferenceFold?: boolean;
  onAngleChange?: (angleDeg: number) => void;
  className?: string;
}

export const UnitCircle: React.FC<UnitCircleProps> = ({
  initialAngle = 135,
  useRadians: _useRadians = false,
  showProjections = true,
  showReferenceFold = true,
  onAngleChange,
  className = '',
}) => {
  const [angleDeg, setAngleDeg] = useState(initialAngle);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const cx = 180;
  const cy = 180;
  const R = 130;

  const currentDeg = normalizeDegrees360(angleDeg);
  const rad = degToRad(currentDeg);
  const quadrant = getQuadrant(currentDeg);
  const refAngle = getReferenceAngle(currentDeg);

  // Cartesian coordinates of point P
  const px = cx + R * Math.cos(rad);
  const py = cy - R * Math.sin(rad);

  // Fold-back reference triangle in Quadrant 1
  const refRad = degToRad(refAngle);
  const refPx = cx + R * Math.cos(refRad);
  const refPy = cy - R * Math.sin(refRad);

  const cosVal = Math.cos(rad).toFixed(3);
  const sinVal = Math.sin(rad).toFixed(3);
  const tanVal = Math.abs(Math.cos(rad)) < 1e-4 ? 'undefined' : Math.tan(rad).toFixed(3);

  const updateAngleFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2);
    const y = (rect.top + rect.height / 2) - clientY; // SVG y points down
    let deg = Math.round((Math.atan2(y, x) * 180) / Math.PI);
    if (deg < 0) deg += 360;
    setAngleDeg(deg);
    if (onAngleChange) onAngleChange(deg);
  }, [onAngleChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    updateAngleFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateAngleFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = e.shiftKey ? 15 : 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = e.shiftKey ? -15 : -1;
    if (e.key === 'PageUp') delta = 90;
    if (e.key === 'PageDown') delta = -90;
    if (e.key === 'Home') {
      setAngleDeg(0);
      if (onAngleChange) onAngleChange(0);
      return;
    }

    if (delta !== 0) {
      e.preventDefault();
      const next = normalizeDegrees360(currentDeg + delta);
      setAngleDeg(next);
      if (onAngleChange) onAngleChange(next);
    }
  };

  useEffect(() => {
    setAngleDeg(initialAngle);
  }, [initialAngle]);

  return (
    <div className={`unit-circle-container trig-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.15rem' }}>
          The Unit Circle
        </h4>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className="side-pill side-pill-adj" style={{ fontSize: '0.8rem' }}>
            Quadrant {quadrant}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sunlight)' }}>
            Ref: {refAngle}°
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: 'var(--surface-inset)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          position: 'relative',
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 360 360"
          style={{ width: '100%', maxWidth: '320px', height: 'auto', touchAction: 'none', cursor: 'grab' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          tabIndex={0}
          role="slider"
          aria-label="Unit circle angle manipulator"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={currentDeg}
          aria-valuetext={`${currentDeg} degrees, Quadrant ${quadrant}, sine ${sinVal}, cosine ${cosVal}`}
          onKeyDown={handleKeyDown}
        >
          {/* Quadrant Tinting */}
          <rect x="180" y="20" width="160" height="160" fill="rgba(16, 185, 129, 0.05)" />
          <rect x="20" y="20" width="160" height="160" fill="rgba(255, 107, 107, 0.05)" />
          <rect x="20" y="180" width="160" height="160" fill="rgba(251, 191, 36, 0.05)" />
          <rect x="180" y="180" width="160" height="160" fill="rgba(5, 150, 105, 0.05)" />

          {/* ASTC Badges */}
          <text x="320" y="45" fill="var(--color-mint-primary)" fontWeight="800" fontSize="13">Q1: ALL (+)</text>
          <text x="35" y="45" fill="var(--color-coral-primary)" fontWeight="800" fontSize="13">Q2: SIN (+)</text>
          <text x="35" y="335" fill="var(--color-reward-yellow)" fontWeight="800" fontSize="13">Q3: TAN (+)</text>
          <text x="320" y="335" fill="var(--color-mint-dark)" fontWeight="800" fontSize="13">Q4: COS (+)</text>

          {/* Axes */}
          <line x1="20" y1={cy} x2="340" y2={cy} stroke="var(--color-ink-muted)" strokeWidth="1.5" />
          <line x1={cx} y1="20" x2={cx} y2="340" stroke="var(--color-ink-muted)" strokeWidth="1.5" />
          {/* Axis Labels */}
          <text x="345" y={cy + 4} fill="var(--color-ink-deep)" fontWeight="700" fontSize="12">x</text>
          <text x={cx - 4} y="15" fill="var(--color-ink-deep)" fontWeight="700" fontSize="12">y</text>

          {/* Main Unit Circle */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-ink-deep)" strokeWidth="2.5" />

          {/* Fold-back Reference Angle in Q1 (Ghost Triangle) */}
          {showReferenceFold && currentDeg > 90 && (
            <g opacity="0.35">
              <polygon
                points={`${cx},${cy} ${refPx},${cy} ${refPx},${refPy}`}
                fill="var(--color-reward-yellow)"
                stroke="var(--color-reward-yellow)"
                strokeDasharray="4 3"
              />
              <path
                d={`M ${cx + 30} ${cy} A 30 30 0 0 0 ${cx + 30 * Math.cos(refRad)} ${cy - 30 * Math.sin(refRad)}`}
                fill="none"
                stroke="var(--color-reward-yellow)"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Active Triangle Coordinates */}
          {showProjections && (
            <g>
              {/* Shaded Reference Triangle */}
              <polygon
                points={`${cx},${cy} ${px},${cy} ${px},${py}`}
                fill="rgba(16, 185, 129, 0.14)"
              />

              {/* Horizontal Cosine Projection (Adjacent) */}
              <line
                x1={cx}
                y1={cy}
                x2={px}
                y2={cy}
                stroke="var(--color-side-adj)"
                strokeWidth="4"
              />

              {/* Vertical Sine Projection (Opposite) */}
              <line
                x1={px}
                y1={cy}
                x2={px}
                y2={py}
                stroke="var(--color-side-opp)"
                strokeWidth="4"
                strokeDasharray="4 2"
              />
            </g>
          )}

          {/* Rotating Radius Arm (Hypotenuse = 1) */}
          <line
            x1={cx}
            y1={cy}
            x2={px}
            y2={py}
            stroke="var(--color-side-hyp)"
            strokeWidth="3.5"
          />

          {/* Interactive Point P */}
          <circle
            cx={px}
            cy={py}
            r="8"
            fill="var(--color-coral-primary)"
            stroke="var(--color-ink-deep)"
            strokeWidth="3"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(255,107,107,0.4))' }}
          />

          {/* Center Pivot */}
          <circle cx={cx} cy={cy} r="4" fill="var(--color-ink-deep)" />
        </svg>
      </div>

      {/* Coordinate & Value Readout Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginTop: '16px',
          textAlign: 'center',
        }}
      >
        <div className="trig-card" style={{ padding: '8px', borderTop: '3px solid var(--color-side-adj)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>cos {currentDeg}° (x)</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-side-adj)' }}>{cosVal}</div>
        </div>
        <div className="trig-card" style={{ padding: '8px', borderTop: '3px solid var(--color-side-opp)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>sin {currentDeg}° (y)</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-side-opp)' }}>{sinVal}</div>
        </div>
        <div className="trig-card" style={{ padding: '8px', borderTop: '3px solid var(--color-sunlight)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>tan {currentDeg}° (y/x)</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{tanVal}</div>
        </div>
      </div>
    </div>
  );
};
