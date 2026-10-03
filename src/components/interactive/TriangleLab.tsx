// src/components/interactive/TriangleLab.tsx
import React, { useState } from 'react';
import { degToRad } from '../../engine/trigMath';

interface TriangleLabProps {
  initialTheta?: number;
  interactive?: boolean;
  activeVertex?: 'A' | 'B';
  highlightSide?: 'opp' | 'adj' | 'hyp' | null;
  onThetaChange?: (theta: number) => void;
  showRatios?: boolean;
  className?: string;
}

export const TriangleLab: React.FC<TriangleLabProps> = ({
  initialTheta = 35,
  interactive = true,
  activeVertex: controlledVertex,
  highlightSide = null,
  onThetaChange,
  showRatios = true,
  className = '',
}) => {
  const [internalTheta, setInternalTheta] = useState(initialTheta);
  const [internalVertex, setInternalVertex] = useState<'A' | 'B'>('A');

  const theta = internalTheta;
  const currentVertex = controlledVertex || internalVertex;

  // Geometry dimensions in SVG viewport 400x300
  // Right angle at C (320, 240)
  // Vertex A at bottom-left (80, 240)
  // Base length AC = 240
  // Height BC = 240 * tan(theta)
  const xA = 80;
  const yA = 240;
  const xC = 320;
  const yC = 240;

  // Compute height from theta at A
  const radA = degToRad(theta);
  const baseLen = 220;
  const heightLen = Math.max(30, Math.min(180, baseLen * Math.tan(radA)));
  const xB = xC;
  const yB = yC - heightLen;

  const hypLen = Math.sqrt(baseLen * baseLen + heightLen * heightLen);

  // When vertex is A:
  // Opposite = BC (vertical heightLen)
  // Adjacent = AC (horizontal baseLen)
  // Hypotenuse = AB
  // When vertex is B:
  // Opposite = AC (horizontal baseLen)
  // Adjacent = BC (vertical heightLen)
  const oppLen = currentVertex === 'A' ? heightLen : baseLen;
  const adjLen = currentVertex === 'A' ? baseLen : heightLen;

  const sinVal = (oppLen / hypLen).toFixed(3);
  const cosVal = (adjLen / hypLen).toFixed(3);
  const tanVal = (oppLen / adjLen).toFixed(3);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInternalTheta(val);
    if (onThetaChange) onThetaChange(val);
  };

  return (
    <div className={`triangle-lab-container trig-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.15rem' }}>
          Interactive Triangle Lab
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`trig-btn ${currentVertex === 'A' ? 'trig-btn-primary' : 'trig-btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.85rem' }}
            onClick={() => setInternalVertex('A')}
          >
            Focus: Angle A ({theta}°)
          </button>
          <button
            type="button"
            className={`trig-btn ${currentVertex === 'B' ? 'trig-btn-primary' : 'trig-btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.85rem' }}
            onClick={() => setInternalVertex('B')}
          >
            Focus: Angle B ({90 - theta}°)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ background: 'var(--surface-inset)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
        <svg
          viewBox="0 0 400 270"
          style={{ width: '100%', height: 'auto', maxHeight: '250px' }}
          role="figure"
          aria-label={`Right triangle ABC. Right angle at C. Angle A is ${theta} degrees.`}
        >
          {/* Subtle Grid Lines */}
          <line x1="80" y1="20" x2="80" y2="260" stroke="rgba(14,27,61,0.06)" strokeDasharray="4 4" />
          <line x1="20" y1="240" x2="380" y2="240" stroke="rgba(14,27,61,0.06)" strokeDasharray="4 4" />

          {/* Right Angle Box at C */}
          <path d="M304 240 L304 224 L320 224" fill="none" stroke="var(--color-ink-deep)" strokeWidth="2" />

          {/* Side AC (Horizontal) */}
          <line
            x1={xA}
            y1={yA}
            x2={xC}
            y2={yC}
            stroke={currentVertex === 'A' ? 'var(--color-side-adj)' : 'var(--color-side-opp)'}
            strokeWidth={highlightSide === (currentVertex === 'A' ? 'adj' : 'opp') ? 6 : 4}
            strokeDasharray={currentVertex === 'A' ? 'none' : '6 4'}
          />

          {/* Side BC (Vertical) */}
          <line
            x1={xC}
            y1={yC}
            x2={xB}
            y2={yB}
            stroke={currentVertex === 'A' ? 'var(--color-side-opp)' : 'var(--color-side-adj)'}
            strokeWidth={highlightSide === (currentVertex === 'A' ? 'opp' : 'adj') ? 6 : 4}
            strokeDasharray={currentVertex === 'A' ? '6 4' : 'none'}
          />

          {/* Side AB (Hypotenuse) */}
          <line
            x1={xA}
            y1={yA}
            x2={xB}
            y2={yB}
            stroke="var(--color-side-hyp)"
            strokeWidth={highlightSide === 'hyp' ? 6 : 4}
            strokeDasharray="2 3"
          />

          {/* Angle Arc at A */}
          <path
            d={`M 115 240 A 35 35 0 0 0 ${xA + 35 * Math.cos(radA)} ${yA - 35 * Math.sin(radA)}`}
            fill="none"
            stroke={currentVertex === 'A' ? 'var(--color-sunlight)' : 'rgba(14,27,61,0.3)'}
            strokeWidth={currentVertex === 'A' ? 3 : 1.5}
          />
          <text
            x="125"
            y="232"
            fill="var(--color-ink-deep)"
            fontWeight={currentVertex === 'A' ? '800' : '500'}
            fontSize="13"
          >
            {theta}°
          </text>

          {/* Angle Arc at B */}
          <path
            d={`M ${xB} ${yB + 28} A 28 28 0 0 1 ${xB - 28 * Math.sin(radA)} ${yB + 28 * Math.cos(radA)}`}
            fill="none"
            stroke={currentVertex === 'B' ? 'var(--color-sunlight)' : 'rgba(14,27,61,0.3)'}
            strokeWidth={currentVertex === 'B' ? 3 : 1.5}
          />
          <text
            x={xB - 24}
            y={yB + 40}
            fill="var(--color-ink-deep)"
            fontWeight={currentVertex === 'B' ? '800' : '500'}
            fontSize="13"
          >
            {90 - theta}°
          </text>

          {/* Vertex Nodes */}
          <circle cx={xA} cy={yA} r="5" fill="var(--color-zenith-blue)" />
          <text x={xA - 16} y={yA + 4} fill="var(--color-ink-deep)" fontWeight="700">A</text>

          <circle cx={xB} cy={yB} r="5" fill="var(--color-zenith-blue)" />
          <text x={xB + 8} y={yB - 4} fill="var(--color-ink-deep)" fontWeight="700">B</text>

          <circle cx={xC} cy={yC} r="5" fill="var(--color-ink-deep)" />
          <text x={xC + 10} y={yC + 16} fill="var(--color-ink-deep)" fontWeight="700">C</text>

          {/* Floating Side Labels */}
          {/* Hypotenuse Label */}
          <text
            x={(xA + xB) / 2 - 24}
            y={(yA + yB) / 2 - 12}
            fill="var(--color-side-hyp)"
            fontWeight="800"
            fontSize="13"
          >
            Hypotenuse (H)
          </text>

          {/* Vertical Side Label */}
          <text
            x={xC + 12}
            y={(yC + yB) / 2}
            fill={currentVertex === 'A' ? 'var(--color-side-opp)' : 'var(--color-side-adj)'}
            fontWeight="800"
            fontSize="13"
          >
            {currentVertex === 'A' ? 'Opposite (O)' : 'Adjacent (A)'}
          </text>

          {/* Horizontal Side Label */}
          <text
            x={(xA + xC) / 2 - 30}
            y={yC + 20}
            fill={currentVertex === 'A' ? 'var(--color-side-adj)' : 'var(--color-side-opp)'}
            fontWeight="800"
            fontSize="13"
          >
            {currentVertex === 'A' ? 'Adjacent (A)' : 'Opposite (O)'}
          </text>
        </svg>
      </div>

      {/* Slider Control */}
      {interactive && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
            <span>Adjust Angle θ: <strong>{theta}°</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>10° to 75°</span>
          </div>
          <input
            type="range"
            min="15"
            max="75"
            value={theta}
            onChange={handleSliderChange}
            aria-label="Angle theta slider"
            style={{ width: '100%', accentColor: 'var(--color-zenith-blue)', height: '8px', cursor: 'pointer' }}
          />
        </div>
      )}

      {/* Live Ratio Panel */}
      {showRatios && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          <div className="trig-card" style={{ padding: '8px', borderTop: '3px solid var(--color-side-opp)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>sin {currentVertex === 'A' ? theta : 90 - theta}° (O/H)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-side-opp)' }}>{sinVal}</div>
          </div>
          <div className="trig-card" style={{ padding: '8px', borderTop: '3px solid var(--color-side-adj)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>cos {currentVertex === 'A' ? theta : 90 - theta}° (A/H)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-side-adj)' }}>{cosVal}</div>
          </div>
          <div className="trig-card" style={{ padding: '8px', borderTop: '3px solid var(--color-sunlight)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>tan {currentVertex === 'A' ? theta : 90 - theta}° (O/A)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-ink-deep)' }}>{tanVal}</div>
          </div>
        </div>
      )}
    </div>
  );
};
