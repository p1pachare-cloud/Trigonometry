// src/components/interactive/WaveTracer.tsx
import React, { useState, useEffect, useRef } from 'react';

interface WaveTracerProps {
  initialA?: number;
  initialB?: number;
  initialC?: number;
  initialD?: number;
  interactiveSliders?: boolean;
  showSecondWave?: boolean;
  onParamsChange?: (p: { A: number; B: number; C: number; D: number }) => void;
  className?: string;
}

export const WaveTracer: React.FC<WaveTracerProps> = ({
  initialA = 1,
  initialB = 1,
  initialC = 0,
  initialD = 0,
  interactiveSliders = true,
  showSecondWave: _showSecondWave = false,
  onParamsChange,
  className = '',
}) => {
  const [A, setA] = useState(initialA);
  const [B, setB] = useState(initialB);
  const [C, setC] = useState(initialC);
  const [D, setD] = useState(initialD);
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = () => {
      setTime(prev => prev + 0.03);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  const handleParamChange = (name: 'A' | 'B' | 'C' | 'D', val: number) => {
    let nextA = A, nextB = B, nextC = C, nextD = D;
    if (name === 'A') { setA(val); nextA = val; }
    if (name === 'B') { setB(val); nextB = val; }
    if (name === 'C') { setC(val); nextC = val; }
    if (name === 'D') { setD(val); nextD = val; }
    if (onParamsChange) onParamsChange({ A: nextA, B: nextB, C: nextC, D: nextD });
  };

  // SVG dimensions 440 x 180
  const width = 440;
  const height = 180;
  const centerY = height / 2 - D * 20;

  // Build SVG path for Primary Wave: y = A * sin(B * (x - C)) + D
  let pathD = '';
  for (let x = 0; x <= width; x += 4) {
    const angle = (x / 40) * B - C;
    const y = centerY - A * 35 * Math.sin(angle);
    pathD += `${x === 0 ? 'M' : 'L'} ${x} ${y} `;
  }

  // Current dot position riding the wave
  const dotX = ((time * 30) % width);
  const dotAngle = (dotX / 40) * B - C;
  const dotY = centerY - A * 35 * Math.sin(dotAngle);

  // Period in degrees and radians
  const periodRad = (2 * Math.PI / Math.abs(B)).toFixed(2);

  return (
    <div className={`wave-tracer-container trig-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.15rem' }}>
          Wave Interference & Transformations
        </h4>
        <button
          type="button"
          className="trig-btn trig-btn-secondary"
          style={{ padding: '4px 12px', fontSize: '0.85rem' }}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸ Pause Wave' : '▶ Play Wave'}
        </button>
      </div>

      {/* Modern Wave Monitor Screen */}
      <div
        style={{
          background: 'var(--surface-inset)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          border: '1px solid var(--card-border)',
          position: 'relative',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-label={`Oscilloscope wave: amplitude ${A}, period ${periodRad} radians`}
        >
          {/* Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="0" y1={centerY} x2={width} y2={centerY} stroke="rgba(255,107,107,0.4)" strokeDasharray="3 3" />
          <line x1={width / 4} y1="0" x2={width / 4} y2={height} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 4" />
          <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 4" />
          <line x1={(width * 3) / 4} y1="0" x2={(width * 3) / 4} y2={height} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 4" />

          {/* Primary Wave */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-mint-primary)"
            strokeWidth="3.5"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(16,185,129,0.35))' }}
          />

          {/* Traveling Tracer Bead */}
          <circle
            cx={dotX}
            cy={dotY}
            r="6"
            fill="var(--color-coral-primary)"
            stroke="#ffffff"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(255,107,107,0.5))' }}
          />
        </svg>

        <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          y = {A !== 1 ? `${A} ` : ''}sin({B !== 1 ? `${B}` : ''}x{C !== 0 ? ` - ${C.toFixed(1)}` : ''}){D !== 0 ? ` + ${D}` : ''}
        </div>
      </div>

      {/* Sliders Console */}
      {interactiveSliders && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginTop: '16px',
            background: 'var(--surface-inset)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Amplitude (A)</span>
              <strong>{A}</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={A}
              onChange={e => handleParamChange('A', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-zenith-blue)' }}
            />
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Frequency (B)</span>
              <strong>{B}</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={B}
              onChange={e => handleParamChange('B', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-zenith-blue)' }}
            />
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Phase (C)</span>
              <strong>{C.toFixed(1)}</strong>
            </div>
            <input
              type="range"
              min="-3.14"
              max="3.14"
              step="0.3"
              value={C}
              onChange={e => handleParamChange('C', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-coral-primary)' }}
            />
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Midline (D)</span>
              <strong>{D}</strong>
            </div>
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.5"
              value={D}
              onChange={e => handleParamChange('D', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-mint-primary)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
