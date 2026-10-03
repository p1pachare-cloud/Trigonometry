// src/components/interactive/SwingTriangle.tsx
import React, { useState } from 'react';
import { solveAmbiguousCase, degToRad } from '../../engine/trigMath';

interface SwingTriangleProps {
  initialA?: number; // angle A
  initialSideB?: number; // side b
  className?: string;
}

export const SwingTriangle: React.FC<SwingTriangleProps> = ({
  initialA = 30,
  initialSideB = 10,
  className = '',
}) => {
  const [angleA] = useState(initialA);
  const [sideB] = useState(initialSideB);
  const [sideA, setSideA] = useState(7); // starts in ambiguous 2-triangle case

  const result = solveAmbiguousCase(angleA, sideA, sideB);
  const radA = degToRad(angleA);
  const altitudeH = sideB * Math.sin(radA);

  // SVG dimensions 380 x 240
  // Vertex A at (50, 200)
  // Baseline along y = 200
  // Vertex C is at (50 + sideB * cos(radA) * 18, 200 - sideB * sin(radA) * 18)
  const scale = 18;
  const Ax = 50;
  const Ay = 200;
  const Cx = Ax + sideB * Math.cos(radA) * scale;
  const Cy = Ay - sideB * Math.sin(radA) * scale;

  const swingRadius = sideA * scale;

  return (
    <div className={`swing-triangle-container trig-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.15rem' }}>
          The Ambiguous Case (SSA) Arc
        </h4>
        <span
          className="side-pill"
          style={{
            background: result.triangleCount === 2 ? 'var(--color-sunlight-glow)' : 'var(--surface-card)',
            border: `1.5px solid ${result.triangleCount === 2 ? 'var(--color-sunlight)' : 'var(--color-zenith-blue)'}`,
            fontWeight: 800,
          }}
        >
          {result.triangleCount === 0 && '❌ 0 Triangles (Side too short)'}
          {result.triangleCount === 1 && '✔ 1 Unique Triangle'}
          {result.triangleCount === 2 && '⚡ 2 Valid Triangles!'}
        </span>
      </div>

      <div style={{ background: 'var(--surface-inset)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
        <svg
          viewBox="0 0 380 230"
          style={{ width: '100%', height: 'auto' }}
          role="img"
          aria-label={`SSA triangle visualizer: angle A ${angleA} degrees, side b ${sideB}, side a ${sideA}. Result: ${result.triangleCount} triangles.`}
        >
          {/* Baseline */}
          <line x1="20" y1={Ay} x2="360" y2={Ay} stroke="var(--color-ink-deep)" strokeWidth="2.5" />
          <text x="320" y={Ay + 18} fill="var(--text-muted)" fontSize="11">Baseline</text>

          {/* Side b (from A to C) */}
          <line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke="var(--color-side-hyp)" strokeWidth="3.5" />
          <text x={(Ax + Cx) / 2 - 18} y={(Ay + Cy) / 2 - 8} fill="var(--color-side-hyp)" fontWeight="800" fontSize="12">
            b = {sideB}
          </text>

          {/* Dotted Altitude (h = b * sin A) */}
          <line x1={Cx} y1={Cy} x2={Cx} y2={Ay} stroke="var(--color-error)" strokeWidth="2" strokeDasharray="3 3" />
          <text x={Cx + 6} y={(Cy + Ay) / 2} fill="var(--color-error)" fontWeight="700" fontSize="11">
            h = {altitudeH.toFixed(1)}
          </text>

          {/* Swinging Arc of radius sideA from C */}
          <circle
            cx={Cx}
            cy={Cy}
            r={swingRadius}
            fill="none"
            stroke="var(--color-sunlight)"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.7"
          />

          {/* Triangle 1 (Acute) if exists */}
          {result.triangles[0] && (
            <line
              x1={Cx}
              y1={Cy}
              x2={Ax + result.triangles[0].sideC * scale}
              y2={Ay}
              stroke="var(--color-side-opp)"
              strokeWidth="3.5"
            />
          )}

          {/* Triangle 2 (Obtuse) if exists */}
          {result.triangles[1] && (
            <line
              x1={Cx}
              y1={Cy}
              x2={Ax + result.triangles[1].sideC * scale}
              y2={Ay}
              stroke="var(--color-side-adj)"
              strokeWidth="3.5"
              strokeDasharray="5 3"
            />
          )}

          {/* Angle A Arc */}
          <path
            d={`M 85 ${Ay} A 35 35 0 0 0 ${Ax + 35 * Math.cos(radA)} ${Ay - 35 * Math.sin(radA)}`}
            fill="none"
            stroke="var(--color-sunlight)"
            strokeWidth="2.5"
          />
          <text x="92" y={Ay - 10} fill="var(--color-ink-deep)" fontWeight="700" fontSize="12">{angleA}°</text>

          {/* Vertex A and C */}
          <circle cx={Ax} cy={Ay} r="4" fill="var(--color-zenith-blue)" />
          <text x={Ax - 16} y={Ay + 4} fill="var(--color-ink-deep)" fontWeight="700">A</text>

          <circle cx={Cx} cy={Cy} r="5" fill="var(--color-side-hyp)" />
          <text x={Cx - 4} y={Cy - 10} fill="var(--color-ink-deep)" fontWeight="700">C</text>
        </svg>
      </div>

      {/* Side A Slider */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
          <span>Swing Side length (a): <strong>{sideA}</strong></span>
          <span style={{ color: 'var(--text-muted)' }}>
            h = {altitudeH.toFixed(1)}, b = {sideB}
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="14"
          step="0.5"
          value={sideA}
          onChange={e => setSideA(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-side-opp)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>a &lt; h (0 triangles)</span>
          <span>h &lt; a &lt; b (2 triangles)</span>
          <span>a &ge; b (1 triangle)</span>
        </div>
      </div>
    </div>
  );
};
