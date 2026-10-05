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

  // SVG dimensions: 460 x 235
  // Gracefully scaled so diagram is larger and clearer while fitting within viewport
  const scale = 15.5;
  const Ax = 45;
  const Ay = 192;
  const Cx = Ax + sideB * Math.cos(radA) * scale; // ~ 179.2
  const Cy = Ay - sideB * Math.sin(radA) * scale; // ~ 114.5

  const swingRadius = sideA * scale;

  // Law of Sines sine of angle B
  const sinB = (sideB * Math.sin(radA)) / sideA;

  // Handle direct dragging on SVG to change sideA
  const updateRadiusFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * 460;
    const svgY = ((clientY - rect.top) / rect.height) * 235;

    const dx = svgX - Cx;
    const dy = svgY - Cy;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const newSide = Math.max(3.5, Math.min(13, distPx / scale));
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

  // Angles for the visual swinging arc (sweeping downward across baseline)
  const arcStartRad = (18 * Math.PI) / 180;
  const arcEndRad = (162 * Math.PI) / 180;
  const arcStartX = Cx + swingRadius * Math.cos(arcStartRad);
  const arcStartY = Cy + swingRadius * Math.sin(arcStartRad);
  const arcEndX = Cx + swingRadius * Math.cos(arcEndRad);
  const arcEndY = Cy + swingRadius * Math.sin(arcEndRad);

  return (
    <div
      className={`swing-triangle-container trig-card ${className}`}
      style={{
        padding: '18px 22px',
        maxHeight: '100%',
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
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
            The Ambiguous Case (SSA) Arc
          </h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Fixed: ∠A = {angleA}°, b = {sideB} | Altitude h = {altitudeH.toFixed(1)}
          </span>
        </div>

        <span
          className="side-pill"
          style={{
            padding: '4px 12px',
            fontSize: '0.85rem',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '18px',
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
            viewBox="0 0 460 235"
            style={{
              width: '100%',
              maxHeight: '275px',
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
            <line x1="20" y1={Ay} x2="440" y2={Ay} stroke="var(--color-ink-deep)" strokeWidth="2.5" />
            <text x="385" y={Ay + 18} fill="var(--text-muted)" fontSize="12" fontWeight="600">
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
              y={(Cy + Ay) / 2 + 4}
              fill="var(--color-coral-dark)"
              fontWeight="800"
              fontSize="12"
            >
              h = {altitudeH.toFixed(1)}
            </text>

            {/* Fixed Side b (from A to C) */}
            <line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke="var(--color-side-hyp)" strokeWidth="4" />
            <text
              x={(Ax + Cx) / 2 - 20}
              y={(Ay + Cy) / 2 - 10}
              fill="var(--color-side-hyp)"
              fontWeight="800"
              fontSize="13"
            >
              b = {sideB}
            </text>

            {/* Angle A Arc & Label */}
            <path
              d={`M ${Ax + 32} ${Ay} A 32 32 0 0 0 ${Ax + 32 * Math.cos(radA)} ${Ay - 32 * Math.sin(radA)}`}
              fill="none"
              stroke="var(--color-sunlight)"
              strokeWidth="2.5"
            />
            <text x={Ax + 36} y={Ay - 8} fill="var(--color-ink-deep)" fontWeight="700" fontSize="12">
              {angleA}°
            </text>

            {/* Swinging Arc (sweeping downward) */}
            <path
              d={`M ${arcStartX} ${arcStartY} A ${swingRadius} ${swingRadius} 0 0 1 ${arcEndX} ${arcEndY}`}
              fill="none"
              stroke="var(--color-sunlight)"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              filter="url(#arcGlow)"
              opacity="0.85"
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
            <text x={Ax - 16} y={Ay + 5} fill="var(--color-ink-deep)" fontWeight="800" fontSize="13">
              A
            </text>

            {/* Vertex C */}
            <circle cx={Cx} cy={Cy} r="6" fill="var(--color-side-hyp)" />
            <text x={Cx - 4} y={Cy - 10} fill="var(--color-ink-deep)" fontWeight="800" fontSize="14">
              C
            </text>

            {/* Vertex B1 (Acute Triangle) */}
            {hasIntersections && (
              <>
                <circle cx={xIntersect1} cy={Ay} r="5.5" fill="var(--color-side-opp)" />
                <text
                  x={xIntersect1 - 5}
                  y={Ay + 18}
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
                  x={xIntersect2 - 5}
                  y={Ay + 18}
                  fill="var(--color-side-adj)"
                  fontWeight="800"
                  fontSize="13"
                >
                  B₂
                </text>
              </>
            )}

            {/* Drag Handle Label Hint */}
            <text
              x="20"
              y="22"
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
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
              QUICK EXPERIMENT PRESETS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              <button
                type="button"
                className="trig-btn trig-btn-secondary"
                style={{
                  padding: '5px 8px',
                  fontSize: '0.8rem',
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
                  padding: '5px 8px',
                  fontSize: '0.8rem',
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
                  padding: '5px 8px',
                  fontSize: '0.8rem',
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
                  padding: '5px 8px',
                  fontSize: '0.8rem',
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
              padding: '11px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--card-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
              <span>
                Swinging Side length <strong>a = {sideA}</strong>
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                h = {altitudeH.toFixed(1)}, b = {sideB}
              </span>
            </div>
            <input
              type="range"
              min="3.5"
              max="13"
              step="0.2"
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
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                marginTop: '3px',
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
              fontSize: '0.85rem',
              lineHeight: 1.4,
              padding: '10px 14px',
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
