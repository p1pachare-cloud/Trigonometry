// src/app/ReportCardModal.tsx
import React from 'react';
import { useApp } from './state/AppContext';
import { SKILLS_REGISTRY } from '../content/skills';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();

  if (!isOpen) return null;

  const coreSkills = Object.values(SKILLS_REGISTRY).filter(s => s.isCore);
  const masteredSkills = coreSkills.filter(s => {
    const m = state.mastery[s.id];
    return m && m.m >= 0.70;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(14,27,61,0.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="trig-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'var(--card-bg)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <span className="side-pill side-pill-adj">Educator & Student Snapshot</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: '4px 0 0 0' }}>
              Learner Mastery Report Card
            </h2>
          </div>
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '4px 10px' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Top Summary Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          <div className="trig-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Core Skills Mastered</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-zenith-blue)' }}>
              {masteredSkills.length} / {coreSkills.length}
            </div>
          </div>
          <div className="trig-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Survey Points (SP)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-sunlight)' }}>
              {state.game.sp}
            </div>
          </div>
          <div className="trig-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stamps Earned</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-side-opp)' }}>
              {Object.values(state.game.stamps).filter(s => s !== 'none').length} of 3
            </div>
          </div>
        </div>

        {/* Core Skills Mastery Progress Bars */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '10px' }}>
          Core Competency Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {coreSkills.slice(0, 10).map(s => {
            const m = state.mastery[s.id]?.m || 0.25;
            const pct = Math.round(m * 100);
            const isMastered = m >= 0.70;

            return (
              <div
                key={s.id}
                style={{
                  background: 'var(--surface-inset)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>
                    <strong>{s.id}: </strong> {s.title}
                  </span>
                  <span style={{ fontWeight: 700, color: isMastered ? 'var(--color-success)' : 'var(--text-muted)' }}>
                    {pct}% {isMastered && '✔'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '7px', background: 'var(--progress-track)', borderRadius: '4px' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isMastered ? 'var(--progress-completed)' : 'var(--progress-bar)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={handlePrint}>
            🖨 Print Report Card
          </button>
          <button type="button" className="trig-btn trig-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
