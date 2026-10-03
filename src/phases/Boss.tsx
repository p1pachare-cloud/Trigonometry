// src/phases/Boss.tsx
import React, { useState } from 'react';
import { useApp } from '../app/state/AppContext';
import { Theo } from '../components/mascot/Theo';
import confetti from 'canvas-confetti';
import { sound } from '../app/audio';

interface BossStage {
  lockNum: number;
  prompt: string;
  options: Array<{ text: string; correct: boolean }>;
  explanation: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const Boss: React.FC = () => {
  const { state, dispatch } = useApp();
  const { level } = state.nav;

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSure, setIsSure] = useState(true);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const stages: BossStage[] = [
    { lockNum: 1, prompt: 'Lock 1: In a right triangle, which side is opposite to the 90° angle?', options: [{ text: 'Hypotenuse', correct: true }, { text: 'Opposite', correct: false }, { text: 'Adjacent', correct: false }], explanation: 'The Hypotenuse opposes the right angle.' },
    { lockNum: 2, prompt: 'Lock 2: If sin θ = 3/5, what is the ratio Opposite ÷ Hypotenuse?', options: [{ text: '3/5', correct: true }, { text: '4/5', correct: false }, { text: '3/4', correct: false }], explanation: 'Sine is defined as Opposite over Hypotenuse.' },
    { lockNum: 3, prompt: 'Lock 3: What is the exact value of cos 60°?', options: [{ text: '1/2', correct: true }, { text: '√3/2', correct: false }, { text: '√2/2', correct: false }], explanation: 'By the root ladder, cos 60° = 1/2.' },
    { lockNum: 4, prompt: 'Lock 4: A 12m ramp makes an angle of 30° with the ground. How high does it rise?', options: [{ text: '6.0 m', correct: true }, { text: '10.4 m', correct: false }, { text: '24.0 m', correct: false }], explanation: 'Height = 12 × sin 30° = 12 × 0.5 = 6.0m.' },
    { lockNum: 5, prompt: 'Lock 5: If sin θ = cos(90° - θ), what is cos 65° equal to?', options: [{ text: 'sin 25°', correct: true }, { text: 'sin 65°', correct: false }, { text: 'cos 25°', correct: false }], explanation: '90° - 65° = 25°, so cos 65° = sin 25°.' },
    { lockNum: 6, prompt: 'Lock 6: A shadow of 40m is cast by a tower when sun elevation is 45°. How tall is the tower?', options: [{ text: '40 m', correct: true }, { text: '20 m', correct: false }, { text: '80 m', correct: false }], explanation: 'tan 45° = 1, so Height = Shadow = 40m.' },
    { lockNum: 7, prompt: 'Lock 7: Identify the primitive Pythagorean triple among the choices:', options: [{ text: '(5, 12, 13)', correct: true }, { text: '(4, 5, 6)', correct: false }, { text: '(6, 8, 12)', correct: false }], explanation: '5² + 12² = 25 + 144 = 169 = 13².' },
    { lockNum: 8, prompt: 'Lock 8: Master Combination Lock: sin²θ + cos²θ identically equals:', options: [{ text: '1', correct: true }, { text: '0', correct: false }, { text: '2', correct: false }], explanation: 'The fundamental Pythagorean identity always equals 1.' },
  ];

  const [activeStages, setActiveStages] = useState<BossStage[]>(() =>
    stages.map(s => ({
      ...s,
      options: shuffleArray(s.options),
    }))
  );

  const currentStage = activeStages[currentStageIdx] || activeStages[0];
  const passed = score >= 6;

