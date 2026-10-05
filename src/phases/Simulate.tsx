// src/phases/Simulate.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../app/state/AppContext';
import { STATIONS_REGISTRY } from '../content/stations';
import type { StationTestOption } from '../content/types';
import { TriangleLab } from '../components/interactive/TriangleLab';
import { UnitCircle } from '../components/interactive/UnitCircle';
import { WaveTracer } from '../components/interactive/WaveTracer';
import { Clinometer } from '../components/interactive/Clinometer';
import { SwingTriangle } from '../components/interactive/SwingTriangle';
import { ProofBoard } from '../components/interactive/ProofBoard';
import { Tex } from '../components/math/Tex';
import { Theo } from '../components/mascot/Theo';
import confetti from 'canvas-confetti';
import { sound } from '../app/audio';

export const Simulate: React.FC = () => {
  const { state, dispatch } = useApp();
  const { level, stationId } = state.nav;

  // Station Sub-phase: 'predict' | 'explore' | 'formalise' | 'test'
  const [subPhase, setSubPhase] = useState<'predict' | 'explore' | 'formalise' | 'test'>('explore');
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [selectedTestIdx, setSelectedTestIdx] = useState<number | null>(null);
  const [testScore, setTestScore] = useState(0);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);
  const [hasExplored, setHasExplored] = useState(true);
  const [hasFormalised, setHasFormalised] = useState(false);

  const currentStation = STATIONS_REGISTRY[stationId] || STATIONS_REGISTRY[level === 1 ? '1A' : level === 2 ? '2A' : '3A'];
  const allStationKeys = Object.keys(STATIONS_REGISTRY).filter(k => STATIONS_REGISTRY[k].level === level);
  const currentStationIdx = allStationKeys.indexOf(currentStation.id);

  // Cleanly reset station question states whenever switching station
  useEffect(() => {
    setSelectedPrediction(null);
    setSelectedTestIdx(null);
    setTestScore(0);
    setTestFeedback(null);
    setHasExplored(true);
    setHasFormalised(false);
  }, [currentStation.id]);

  const handlePredictSubmit = (idx: number) => {
    sound.click();
    setSelectedPrediction(idx);
    if (idx === currentStation.predictCorrectIdx) {
      sound.correct();
    }
  };

  const handleTestAnswer = (opt: StationTestOption, idx: number) => {
    setSelectedTestIdx(idx);
    setTestFeedback(opt.explanation || null);

    if (opt.correct) {
      sound.correct();
      setTestScore(1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      dispatch({
        type: 'RECORD_ANSWER',
        payload: {
          skillId: (currentStation.skills[0] || 'E1') as any,
          correct: true,
          attemptCount: 1,
          tag: null,
        },
      });
    } else {
      sound.wrong();
      setTestScore(0);
      dispatch({
        type: 'RECORD_ANSWER',
        payload: {
          skillId: (currentStation.skills[0] || 'E1') as any,
          correct: false,
          attemptCount: 1,
          tag: 'RATIO_WRONG_FN',
        },
      });
    }
  };

  const handleAdvanceStation = () => {
    sound.fanfare();
    dispatch({ type: 'COMPLETE_STATION', payload: currentStation.id });
    if (currentStationIdx < allStationKeys.length - 1) {
      const nextId = allStationKeys[currentStationIdx + 1];
      dispatch({ type: 'NAVIGATE', payload: { stationId: nextId } });
      setSubPhase('explore');
      setSelectedPrediction(null);
      setSelectedTestIdx(null);
      setTestScore(0);
      setTestFeedback(null);
      setHasExplored(true);
      setHasFormalised(false);
    } else {
      // Completed all stations in this level -> enter Practice Hub!
      dispatch({ type: 'SET_PHASE', payload: 'practice' });
    }
  };

  const switchSubPhase = (tab: 'predict' | 'explore' | 'formalise' | 'test') => {
    sound.click();
    setSubPhase(tab);
    if (tab === 'explore') setHasExplored(true);
    if (tab === 'formalise') setHasFormalised(true);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '10px 16px' }}>
      {/* Station Header & Station Switcher */}
      <div className="trig-card" style={{ padding: '10px 16px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="side-pill side-pill-hyp" style={{ padding: '2px 10px', fontSize: '0.8rem' }}>
                Lab {currentStationIdx + 1} · {currentStation.shortTitle || currentStation.title}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level {level} Simulations</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '2px 0 0 0' }}>
              {currentStation.title}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentStation.subtitle}</div>
          </div>

          {/* Station Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {allStationKeys.map((key, idx) => {
              const st = STATIONS_REGISTRY[key];
              const isDone = !!state.progress.stationsDone[key];
              const isCurrent = key === currentStation.id;
              const name = st?.shortTitle || st?.title || `Lab ${idx + 1}`;
              return (
                <button
                  key={key}
                  type="button"
                  className="trig-btn"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: isCurrent ? 'var(--color-mint-primary)' : isDone ? 'var(--color-success-bg)' : 'var(--surface-inset)',
                    color: isCurrent ? '#ffffff' : isDone ? 'var(--color-success)' : 'var(--text-main)',
                    border: isDone ? '1px solid var(--color-success)' : isCurrent ? '1px solid var(--color-mint-dark)' : '1px solid var(--card-border)',
                    fontWeight: isCurrent ? 800 : 600,
                    boxShadow: isCurrent ? '0 2px 8px var(--color-mint-glow)' : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title={st?.title}
                  onClick={() => {
                    sound.click();
                    dispatch({ type: 'NAVIGATE', payload: { stationId: key } });
                    setSubPhase('explore');
                    setSelectedPrediction(null);
                    setSelectedTestIdx(null);
                    setTestScore(0);
                    setTestFeedback(null);
                    setHasExplored(true);
                    setHasFormalised(false);
                  }}
                >
                  <span>{name}</span>
                  {isDone && <span style={{ fontSize: '0.75rem' }}>✔</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Step Cycle Tabs with Fraction-Isles Style Completion Checklist */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', borderTop: '1px solid var(--card-border)', paddingTop: '6px' }}>
          {(['predict', 'explore', 'formalise', 'test'] as const).map(tab => {
            const isActive = subPhase === tab;
            const isTest = tab === 'test';
            let checkIcon = '';
            if (tab === 'predict' && selectedPrediction !== null) checkIcon = ' ✔';
            if (tab === 'explore' && hasExplored) checkIcon = ' ✔';
            if (tab === 'formalise' && hasFormalised) checkIcon = ' ✔';
            if (tab === 'test' && testScore > 0) checkIcon = ' ✔';

            return (
              <button
                key={tab}
                type="button"
                className="trig-btn"
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? (isTest ? 'var(--color-coral-primary)' : 'var(--color-mint-primary)') : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: isActive ? 800 : 600,
                  boxShadow: isActive ? (isTest ? '0 2px 8px var(--color-coral-glow)' : '0 2px 8px var(--color-mint-glow)') : 'none',
                }}
                onClick={() => switchSubPhase(tab)}
              >
                {tab === 'predict' && `1. Predict${checkIcon}`}
                {tab === 'explore' && `2. Explore${checkIcon}`}
                {tab === 'formalise' && `3. Formalise${checkIcon}`}
                {tab === 'test' && `4. Test & Lock${checkIcon}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SUB-PHASE 1: PREDICT --- */}
      {subPhase === 'predict' && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <Theo
              mood={
                selectedPrediction === null
                  ? 'curious'
                  : selectedPrediction === currentStation.predictCorrectIdx
                  ? 'celebrating'
                  : 'thinking'
              }
              size={90}
            />
            <div>
              <span className="side-pill side-pill-adj">Curiosity Prediction</span>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '4px 0 0 0', fontSize: '1.3rem' }}>
                Make Your Prediction First!
              </h3>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-main)', lineHeight: 1.4 }}>
            {currentStation.predictPrompt || 'What happens when you adjust the angle?'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(currentStation.predictOptions || ['Option A', 'Option B', 'Option C']).map((opt, idx) => {
              const isSelected = selectedPrediction === idx;
              const hasAnswered = selectedPrediction !== null;
              const isCorrect = idx === currentStation.predictCorrectIdx;

              let btnBg = 'var(--surface-card)';
              let btnBorder = '1px solid var(--card-border)';
              let btnColor = 'var(--text-main)';

              if (hasAnswered) {
                if (isSelected) {
                  btnBg = isCorrect ? 'var(--color-success-bg)' : 'var(--color-coral-light)';
                  btnBorder = isCorrect ? '2px solid var(--color-success)' : '2px solid var(--color-coral-primary)';
                  btnColor = isCorrect ? 'var(--color-mint-dark)' : 'var(--color-coral-dark)';
                } else if (isCorrect) {
                  btnBg = 'var(--color-success-bg)';
                  btnBorder = '2px dashed var(--color-success)';
                  btnColor = 'var(--color-mint-dark)';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className="trig-btn"
                  style={{
                    textAlign: 'left',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: btnBg,
                    border: btnBorder,
                    color: btnColor,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                  }}
                  onClick={() => handlePredictSubmit(idx)}
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 700 : 500 }}>
                    {opt}
                  </span>
                  {hasAnswered && isSelected && (
                    <span style={{ fontSize: '1.2rem', marginLeft: '10px' }}>
                      {isCorrect ? '✔' : '💡'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedPrediction !== null && (
            <div
              className="trig-card"
              style={{
                marginTop: '18px',
                padding: '16px 20px',
                borderLeft: `4px solid ${
                  selectedPrediction === currentStation.predictCorrectIdx
                    ? 'var(--color-mint-primary)'
                    : 'var(--color-coral-primary)'
                }`,
                background: 'var(--surface-inset)',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', color: 'var(--text-main)' }}>
                {selectedPrediction === currentStation.predictCorrectIdx
                  ? '🎉 Spot on prediction!'
                  : '💡 Great intuition! Here is why:'}
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {currentStation.predictExplanation || 'Let us explore the live apparatus to test your prediction!'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="trig-btn trig-btn-primary" onClick={() => switchSubPhase('explore')}>
                  Enter the Interactive Lab ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUB-PHASE 2: EXPLORE --- */}
      {subPhase === 'explore' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span>
              <span>{currentStation.exploreGuide}</span>
            </div>
            <button
              type="button"
              className="trig-btn trig-btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              onClick={() => switchSubPhase('formalise')}
            >
              Next: Formalise ➔
            </button>
          </div>

          {/* Render Contextual Interactive Component */}
          {(currentStation.id === '1A' || currentStation.id === '1B' || currentStation.id === '1C') && (
            <TriangleLab
              initialTheta={currentStation.id === '1C' ? 30 : 35}
              stationId={currentStation.id}
              onProceedToFormalise={() => switchSubPhase('formalise')}
            />
          )}

          {currentStation.id === '1D' && (
            <Clinometer distanceMeters={60} />
          )}

          {(currentStation.id === '2A' || currentStation.id === '2D' || currentStation.id === '2C') && (
            <UnitCircle initialAngle={currentStation.id === '2A' ? 150 : 225} />
          )}

          {currentStation.id === '2B' && (
            <WaveTracer />
          )}

          {currentStation.id === '2E' && (
            <Clinometer distanceMeters={80} />
          )}

          {currentStation.id === '3A' && (
            <UnitCircle initialAngle={75} />
          )}

          {currentStation.id === '3B' && (
            <WaveTracer initialA={1.5} initialB={2} />
          )}

          {currentStation.id === '3C' && (
            <SwingTriangle />
          )}

          {currentStation.id === '3D' && (
            <ProofBoard
              targetStatement={{ lhs: '\\tan\\theta + \\cot\\theta', rhs: '\\sec\\theta\\csc\\theta' }}
              scrambledSteps={[
                { id: 'p1', tex: '\\frac{\\sin\\theta}{\\cos\\theta} + \\frac{\\cos\\theta}{\\sin\\theta}', moveName: 'Convert to sin/cos', explanation: 'Replace tan with sin/cos and cot with cos/sin.' },
                { id: 'p2', tex: '\\frac{\\sin^2\\theta + \\cos^2\\theta}{\\sin\\theta\\cos\\theta}', moveName: 'Common Denominator', explanation: 'Combine fractions over sin θ cos θ.' },
                { id: 'p3', tex: '\\frac{1}{\\sin\\theta\\cos\\theta}', moveName: 'Pythagorean Identity', explanation: 'Replace sin²θ + cos²θ with 1.' },
                { id: 'p4', tex: '\\frac{1}{\\cos\\theta} \\cdot \\frac{1}{\\sin\\theta} = \\sec\\theta\\csc\\theta', moveName: 'Reciprocal Definitions', explanation: 'Rewrite 1/cos as sec and 1/sin as csc.' },
              ]}
            />
          )}

          {(currentStation.id === '3E' || currentStation.id === '3F') && (
            <UnitCircle initialAngle={210} />
          )}
        </div>
      )}

      {/* --- SUB-PHASE 3: FORMALISE --- */}
      {subPhase === 'formalise' && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
            <Theo mood="celebrating" size={90} />
            <div>
              <span className="side-pill side-pill-adj">Discovery Lock-In</span>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '4px 0 0 0', fontSize: '1.4rem' }}>
                Lock It Into the Formula Vault!
              </h3>
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface-inset)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 16px',
              textAlign: 'center',
              border: '2px solid var(--color-mint-primary)',
              marginBottom: '20px',
              maxWidth: '100%',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              OFFICIAL FORMULA DERIVATION
            </span>
            <div
              style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.3rem)',
                marginBottom: '14px',
                maxWidth: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                padding: '10px 4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                scrollbarWidth: 'thin',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div style={{ maxWidth: '100%', minWidth: 'min-content' }}>
                <Tex math={currentStation.formalizeFormula} block />
              </div>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
              "{currentStation.formalizeRule}"
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="trig-btn trig-btn-coral" onClick={() => switchSubPhase('test')}>
              Take Quick 2-Minute Test ➔
            </button>
          </div>
        </div>
      )}

      {/* --- SUB-PHASE 4: TEST --- */}
      {subPhase === 'test' && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <Theo
              mood={
                testScore > 0
                  ? 'celebrating'
                  : selectedTestIdx !== null
                  ? 'thinking'
                  : 'measuring'
              }
              size={90}
            />
            <div>
              <span className="side-pill side-pill-opp">Station Check Challenge</span>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '4px 0 0 0', fontSize: '1.3rem' }}>
                Verify Your Understanding
              </h3>
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface-inset)',
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '16px',
              border: '1px solid var(--card-border)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', lineHeight: 1.4, color: 'var(--text-main)' }}>
              {currentStation.testPrompt ||
                'In a right triangle with acute angle 30° and hypotenuse 10, what is the length of the opposite side?'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(
                currentStation.testOptions || [
                  { label: '5.0 (10 × sin 30°)', correct: true, explanation: 'Opposite = Hypotenuse × sin 30° = 10 × 0.5 = 5.0.' },
                  { label: '8.66 (10 × cos 30°)', correct: false, explanation: '8.66 is the Adjacent side (cos 30°).' },
                  { label: '20.0 (10 ÷ sin 30°)', correct: false, explanation: 'Hypotenuse is given, so multiply by sin, do not divide!' },
                ]
              ).map((opt, idx) => {
                const isSelected = selectedTestIdx === idx;
                const hasAnswered = selectedTestIdx !== null;

                let btnBg = 'var(--surface-card)';
                let btnBorder = '1px solid var(--card-border)';
                let btnColor = 'var(--text-main)';

                if (hasAnswered) {
                  if (isSelected) {
                    btnBg = opt.correct ? 'var(--color-success)' : 'var(--color-error)';
                    btnBorder = opt.correct ? '2px solid var(--color-success)' : '2px solid var(--color-error)';
                    btnColor = '#ffffff';
                  } else if (opt.correct && testScore > 0) {
                    btnBg = 'var(--color-success-bg)';
                    btnBorder = '2px solid var(--color-success)';
                    btnColor = 'var(--color-mint-dark)';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className="trig-btn"
                    style={{
                      textAlign: 'left',
                      padding: '12px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: btnBg,
                      border: btnBorder,
                      color: btnColor,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                    onClick={() => handleTestAnswer(opt, idx)}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 700 : 500 }}>
                      {opt.label}
                    </span>
                    {hasAnswered && isSelected && (
                      <span style={{ fontSize: '1.2rem', marginLeft: '10px' }}>
                        {opt.correct ? '✔' : '❌'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Result Message */}
          {selectedTestIdx !== null && (
            <div
              className={`trig-card ${testScore > 0 ? 'pulse-glow' : ''}`}
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: testScore > 0 ? 'var(--color-success-bg)' : 'var(--color-coral-light)',
                borderLeft: `4px solid ${testScore > 0 ? 'var(--color-success)' : 'var(--color-coral-primary)'}`,
                color: testScore > 0 ? 'var(--color-mint-dark)' : 'var(--color-coral-dark)',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {testScore > 0 ? '🎉 Excellent! Correct Answer!' : '💡 Targeted Nudge — Try Again!'}
              </div>
              {testFeedback && (
                <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                  {testFeedback}
                </div>
              )}
              {testScore > 0 && (
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-mint-dark)', marginTop: '4px' }}>
                  ⭐ Station {currentStation.id} Mastery Verified (+25 Survey Points)
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className={`trig-btn ${testScore > 0 ? 'trig-btn-primary' : 'trig-btn-secondary'}`}
              disabled={testScore === 0}
              style={{
                opacity: testScore > 0 ? 1 : 0.45,
                cursor: testScore > 0 ? 'pointer' : 'not-allowed',
              }}
              onClick={handleAdvanceStation}
            >
              {currentStationIdx === allStationKeys.length - 1
                ? 'Enter Practice Constellation Hub ➔'
                : 'Next Station ➔'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
