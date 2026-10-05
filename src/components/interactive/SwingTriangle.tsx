// src/components/interactive/SwingTriangle.tsx
import React, { useState, useRef, useCallback } from 'react';
import { solveAmbiguousCase, degToRad } from '../../engine/trigMath';
import { sound } from '../../app/audio';

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
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const result = solveAmbiguousCase(angleA, sideA, sideB);
  const radA = degToRad(angleA);
  const altitudeH = sideB * Math.sin(radA);

  // SVG dimensions: 500 x 240
  // Calibrated scale (9.0) and center coordinates so the continuous swinging arc,
  // vertices, and all labels remain 100% visible on screen with generous padding
  const scale = 9.0;
  const Ax = 115;
  const Ay = 135;
  const Cx = Ax + sideB * Math.cos(radA) * scale; // ~ 192.9
  const Cy = Ay - sideB * Math.sin(radA) * scale; // ~ 90.0

  const swingRadius = sideA * scale;

  // Law of Sines sine of angle B
  const sinB = (sideB * Math.sin(radA)) / sideA;

  // Handle direct dragging on SVG to change sideA
  const updateRadiusFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * 500;
    const svgY = ((clientY - rect.top) / rect.height) * 240;

    const dx = svgX - Cx;
    const dy = svgY - Cy;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const newSide = Math.max(3.5, Math.min(11.5, distPx / scale));
    setSideA(Number(newSide.toFixed(1)));
  }, [Cx, Cy, scale]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    updateRadiusFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateRadiusFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const setPreset = (val: number) => {
    sound.click();
    setSideA(val);
  };

  // Compute intersections of circle centered at (Cx, Cy) with baseline y = Ay
  const hasIntersections = sideA >= altitudeH - 1e-4;
  const dxIntersect = hasIntersections
    ? Math.sqrt(Math.max(0, swingRadius * swingRadius - (Ay - Cy) * (Ay - Cy)))
    : 0;

  const xIntersect1 = Cx + dxIntersect; // Acute triangle vertex B1
  const xIntersect2 = Cx - dxIntersect; // Obtuse triangle vertex B2

  // Single continuous, unbroken swinging arc that sweeps smoothly through the baseline:
  // Dynamically sweeps through baseline intersections with full padding inside the canvas
  let arcStartRad = (55 * Math.PI) / 180;
  let arcEndRad = (125 * Math.PI) / 180;

  if (hasIntersections) {
    const theta0 = Math.asin(Math.min(1, altitudeH / sideA));
    arcStartRad = Math.max(0.12, theta0 - 0.22);
    arcEndRad = Math.min(Math.PI - 0.12, (Math.PI - theta0) + 0.22);
  }

  const arcStartX = Cx + swingRadius * Math.cos(arcStartRad);
  const arcStartY = Cy + swingRadius * Math.sin(arcStartRad);
  const arcEndX = Cx + swingRadius * Math.cos(arcEndRad);
  const arcEndY = Cy + swingRadius * Math.sin(arcEndRad);

  return (
    <div
      className={`swing-triangle-container trig-card ${className}`}
      style={{
        padding: '12px 18px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header bar with Status Pill */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
            The Ambiguous Case (SSA) Arc
          </h4>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Fixed: ∠A = {angleA}°, b = {sideB} | Altitude h = {altitudeH.toFixed(1)}
          </span>
        </div>

        <span
          className="side-pill"
          style={{
            padding: '3px 10px',
            fontSize: '0.82rem',
            background:
              result.triangleCount === 2
                ? 'var(--color-sunlight-glow)'
                : result.triangleCount === 1
                ? 'var(--color-mint-light)'
                : 'var(--color-coral-light)',
            color:
              result.triangleCount === 2
                ? '#92400e'
                : result.triangleCount === 1
                ? 'var(--color-mint-dark)'
                : 'var(--color-coral-dark)',
            border: `1.5px solid ${
              result.triangleCount === 2
                ? 'var(--color-sunlight)'
                : result.triangleCount === 1
                ? 'var(--color-mint-primary)'
                : 'var(--color-coral-primary)'
            }`,
            fontWeight: 800,
          }}
        >
          {result.triangleCount === 0 && '❌ 0 Triangles (a < h)'}
          {result.triangleCount === 1 && (sideA < sideB ? '📐 1 Right Triangle (a = h)' : '✔ 1 Unique Triangle (a ≥ b)')}
          {result.triangleCount === 2 && '⚡ 2 Valid Triangles! (h < a < b)'}
        </span>
      </div>

      {/* Main 2-Column Responsive Body */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '14px',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Visual SVG Apparatus */}
        <div
          style={{
            background: 'var(--surface-inset)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            border: '1px solid var(--card-border)',
            position: 'relative',
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 500 240"
            style={{
              width: '100%',
              maxHeight: '250px',
              height: 'auto',
              display: 'block',
              touchAction: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="img"
            aria-label={`SSA visualizer: angle A ${angleA}°, side b ${sideB}, side a ${sideA}. ${result.triangleCount} triangles formed.`}
          >
            <defs>
              {/* Soft glow filter for swinging arc */}
              <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Triangle 1 (Acute) Shading */}
            {result.triangleCount >= 1 && xIntersect1 >= Ax && (
              <polygon
                points={`${Ax},${Ay} ${Cx},${Cy} ${xIntersect1},${Ay}`}
                fill="rgba(16, 185, 129, 0.12)"
                stroke="none"
              />
            )}

            {/* Triangle 2 (Obtuse) Shading */}
            {result.triangleCount === 2 && xIntersect2 >= Ax && (
              <polygon
                points={`${Ax},${Ay} ${Cx},${Cy} ${xIntersect2},${Ay}`}
                fill="rgba(255, 107, 107, 0.18)"
                stroke="none"
              />
            )}

            {/* Baseline */}
            <line x1="25" y1={Ay} x2="485" y2={Ay} stroke="var(--color-ink-deep)" strokeWidth="2.5" />
            <text x="445" y={Ay - 8} fill="var(--text-muted)" fontSize="11" fontWeight="600" textAnchor="middle">
              Baseline
            </text>

            {/* Altitude line (h = b * sin A) */}
            <line
              x1={Cx}
              y1={Cy}
              x2={Cx}
              y2={Ay}
              stroke="var(--color-coral-primary)"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            {/* Right Angle Box at foot of altitude */}
            <path
              d={`M ${Cx - 8} ${Ay} L ${Cx - 8} ${Ay - 8} L ${Cx} ${Ay - 8}`}
              fill="none"
              stroke="var(--color-coral-primary)"
              strokeWidth="1.5"
            />
            <text
              x={Cx + 6}
              y={(Cy + Ay) / 2 + 3}
              fill="var(--color-coral-dark)"
              fontWeight="800"
              fontSize="12"
            >
              h = {altitudeH.toFixed(1)}
            </text>

            {/* Fixed Side b (from A to C) */}
            <line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke="var(--color-side-hyp)" strokeWidth="4" />
            <text
              x={(Ax + Cx) / 2 - 18}
              y={(Ay + Cy) / 2 - 8}
              fill="var(--color-side-hyp)"
              fontWeight="800"
              fontSize="13"
            >
              b = {sideB}
            </text>

            {/* Angle A Arc & Label */}
            <path
              d={`M ${Ax + 26} ${Ay} A 26 26 0 0 0 ${Ax + 26 * Math.cos(radA)} ${Ay - 26 * Math.sin(radA)}`}
              fill="none"
              stroke="var(--color-sunlight)"
              strokeWidth="2.5"
            />
            <text x={Ax + 32} y={Ay - 6} fill="var(--color-ink-deep)" fontWeight="700" fontSize="12">
              {angleA}°
            </text>

            {/* Single Continuous Swinging Arc: fully visible, never cut */}
            <path
              d={`M ${arcStartX} ${arcStartY} A ${swingRadius} ${swingRadius} 0 0 1 ${arcEndX} ${arcEndY}`}
              fill="none"
              stroke="var(--color-sunlight)"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              filter="url(#arcGlow)"
              opacity="0.95"
            />

            {/* If 0 Triangles: Gap visualization showing side a too short */}
            {result.triangleCount === 0 && (
              <>
                <line
                  x1={Cx}
                  y1={Cy + swingRadius}
                  x2={Cx}
                  y2={Ay}
                  stroke="var(--color-error)"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
                <circle cx={Cx} cy={Cy + swingRadius} r="4.5" fill="var(--color-error)" />
                <text
                  x={Cx + 6}
                  y={Cy + swingRadius + 14}
                  fill="var(--color-error)"
                  fontSize="11"
                  fontWeight="700"
                >
                  Gap: {(altitudeH - sideA).toFixed(1)}
                </text>
              </>
            )}

            {/* Acute Triangle Side a (from C to B1) */}
            {hasIntersections && (
              <line
                x1={Cx}
                y1={Cy}
                x2={xIntersect1}
                y2={Ay}
                stroke="var(--color-side-opp)"
                strokeWidth="4"
              />
            )}

            {/* Obtuse Triangle Side a (from C to B2) if 2 triangles */}
            {result.triangleCount === 2 && (
              <line
                x1={Cx}
                y1={Cy}
                x2={xIntersect2}
                y2={Ay}
                stroke="var(--color-side-adj)"
                strokeWidth="4"
                strokeDasharray="6 3"
              />
            )}

            {/* Vertex A */}
            <circle cx={Ax} cy={Ay} r="5" fill="var(--color-zenith-blue)" />
            <text x={Ax - 16} y={Ay - 6} fill="var(--color-ink-deep)" fontWeight="800" fontSize="13">
              A
            </text>

            {/* Vertex C */}
            <circle cx={Cx} cy={Cy} r="6" fill="var(--color-side-hyp)" />
            <text x={Cx} y={Cy - 12} textAnchor="middle" fill="var(--color-ink-deep)" fontWeight="800" fontSize="14">
              C
            </text>

            {/* Vertex B1 (Acute Triangle) */}
            {hasIntersections && (
              <>
                <circle cx={xIntersect1} cy={Ay} r="5.5" fill="var(--color-side-opp)" />
                <text
                  x={xIntersect1}
                  y={Ay + 20}
                  textAnchor="middle"
                  fill="var(--color-side-opp)"
                  fontWeight="800"
                  fontSize="13"
                >
                  {result.triangleCount === 2 ? 'B₁' : 'B'}
                </text>
              </>
            )}

            {/* Vertex B2 (Obtuse Triangle) */}
            {result.triangleCount === 2 && (
              <>
                <circle cx={xIntersect2} cy={Ay} r="5.5" fill="var(--color-side-adj)" />
                <text
                  x={xIntersect2}
                  y={Ay + 20}
                  textAnchor="middle"
                  fill="var(--color-side-adj)"
                  fontWeight="800"
                  fontSize="13"
                >
                  B₂
                </text>
              </>
            )}

            {/* Discarded exterior root marker when a >= b */}
            {sideA >= sideB && hasIntersections && (
              <>
                <circle cx={xIntersect2} cy={Ay} r="4" fill="none" stroke="var(--text-muted)" strokeDasharray="2 2" />
                <text
                  x={xIntersect2}
                  y={Ay + 18}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontWeight="600"
                  fontSize="10"
                >
                  Outside Δ
                </text>
              </>
            )}

            {/* Drag Handle Label Hint */}
            <text
              x="16"
              y="20"
              fill="var(--text-muted)"
              fontSize="11"
              fontWeight="600"
            >
              ✋ Drag tip or use slider on right
            </text>
          </svg>
        </div>

        {/* Right Column: Interactive Controls & Mathematical Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Quick Scenario Preset Buttons */}
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              QUICK EXPERIMENT PRESETS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              <button
                type="button"
                className="trig-btn trig-btn-secondary"
                style={{
                  padding: '4px 6px',
                  fontSize: '0.78rem',
                  background: sideA === 4 ? 'var(--color-coral-light)' : undefined,
                  borderColor: sideA === 4 ? 'var(--color-coral-primary)' : undefined,
                  fontWeight: sideA === 4 ? 800 : 600,
                }}
                onClick={() => setPreset(4)}
              >
                a = 4 (0 Δ)
              </button>
              <button
                type="button"
                className="trig-btn trig-btn-secondary"
                style={{
                  padding: '4px 6px',
                  fontSize: '0.78rem',
                  background: sideA === 5 ? 'var(--color-mint-light)' : undefined,
                  borderColor: sideA === 5 ? 'var(--color-mint-primary)' : undefined,
                  fontWeight: sideA === 5 ? 800 : 600,
                }}
                onClick={() => setPreset(5)}
              >
                a = 5 (1 Right)
              </button>
              <button
                type="button"
                className="trig-btn trig-btn-secondary"
                style={{
                  padding: '4px 6px',
                  fontSize: '0.78rem',
                  background: sideA === 7 ? 'var(--color-sunlight-glow)' : undefined,
                  borderColor: sideA === 7 ? 'var(--color-sunlight)' : undefined,
                  fontWeight: sideA === 7 ? 800 : 600,
                }}
                onClick={() => setPreset(7)}
              >
                a = 7 (2 Δs)
              </button>
              <button
                type="button"
                className="trig-btn trig-btn-secondary"
                style={{
                  padding: '4px 6px',
                  fontSize: '0.78rem',
                  background: sideA === 11 ? 'var(--color-mint-light)' : undefined,
                  borderColor: sideA === 11 ? 'var(--color-mint-primary)' : undefined,
                  fontWeight: sideA === 11 ? 800 : 600,
                }}
                onClick={() => setPreset(11)}
              >
                a = 11 (1 Δ)
              </button>
            </div>
          </div>

          {/* Slider for Side a */}
          <div
            style={{
              background: 'var(--surface-inset)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--card-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '3px' }}>
              <span>
                Swinging Side length <strong>a = {sideA}</strong>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                h = {altitudeH.toFixed(1)}, b = {sideB}
              </span>
            </div>
            <input
              type="range"
              min="3.5"
              max="12.0"
              step="0.1"
              value={sideA}
              onChange={e => {
                setSideA(Number(e.target.value));
              }}
              style={{ width: '100%', accentColor: 'var(--color-side-opp)', cursor: 'pointer' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              <span>a &lt; 5.0 (0 Δ)</span>
              <span>a = 5.0 (1 Δ)</span>
              <span>5.0 &lt; a &lt; 10 (2 Δs)</span>
              <span>a &ge; 10 (1 Δ)</span>
            </div>
          </div>

          {/* Real-Time Mathematical Insight Box */}
          <div
            style={{
              fontSize: '0.82rem',
              lineHeight: 1.35,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background:
                result.triangleCount === 2
                  ? 'rgba(251, 191, 36, 0.12)'
                  : result.triangleCount === 1
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(255, 107, 107, 0.1)',
              borderLeft: `3.5px solid ${
                result.triangleCount === 2
                  ? 'var(--color-sunlight)'
                  : result.triangleCount === 1
                  ? 'var(--color-mint-primary)'
                  : 'var(--color-coral-primary)'
              }`,
            }}
          >
            {result.triangleCount === 0 && (
              <div>
                <strong>Side is too short to reach the ground:</strong>
                <div>
                  a ({sideA}) &lt; h ({altitudeH.toFixed(1)}). The swinging arc dangles in mid-air. sin B = {sinB.toFixed(2)} &gt; 1 (impossible)!
                </div>
              </div>
            )}

            {result.triangleCount === 1 && sideA < sideB && (
              <div>
                <strong>Tangent Touch (Right Triangle):</strong>
                <div>
                  a ({sideA}) = h ({altitudeH.toFixed(1)}). The arc grazes the baseline tangentially at exactly 90°, forming 1 unique right triangle.
                </div>
              </div>
            )}

            {result.triangleCount === 2 && (
              <div>
                <strong>The Ambiguous Case in action:</strong>
                <div>
                  h ({altitudeH.toFixed(1)}) &lt; a ({sideA}) &lt; b ({sideB}). The arc cuts the baseline in two places:
                </div>
                <div style={{ marginTop: '2px', display: 'flex', gap: '10px', fontWeight: 700 }}>
                  <span style={{ color: 'var(--color-side-opp)' }}>
                    Acute B₁ = {result.triangles[0].angleB.toFixed(1)}°
                  </span>
                  <span style={{ color: 'var(--color-side-adj)' }}>
                    Obtuse B₂ = {result.triangles[1].angleB.toFixed(1)}°
                  </span>
                </div>
              </div>
            )}

            {result.triangleCount === 1 && sideA >= sideB && (
              <div>
                <strong>Single Triangle:</strong>
                <div>
                  a ({sideA}) &ge; b ({sideB}). The arc only intersects the forward baseline once (the other intersection is behind vertex A, where angle A is reversed).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
