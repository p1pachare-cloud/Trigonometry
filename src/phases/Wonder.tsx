// src/phases/Wonder.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../app/state/AppContext';
import { Theo } from '../components/mascot/Theo';
import { sound } from '../app/audio';

export const Wonder: React.FC = () => {
  const { state, dispatch } = useApp();
  const { level } = state.nav;

  // Level 1 Wonder State: Pyramid Sun Elevation Scrubber
  const [sunElev, setSunElev] = useState(25);
  const [l1Discovered, setL1Discovered] = useState(false);

  // Level 2 Wonder State: Ferris Wheel Spin
  const [wheelAngle, setWheelAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawnCurve, setDrawnCurve] = useState(false);

  // Level 3 Wonder State: Sound Cancellation Phase
  const [speakerPhase, setSpeakerPhase] = useState(0);
  const isCanceled = Math.abs(speakerPhase - 180) <= 5;

  // Voice narration state
  const [isNarrating, setIsNarrating] = useState(false);

  useEffect(() => {
    sound.stopAudio();
    setIsNarrating(false);
    return () => {
      sound.stopAudio();
    };
  }, [level]);

  const toggleWonderAudio = (lvl: number) => {
    if (isNarrating) {
      sound.stopAudio();
      setIsNarrating(false);
      return;
    }
    setIsNarrating(true);
    sound.playFile(
      `/audio/wonder-level-${lvl}.mp3`,
      () => setIsNarrating(false),
      () => setIsNarrating(false)
    );
  };

  const handleL1ElevChange = (val: number) => {
    setSunElev(val);
    if (Math.abs(val - 45) <= 2) {
      setL1Discovered(true);
    }
  };

  const handleL2Spin = () => {
    setIsSpinning(true);
    setDrawnCurve(true);
    let cur = 0;
    const interval = setInterval(() => {
      cur += 8;
      setWheelAngle(cur);
      if (cur >= 360) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 30);
  };

  const handleAdvanceToStory = () => {
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      {/* --- LEVEL 1 WONDER --- */}
      {level === 1 && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <Theo mood={l1Discovered ? 'celebrating' : 'curious'} size={110} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="side-pill side-pill-hyp">Level 1 Wonder Hook</span>
                <button
                  type="button"
                  className="trig-btn trig-btn-secondary"
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: isNarrating ? 'var(--brand-coral-primary)' : 'var(--surface-card)',
                    color: isNarrating ? '#ffffff' : 'var(--text-main)',
                    borderColor: isNarrating ? 'var(--brand-coral-dark)' : 'var(--card-border)',
                  }}
                  onClick={() => toggleWonderAudio(1)}
                  title="Listen to Rachel's narration"
                >
                  {isNarrating ? '⏹ Stop' : '🔊 Listen (Voice)'}
                </button>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: 0 }}>
                The Giant You Can't Climb
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '1rem', lineHeight: 1.4 }}>
                Nobody can climb to the top of this pyramid with a measuring tape. Yet over 2,500 years ago, a traveller
                calculated its exact height without leaving the ground. How?
              </p>
            </div>
          </div>

          {/* Interactive Sun & Shadow Stage */}
          <div
            style={{
              background: 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 60%, #fed7aa 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 16px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '260px',
            }}
          >
            {/* The Moving Sun */}
            <div
              style={{
                position: 'absolute',
                left: `${15 + (sunElev / 90) * 70}%`,
                top: `${80 - Math.sin((sunElev * Math.PI) / 180) * 65}%`,
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--color-reward-yellow)',
                boxShadow: '0 0 35px var(--color-reward-yellow), 0 0 60px rgba(251, 191, 36, 0.6)',
                transition: 'all 0.1s linear',
              }}
            />

            <svg viewBox="0 0 500 180" style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 2 }}>
              {/* Ground Horizon */}
              <line x1="0" y1="160" x2="500" y2="160" stroke="#78350f" strokeWidth="4" />

              {/* Staff (Height = 35) & Shadow */}
              <rect x="70" y="125" width="4" height="35" fill="#78350f" rx="1" />
              {/* Staff Shadow */}
              <line
                x1="74"
                y1="160"
                x2={74 + 35 / Math.tan((sunElev * Math.PI) / 180)}
                y2="160"
                stroke="#451a03"
                strokeWidth="5"
                opacity="0.6"
              />

              {/* Great Pyramid & Shadow */}
              {/* Pyramid Shadow */}
              <polygon
                points={`280,160 380,160 ${380 + 90 / Math.tan((sunElev * Math.PI) / 180)},160`}
                fill="#451a03"
                opacity="0.4"
              />
              {/* Pyramid Body */}
              <polygon points="280,160 380,70 480,160" fill="#d97706" stroke="#92400e" strokeWidth="2" />
            </svg>

            {/* Live Shadow Match Banner */}
            {l1Discovered && (
              <div
                className="trig-card pulse-glow"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '10px 16px',
                  fontWeight: 800,
                  color: 'var(--color-ink-deep)',
                  borderLeft: '4px solid var(--color-mint-primary)',
                }}
              >
                🎉 Discovery! At 45°, Shadow Length = Object Height!
              </div>
            )}
          </div>

          {/* Slider Control */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>
                Drag the Sun Elevation Angle: <strong>{sunElev}°</strong>
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                Target: When is the staff's shadow exactly as long as the staff is tall?
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="75"
              value={sunElev}
              onChange={e => handleL1ElevChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-mint-primary)', height: '10px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="button"
              className="trig-btn trig-btn-primary"
              onClick={handleAdvanceToStory}
            >
              Continue to the Story: The Shadow Scouts ➔
            </button>
          </div>
        </div>
      )}

      {/* --- LEVEL 2 WONDER --- */}
      {level === 2 && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <Theo mood="curious" size={110} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="side-pill side-pill-adj">Level 2 Wonder Hook</span>
                <button
                  type="button"
                  className="trig-btn trig-btn-secondary"
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: isNarrating ? 'var(--brand-coral-primary)' : 'var(--surface-card)',
                    color: isNarrating ? '#ffffff' : 'var(--text-main)',
                    borderColor: isNarrating ? 'var(--brand-coral-dark)' : 'var(--card-border)',
                  }}
                  onClick={() => toggleWonderAudio(2)}
                  title="Listen to Rachel's narration"
                >
                  {isNarrating ? '⏹ Stop' : '🔊 Listen (Voice)'}
                </button>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: 0 }}>
                The Wheel That Draws a Wave
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '1rem', lineHeight: 1.4 }}>
                A Ferris wheel turns at a steady circular speed. But your seat's vertical height doesn't rise and fall
                at a steady speed—it slows at the peak and rushes through the middle. What shape does it trace?
              </p>
            </div>
          </div>

          {/* Interactive Wheel & Wave Canvas */}
          <div
            style={{
              background: 'var(--surface-inset)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            {/* Spinning Ferris Wheel */}
            <div style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 200 200" style={{ width: '100%', maxWidth: '180px' }}>
                <circle cx="100" cy="100" r="70" fill="none" stroke="var(--color-ink-deep)" strokeWidth="2.5" />
                <line x1="100" y1="100" x2="70" y2="190" stroke="var(--color-ink-soft)" strokeWidth="3" />
                <line x1="100" y1="100" x2="130" y2="190" stroke="var(--color-ink-soft)" strokeWidth="3" />
                
                {/* Spokes */}
                <line x1="100" y1="30" x2="100" y2="170" stroke="rgba(14,27,61,0.2)" />
                <line x1="30" y1="100" x2="170" y2="100" stroke="rgba(14,27,61,0.2)" />

                {/* Rotating Passenger Pod */}
                <circle
                  cx={100 + 70 * Math.cos((wheelAngle * Math.PI) / 180)}
                  cy={100 - 70 * Math.sin((wheelAngle * Math.PI) / 180)}
                  r="9"
                  fill="var(--color-sunlight)"
                  stroke="var(--color-ink-deep)"
                  strokeWidth="2.5"
                />
              </svg>
              <button
                type="button"
                className="trig-btn trig-btn-primary"
                style={{ marginTop: '12px' }}
                disabled={isSpinning}
                onClick={handleL2Spin}
              >
                {isSpinning ? '🎡 Spinning Wheel...' : '🎡 Spin the Wheel!'}
              </button>
            </div>

            {/* Unrolled Sinusoidal Wave Trace */}
            <div style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 220 150" style={{ width: '100%' }}>
                <line x1="10" y1="75" x2="210" y2="75" stroke="#94a3b8" strokeDasharray="3 3" />
                {drawnCurve && (
                  <path
                    d="M 10 75 Q 60 15 110 75 T 210 75"
                    fill="none"
                    stroke="var(--color-zenith-blue)"
                    strokeWidth="3.5"
                  />
                )}
                {drawnCurve && (
                  <text x="50" y="130" fill="var(--color-ink-deep)" fontWeight="700" fontSize="12">
                    A Pure Sine Wave!
                  </text>
                )}
              </svg>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {drawnCurve ? 'Circular spin unrolls directly into a Sine wave!' : 'Press Spin to watch the path unfold!'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="trig-btn trig-btn-primary" onClick={handleAdvanceToStory}>
              Continue to the Story: The Circle Cartographers ➔
            </button>
          </div>
        </div>
      )}

      {/* --- LEVEL 3 WONDER --- */}
      {level === 3 && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <Theo mood={isCanceled ? 'celebrating' : 'thinking'} size={110} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="side-pill side-pill-hyp">Level 3 Wonder Hook</span>
                <button
                  type="button"
                  className="trig-btn trig-btn-secondary"
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: isNarrating ? 'var(--brand-coral-primary)' : 'var(--surface-card)',
                    color: isNarrating ? '#ffffff' : 'var(--text-main)',
                    borderColor: isNarrating ? 'var(--brand-coral-dark)' : 'var(--card-border)',
                  }}
                  onClick={() => toggleWonderAudio(3)}
                  title="Listen to Rachel's narration"
                >
                  {isNarrating ? '⏹ Stop' : '🔊 Listen (Voice)'}
                </button>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: 0 }}>
                Can Two Sounds Make Silence?
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '1rem', lineHeight: 1.4 }}>
                Noise-cancelling headphones play a sound to <em>erase</em> a sound. How can playing two sounds add up to
                absolute silence?
              </p>
            </div>
          </div>

          {/* Wave Interference Simulator */}
          <div
            style={{
              background: 'var(--surface-inset)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--card-border)',
            }}
          >
            <svg viewBox="0 0 460 140" style={{ width: '100%', height: 'auto' }}>
              <line x1="0" y1="70" x2="460" y2="70" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Combined Wave */}
              {isCanceled ? (
                <line x1="0" y1="70" x2="460" y2="70" stroke="var(--color-mint-primary)" strokeWidth="4" />
              ) : (
                <path
                  d={`M 0 70 Q 115 ${70 - 45 * Math.sin(((180 - speakerPhase) * Math.PI) / 180)} 230 70 T 460 70`}
                  fill="none"
                  stroke="var(--color-coral-primary)"
                  strokeWidth="3.5"
                />
              )}
            </svg>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span
                style={{
                  color: isCanceled ? 'var(--color-mint-dark)' : 'var(--color-coral-dark)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isCanceled ? '✔ DESTRUCTIVE INTERFERENCE: PERFECT SILENCE (0)' : 'COMBINED WAVE ACTIVE (NOISE)'}
              </span>
            </div>
          </div>

          {/* Phase Offset Slider */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>
                Shift Speaker 2 Phase: <strong>{speakerPhase}°</strong> (Target: 180° / π rad)
              </span>
              <span style={{ color: 'var(--text-muted)' }}>sin(x) + sin(x + 180°) = 0</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={speakerPhase}
              onChange={e => setSpeakerPhase(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-coral-primary)', height: '10px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="trig-btn trig-btn-primary" onClick={handleAdvanceToStory}>
              Continue to the Story: The Sky Engineers ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
