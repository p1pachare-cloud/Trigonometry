// src/app/Shell.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from './state/AppContext';
import { SunArc } from './SunArc';
import { CalculatorModal } from './CalculatorModal';
import { ReportCardModal } from './ReportCardModal';
import { sound } from './audio';
import type { LevelId, PhaseId } from '../content/types';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { state, dispatch } = useApp();
  const { level, phase, view } = state.nav;

  const [calcOpen, setCalcOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    sound.setEnabled(state.settings.audio);
  }, [state.settings.audio]);

  const handleLevelChange = (lvl: LevelId) => {
    sound.click();
    dispatch({ type: 'SET_LEVEL', payload: lvl });
  };

  const handlePhaseChange = (phs: PhaseId) => {
    sound.click();
    dispatch({ type: 'SET_PHASE', payload: phs });
  };

  const toggleNotation = () => {
    sound.click();
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { notation: state.settings.notation === 'cosec' ? 'csc' : 'cosec' },
    });
  };

  const toggleAudio = () => {
    const nextState = !state.settings.audio;
    sound.setEnabled(nextState);
    if (nextState) sound.click();
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { audio: nextState },
    });
  };

  const litStarsCount = Object.values(state.progress.gamesLit || {}).filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Application Header */}
      <header
        style={{
          height: 'var(--header-height)',
          background: 'var(--header-bg)',
          backdropFilter: 'var(--surface-glass-blur)',
          borderBottom: '1px solid var(--card-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Brand & Level Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'main', phase: 'wonder' } })}
          >
            <span style={{ fontSize: '1.7rem', filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.2))' }}>🔭</span>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                }}
              >
                Sky Surveyors
              </h1>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-coral-primary)', fontWeight: 700 }}>
                Trigonometry Adventures
              </div>
            </div>
          </div>

          {/* Level Switcher */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: 'var(--surface-inset)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
            }}
          >
            {[1, 2, 3].map(lvl => {
              const isCurrent = level === lvl;
              const isUnlocked = state.progress.levelUnlocked[lvl as LevelId];
              return (
                <button
                  key={lvl}
                  type="button"
                  className={`trig-nav-tab ${isCurrent ? 'active' : ''}`}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isCurrent ? 'var(--color-mint-primary)' : 'transparent',
                    color: isCurrent ? '#ffffff' : 'var(--nav-inactive)',
                    fontWeight: isCurrent ? 800 : 600,
                    boxShadow: isCurrent ? '0 2px 8px var(--color-mint-glow)' : 'none',
                    border: 'none',
                  }}
                  onClick={() => handleLevelChange(lvl as LevelId)}
                >
                  L{lvl}: {lvl === 1 ? 'Shadows' : lvl === 2 ? 'Circles' : 'Waves'}
                  {!isUnlocked && ' 🔒'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase Tabs & Living Sun Arc */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SunArc />

          <nav style={{ display: 'flex', gap: '5px' }}>
            {(['wonder', 'story', 'simulate', 'practice', 'boss'] as const).map(p => {
              const isActive = phase === p && view === 'main';
              return (
                <button
                  key={p}
                  type="button"
                  className={`trig-nav-tab ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                  onClick={() => {
                    dispatch({ type: 'NAVIGATE', payload: { view: 'main' } });
                    handlePhaseChange(p);
                  }}
                >
                  {p}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Controls & Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Notation Switch */}
          <button
            type="button"
            className="trig-btn trig-btn-secondary"
            style={{ padding: '6px 11px', fontSize: '0.8rem', fontWeight: 700 }}
            title="Switch reciprocal notation between cosec (UK/India) and csc (US)"
            onClick={toggleNotation}
          >
            {state.settings.notation}
          </button>

          {/* Calculator Launcher */}
          <button
            type="button"
            className="trig-btn trig-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            onClick={() => {
              sound.click();
              setCalcOpen(true);
            }}
          >
            🧮 Calc
          </button>

          {/* Report Card Launcher */}
          <button
            type="button"
            className="trig-btn trig-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            onClick={() => {
              sound.click();
              setReportOpen(true);
            }}
          >
            📊 Mastery
          </button>

          {/* Audio Sound & Narration Toggle */}
          <button
            type="button"
            className="trig-btn trig-btn-secondary"
            style={{
              padding: '6px 10px',
              fontSize: '0.85rem',
              background: state.settings.audio ? 'var(--color-mint-light)' : 'var(--surface-inset)',
              borderColor: state.settings.audio ? 'var(--color-mint-primary)' : 'var(--card-border)',
            }}
            onClick={toggleAudio}
            title={state.settings.audio ? 'Game Sound & Narration: ON' : 'Game Sound & Narration: MUTED'}
          >
            {state.settings.audio ? '🔊 SFX' : '🔇 Mute'}
          </button>

          {/* Fraction-Isles Style Star Meter */}
          <div
            className="reward-badge"
            title="Total Constellation Stars Lit across all levels"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.22), rgba(251, 191, 36, 0.08))',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              color: 'var(--color-reward-dark)',
            }}
          >
            <span>⭐</span>
            <strong>{litStarsCount}</strong>
            <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>/ 14</span>
          </div>

          {/* Reward XP / Score Badge */}
          <div
            className="reward-badge"
            title="Total Survey Points earned"
          >
            ✨ {state.game.sp} SP
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main style={{ flex: 1, paddingBottom: '88px' }}>{children}</main>

      {/* Floating Instrument Belt */}
      <footer
        style={{
          position: 'fixed',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          display: 'flex',
          gap: '10px',
          padding: '6px 18px',
          background: 'var(--surface-glass)',
          backdropFilter: 'var(--surface-glass-blur)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--card-border)',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.12)',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          Tools:
        </span>
        <button
          type="button"
          className="trig-btn trig-btn-secondary"
          style={{ padding: '5px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          onClick={() => {
            sound.click();
            dispatch({ type: 'SET_LEVEL', payload: 1 });
            dispatch({ type: 'SET_PHASE', payload: 'simulate' });
            dispatch({ type: 'NAVIGATE', payload: { stationId: '1D' } });
          }}
        >
          🔭 Clinometer
        </button>
        <button
          type="button"
          className="trig-btn trig-btn-secondary"
          style={{ padding: '5px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          onClick={() => {
            sound.click();
            dispatch({ type: 'SET_LEVEL', payload: 2 });
            dispatch({ type: 'SET_PHASE', payload: 'simulate' });
            dispatch({ type: 'NAVIGATE', payload: { stationId: '2A' } });
          }}
        >
          🧭 Angle Compass
        </button>
        <button
          type="button"
          className="trig-btn trig-btn-secondary"
          style={{ padding: '5px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          onClick={() => {
            sound.click();
            dispatch({ type: 'SET_LEVEL', payload: 3 });
            dispatch({ type: 'SET_PHASE', payload: 'simulate' });
            dispatch({ type: 'NAVIGATE', payload: { stationId: '3C' } });
          }}
        >
          📐 Theodolite
        </button>
        <button
          type="button"
          className="trig-btn trig-btn-coral"
          style={{ padding: '5px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          onClick={() => {
            sound.click();
            dispatch({ type: 'NAVIGATE', payload: { view: 'finale' } });
          }}
        >
          📖 Formula Vault
        </button>
      </footer>

      {/* Modals */}
      <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
      <ReportCardModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
};