  const handleCommitLock = (optIdx: number) => {
    setSelectedOpt(optIdx);
    const correct = currentStage.options[optIdx].correct;
    if (correct) {
      sound.correct();
      setScore(prev => prev + 1);
    } else {
      sound.wrong();
    }

    setTimeout(() => {
      if (currentStageIdx >= activeStages.length - 1) {
        setIsFinished(true);
        if (score + (correct ? 1 : 0) >= 6) {
          sound.fanfare();
          dispatch({ type: 'PASS_BOSS', payload: level });
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        setCurrentStageIdx(prev => prev + 1);
        setSelectedOpt(null);
      }
    }, 900);
  };

  const handleNextLevel = () => {
    sound.click();
    if (level < 3) {
      dispatch({ type: 'SET_LEVEL', payload: (level + 1) as 1 | 2 | 3 });
    } else {
      dispatch({ type: 'NAVIGATE', payload: { view: 'finale' } });
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '24px 16px' }}>
      {!isFinished ? (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span className="side-pill side-pill-opp">
                Boss Encounter B{level}
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', margin: '4px 0 0 0' }}>
                {level === 1 ? 'The Pyramid Vault' : level === 2 ? 'The Observatory Lock' : 'The Final Build'}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Score: {score} / 8</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-reward-dark)', fontWeight: 700 }}>Pass threshold: 6 / 8</div>
            </div>
          </div>

          {/* 8 Locks Progress Meter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {stages.map((s, idx) => (
              <div
                key={s.lockNum}
                style={{
                  flex: 1,
                  height: '10px',
                  borderRadius: 'var(--radius-full)',
                  background: idx < currentStageIdx ? 'var(--color-success)' : idx === currentStageIdx ? 'var(--color-coral-primary)' : 'var(--progress-track)',
                }}
              />
            ))}
          </div>

          {/* Stage Prompt Card */}
          <div
            style={{
              background: 'var(--surface-inset)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <Theo mood="measuring" size={85} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: '12px 0 16px 0' }}>
              {currentStage.prompt}
            </h3>

            {/* Confidence Bet Toggle */}
            <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '20px', background: 'var(--surface-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
              <button
                type="button"
                className={`trig-btn ${isSure ? 'trig-btn-coral' : 'trig-btn-secondary'}`}
                style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                onClick={() => setIsSure(true)}
              >
                🎯 I'm Sure (+Bonus SP)
              </button>
              <button
                type="button"
                className={`trig-btn ${!isSure ? 'trig-btn-primary' : 'trig-btn-secondary'}`}
                style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                onClick={() => setIsSure(false)}
              >
                🤔 Not Sure (Safe)
              </button>
            </div>

            {/* Option Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '480px', margin: '0 auto' }}>
              {currentStage.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                let bg = 'var(--surface-card)';
                let color = 'var(--text-main)';

                if (isSelected) {
                  bg = opt.correct ? 'var(--color-success)' : 'var(--color-error)';
                  color = '#ffffff';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className="trig-btn"
                    disabled={selectedOpt !== null}
                    style={{ background: bg, color, padding: '12px 18px', border: '1px solid var(--card-border)', fontSize: '1rem' }}
                    onClick={() => handleCommitLock(idx)}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Boss Run Summary */
        <div className="trig-card" style={{ padding: '36px', textAlign: 'center' }}>
          <Theo mood={passed ? 'celebrating' : 'thinking'} size={120} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: '12px' }}>
            {passed ? '🏆 Boss Conquered!' : '🔒 Vault Locked!'}
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            You solved <strong>{score} of 8</strong> security locks.
            {passed
              ? ` Congratulations! You earned the Level ${level} Master Surveyor Stamp!`
              : ' You need at least 6 correct locks to open the vault. Review the stations and try again!'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {!passed ? (
              <button
                type="button"
                className="trig-btn trig-btn-primary"
                onClick={() => {
                  setActiveStages(stages.map(s => ({ ...s, options: shuffleArray(s.options) })));
                  setCurrentStageIdx(0);
                  setScore(0);
                  setIsFinished(false);
                  setSelectedOpt(null);
                }}
              >
                🔄 Retry Vault Locks
              </button>
            ) : (
              <button
                type="button"
                className="trig-btn trig-btn-gold"
                onClick={handleNextLevel}
              >
                {level === 3 ? 'View Finale & Certificate ➔' : `Advance to Level ${level + 1} ➔`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
