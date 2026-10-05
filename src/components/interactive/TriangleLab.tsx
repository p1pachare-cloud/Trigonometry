// src/components/interactive/TriangleLab.tsx
import React, { useState, useRef, useCallback } from 'react';
import { degToRad } from '../../engine/trigMath';
import { sound } from '../../app/audio';

interface TriangleLabProps {
  initialTheta?: number;
  interactive?: boolean;
  activeVertex?: 'A' | 'B';
  highlightSide?: 'opp' | 'adj' | 'hyp' | null;
  onThetaChange?: (theta: number) => void;
  showRatios?: boolean;
  stationId?: string; // '1A' | '1B' | '1C'
  onProceedToFormalise?: () => void;
  className?: string;
}

export const TriangleLab: React.FC<TriangleLabProps> = ({
  initialTheta = 35,
  interactive = true,
  activeVertex: controlledVertex,
  highlightSide = null,
  onThetaChange,
  showRatios = true,
  stationId = '1A',
  onProceedToFormalise,
  className = '',
}) => {
  const [internalTheta, setInternalTheta] = useState(initialTheta);
  const [internalVertex, setInternalVertex] = useState<'A' | 'B'>('A');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const theta = internalTheta;
  const currentVertex = controlledVertex || internalVertex;

  // Geometry dimensions in SVG viewport 440 x 245
  // Fixed Hypotenuse H = 210, Vertex A at (55, 215)
  // Vertex C is at (55 + H * cos(theta), 215)
  // Vertex B is at (55 + H * cos(theta), 215 - H * sin(theta))
  // This ensures the triangle morphs continuously without ANY clipping or clamping!
  const H = 205;
  const xA = 55;
  const yA = 215;

  const radA = degToRad(theta);
  const baseLen = H * Math.cos(radA);
  const heightLen = H * Math.sin(radA);

  const xC = xA + baseLen;
  const yC = yA;
  const xB = xC;
  const yB = yA - heightLen;

  // Exact mathematical ratios relative to focus vertex
  const sinVal = (currentVertex === 'A' ? Math.sin(radA) : Math.cos(radA)).toFixed(3);
  const cosVal = (currentVertex === 'A' ? Math.cos(radA) : Math.sin(radA)).toFixed(3);
  const tanVal = (currentVertex === 'A' ? Math.tan(radA) : 1 / Math.tan(radA)).toFixed(3);

  // Exact radical lookup for special angles (Station 1C)
  const getExactLabel = (angle: number) => {
    if (angle === 30) return { sin: '1/2', cos: '√3/2', tan: '1/√3' };
    if (angle === 45) return { sin: '√2/2', cos: '√2/2', tan: '1' };
    if (angle === 60) return { sin: '√3/2', cos: '1/2', tan: '√3' };
    return null;
  };
  const exactRatios = getExactLabel(currentVertex === 'A' ? theta : 90 - theta);

  const updateAngle = (newTheta: number) => {
    const clamped = Math.max(15, Math.min(75, Math.round(newTheta)));
    setInternalTheta(clamped);
    setHasInteracted(true);
    if (onThetaChange) onThetaChange(clamped);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAngle(Number(e.target.value));
  };

  // Direct pointer drag on SVG to rotate the angle
  const updateAngleFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * 440;
    const svgY = ((clientY - rect.top) / rect.height) * 245;

    const dx = svgX - xA;
    const dy = yA - svgY;
    if (dx <= 0) return;

    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    updateAngle(angleDeg);
  }, [xA, yA]);

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
      // ignore
    }
  };

  const setPreset = (val: number) => {
    sound.click();
    updateAngle(val);
  };

  const isShadowLab = stationId === '1A';
  const isSpecialAngleForge = stationId === '1C';

  return (
    <div
      className={`triangle-lab-container trig-card ${className}`}
      style={{ padding: '18px 22px', boxSizing: 'border-box' }}
    >
      {/* Header bar with controls */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
            {isShadowLab ? '☀️ The Shadow Lab' : isSpecialAngleForge ? '⚡ Special Angle Forge' : 'Interactive Triangle Lab'}
          </h4>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Hypotenuse H = 100% | Angle θ = {theta}°
          </span>
        </div>

        {/* Focus Selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`trig-btn ${currentVertex === 'A' ? 'trig-btn-primary' : 'trig-btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.82rem' }}
            onClick={() => {
              sound.click();
              setInternalVertex('A');
            }}
          >
            Focus: Angle A ({theta}°)
          </button>
          <button
            type="button"
            className={`trig-btn ${currentVertex === 'B' ? 'trig-btn-primary' : 'trig-btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.82rem' }}
            onClick={() => {
              sound.click();
              setInternalVertex('B');
            }}
          >
            Focus: Angle B ({90 - theta}°)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
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
          viewBox="0 0 440 245"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '260px',
            display: 'block',
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="figure"
          aria-label={`Right triangle ABC. Angle A is ${theta} degrees. Vertex B height is dynamic.`}
        >
          {/* Subtle grid ground baseline */}
          <line x1="20" y1={yA} x2="420" y2={yA} stroke="var(--color-ink-deep)" strokeWidth="2.5" />
          <line x1={xA} y1="20" x2={xA} y2="235" stroke="rgba(14,27,61,0.08)" strokeDasharray="3 3" />

          {/* Right Angle Square Box at C */}
          <path
            d={`M ${xC - 10} ${yC} L ${xC - 10} ${yC - 10} L ${xC} ${yC - 10}`}
            fill="none"
            stroke="var(--color-ink-deep)"
            strokeWidth="2"
          />

          {/* Shaded triangle fill */}
          <polygon
            points={`${xA},${yA} ${xC},${yC} ${xB},${yB}`}
            fill={isShadowLab ? 'rgba(251, 191, 36, 0.12)' : 'rgba(16, 185, 129, 0.12)'}
            stroke="none"
          />

          {/* Shadow Ground Texture in Station 1A */}
          {isShadowLab && (
            <rect
              x={xA}
              y={yA}
              width={baseLen}
              height="8"
              fill="rgba(14, 27, 61, 0.15)"
              rx="2"
            />
          )}

          {/* Side AC (Horizontal Adjacent) */}
          <line
            x1={xA}
            y1={yA}
            x2={xC}
            y2={yC}
            stroke={currentVertex === 'A' ? 'var(--color-side-adj)' : 'var(--color-side-opp)'}
            strokeWidth={highlightSide === (currentVertex === 'A' ? 'adj' : 'opp') ? 6 : 4.5}
            strokeDasharray={currentVertex === 'A' ? 'none' : '6 4'}
          />

          {/* Side BC (Vertical Opposite) */}
          <line
            x1={xC}
            y1={yC}
            x2={xB}
            y2={yB}
            stroke={currentVertex === 'A' ? 'var(--color-side-opp)' : 'var(--color-side-adj)'}
            strokeWidth={highlightSide === (currentVertex === 'A' ? 'opp' : 'adj') ? 6 : 4.5}
            strokeDasharray={currentVertex === 'A' ? '6 4' : 'none'}
          />

          {/* Side AB (Hypotenuse / Sunbeam) */}
          <line
            x1={xA}
            y1={yA}
            x2={xB}
            y2={yB}
            stroke={isShadowLab ? 'var(--color-sunlight)' : 'var(--color-side-hyp)'}
            strokeWidth={highlightSide === 'hyp' ? 6 : 4}
            strokeDasharray={isShadowLab ? '5 3' : '3 3'}
          />

          {/* Angle Arc at A */}
          <path
            d={`M ${xA + 32} ${yA} A 32 32 0 0 0 ${xA + 32 * Math.cos(radA)} ${yA - 32 * Math.sin(radA)}`}
            fill="none"
            stroke={currentVertex === 'A' ? 'var(--color-sunlight)' : 'rgba(14,27,61,0.3)'}
            strokeWidth={currentVertex === 'A' ? 3 : 1.5}
          />
          <text
            x={xA + 38}
            y={yA - 8}
            fill="var(--color-ink-deep)"
            fontWeight={currentVertex === 'A' ? '800' : '500'}
            fontSize="12"
          >
            {theta}°
          </text>

          {/* Angle Arc at B */}
          <path
            d={`M ${xB} ${yB + 26} A 26 26 0 0 1 ${xB - 26 * Math.sin(radA)} ${yB + 26 * Math.cos(radA)}`}
            fill="none"
            stroke={currentVertex === 'B' ? 'var(--color-sunlight)' : 'rgba(14,27,61,0.3)'}
            strokeWidth={currentVertex === 'B' ? 3 : 1.5}
          />
          <text
            x={xB - 22}
            y={yB + 38}
            fill="var(--color-ink-deep)"
            fontWeight={currentVertex === 'B' ? '800' : '500'}
            fontSize="12"
          >
            {90 - theta}°
          </text>

          {/* Vertex A */}
          <circle cx={xA} cy={yA} r="5" fill="var(--color-zenith-blue)" />
          <text x={xA - 16} y={yA + 4} fill="var(--color-ink-deep)" fontWeight="800" fontSize="13">
            A
          </text>

          {/* Vertex C (Right Angle Vertex) */}
          <circle cx={xC} cy={yC} r="5" fill="var(--color-ink-deep)" />
          <text x={xC + 10} y={yC + 16} fill="var(--color-ink-deep)" fontWeight="800" fontSize="13">
            C
          </text>

          {/* Vertex B (Top Apex / Sun Position in 1A) */}
          <circle
            cx={xB}
            cy={yB}
            r={isShadowLab ? 9 : 6}
            fill={isShadowLab ? '#F59E0B' : 'var(--color-zenith-blue)'}
            stroke="#ffffff"
            strokeWidth="2"
          />
          {isShadowLab && (
            <text x={xB - 7} y={yB + 5} fontSize="14" style={{ pointerEvents: 'none' }}>
              ☀️
            </text>
          )}
          <text x={xB + 10} y={yB - 4} fill="var(--color-ink-deep)" fontWeight="800" fontSize="13">
            B
          </text>

          {/* Dynamic Side Labels */}
          {/* Hypotenuse Label */}
          <text
            x={(xA + xB) / 2 - 20}
            y={(yA + yB) / 2 - 12}
            fill={isShadowLab ? '#D97706' : 'var(--color-side-hyp)'}
            fontWeight="800"
            fontSize="12"
          >
            {isShadowLab ? 'Sun Ray (Hyp)' : 'Hypotenuse (H)'}
          </text>

          {/* Vertical Side Label */}
          <text
            x={xC + 12}
            y={(yC + yB) / 2 + 4}
            fill={currentVertex === 'A' ? 'var(--color-side-opp)' : 'var(--color-side-adj)'}
            fontWeight="800"
            fontSize="12"
          >
            {isShadowLab ? 'Height' : currentVertex === 'A' ? 'Opposite (O)' : 'Adjacent (A)'}
          </text>

          {/* Horizontal Side Label */}
          <text
            x={(xA + xC) / 2 - 24}
            y={yC + 20}
            fill={currentVertex === 'A' ? 'var(--color-side-adj)' : 'var(--color-side-opp)'}
            fontWeight="800"
            fontSize="12"
          >
            {isShadowLab ? 'Shadow' : currentVertex === 'A' ? 'Adjacent (A)' : 'Opposite (O)'}
          </text>

          {/* Drag Handle Label Hint */}
          <text x="20" y="22" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            ✋ Drag apex B or use angle slider below
          </text>
        </svg>
      </div>

      {/* Preset Angle Buttons */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            QUICK ANGLE PRESETS:
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-mint-dark)' }}>
            Active: θ = {theta}°
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {[15, 30, 45, 60, 75].map(deg => {
            const isMatch = theta === deg;
            return (
              <button
                key={deg}
                type="button"
                className="trig-btn trig-btn-secondary"
                style={{
                  padding: '5px 8px',
                  fontSize: '0.8rem',
                  background: isMatch ? 'var(--color-mint-light)' : undefined,
                  borderColor: isMatch ? 'var(--color-mint-primary)' : undefined,
                  fontWeight: isMatch ? 800 : 600,
                }}
                onClick={() => setPreset(deg)}
              >
                {deg}° {deg === 30 || deg === 45 || deg === 60 ? '⭐' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Angle Slider */}
      {interactive && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
            <span>
              Adjust Angle θ: <strong>{theta}°</strong>
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>15° to 75° (Smooth Range)</span>
          </div>
          <input
            type="range"
            min="15"
            max="75"
            step="1"
            value={theta}
            onChange={handleSliderChange}
            aria-label="Angle theta slider"
            style={{ width: '100%', accentColor: 'var(--color-mint-primary)', height: '8px', cursor: 'pointer' }}
          />
        </div>
      )}

      {/* Live Ratio Panel */}
      {showRatios && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginTop: '14px',
            textAlign: 'center',
          }}
        >
          <div
            className="trig-card"
            style={{ padding: '8px 12px', borderTop: '3.5px solid var(--color-side-opp)', background: 'var(--surface-inset)' }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              sin {currentVertex === 'A' ? theta : 90 - theta}° (O / H)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-side-opp)' }}>
              {sinVal}
              {exactRatios && (
                <span style={{ fontSize: '0.8rem', marginLeft: '6px', color: 'var(--text-muted)' }}>
                  ({exactRatios.sin})
                </span>
              )}
            </div>
          </div>

          <div
            className="trig-card"
            style={{ padding: '8px 12px', borderTop: '3.5px solid var(--color-side-adj)', background: 'var(--surface-inset)' }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              cos {currentVertex === 'A' ? theta : 90 - theta}° (A / H)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-side-adj)' }}>
              {cosVal}
              {exactRatios && (
                <span style={{ fontSize: '0.8rem', marginLeft: '6px', color: 'var(--text-muted)' }}>
                  ({exactRatios.cos})
                </span>
              )}
            </div>
          </div>

          <div
            className="trig-card"
            style={{ padding: '8px 12px', borderTop: '3.5px solid var(--color-sunlight)', background: 'var(--surface-inset)' }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              tan {currentVertex === 'A' ? theta : 90 - theta}° (O / A)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-ink-deep)' }}>
              {tanVal}
              {exactRatios && (
                <span style={{ fontSize: '0.8rem', marginLeft: '6px', color: 'var(--text-muted)' }}>
                  ({exactRatios.tan})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prominent Next Action Card: clearly shows where to go after adjusting the angle */}
      {onProceedToFormalise && (
        <div
          style={{
            marginTop: '14px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: hasInteracted
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(16, 185, 129, 0.06))'
              : 'var(--surface-inset)',
            border: `1.5px solid ${hasInteracted ? 'var(--color-mint-primary)' : 'var(--card-border)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            boxShadow: hasInteracted ? '0 4px 14px rgba(16, 185, 129, 0.12)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              {hasInteracted ? `🎉 Angle adjusted to ${theta}°!` : '💡 Adjust the angle above'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {hasInteracted
                ? 'Great discovery! Notice how the ratios changed. Ready to lock it into the Formula Vault?'
                : 'Drag the slider or click presets to see the triangle morph in real time.'}
            </div>
          </div>

          <button
            type="button"
            className="trig-btn trig-btn-primary"
            style={{
              padding: '7px 18px',
              fontSize: '0.88rem',
              boxShadow: hasInteracted ? '0 3px 12px var(--color-mint-glow)' : undefined,
            }}
            onClick={() => {
              sound.click();
              onProceedToFormalise();
            }}
          >
            Proceed to Step 3: Formalise ➔
          </button>
        </div>
      )}
    </div>
  );
};
