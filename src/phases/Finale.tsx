// src/phases/Finale.tsx
import React, { useState } from 'react';
import { useApp } from '../app/state/AppContext';
import { Theo } from '../components/mascot/Theo';
import { SKILLS_REGISTRY } from '../content/skills';
import { Tex } from '../components/math/Tex';

export const Finale: React.FC = () => {
  const { state, dispatch } = useApp();
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveJournal = () => {
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Certificate Card */}
      <div
        className="trig-card"
        style={{
          padding: '36px',
          textAlign: 'center',
          border: '3px solid var(--color-reward-yellow)',
          background: 'linear-gradient(135deg, #FEF9EE 0%, #FFFFFF 50%, #F0FDF4 100%)',
          marginBottom: '28px',
        }}
      >
        <Theo mood="celebrating" size={120} />
        <span className="side-pill side-pill-adj" style={{ marginTop: '12px', fontSize: '0.9rem' }}>
          OFFICIAL CREDENTIAL OF MASTERY
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', margin: '8px 0 6px 0' }}>
          Master Celestial Surveyor
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto 20px auto' }}>
          Conferred upon the apprentice who climbed shadows at Giza, unrolled the sacred Unit Circle, and mastered the
          harmonic interference of sound and wave.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div className="trig-card" style={{ padding: '12px 20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Survey Points</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-sunlight)' }}>{state.game.sp} SP</div>
          </div>
          <div className="trig-card" style={{ padding: '12px 20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Highest Sightline Streak</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-side-opp)' }}>{state.game.maxStreak} 🔥</div>
          </div>
          <div className="trig-card" style={{ padding: '12px 20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unlocked Instruments</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-side-adj)' }}>3 of 3 🔭🧭📐</div>
          </div>
        </div>

        <button type="button" className="trig-btn trig-btn-gold" onClick={handlePrint}>
          🖨 Print Master Credential & Vault
        </button>
      </div>

      {/* Reflection Journal Card */}
      <div className="trig-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '0 0 8px 0' }}>
          📖 The Surveyor's Personal Journal
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
          What was the most surprising moment of understanding during your journey? How did trigonometry change from
          meaningless calculator buttons into an intuitive way of seeing the world?
        </p>
        <textarea
          rows={4}
          value={journalText}
          onChange={e => setJournalText(e.target.value)}
          placeholder="Record your personal reflections here... (Saved locally to your device)"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--card-border)',
            background: 'var(--surface-inset)',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            resize: 'vertical',
            marginBottom: '12px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
          {journalSaved && <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✔ Journal saved locally!</span>}
          <button type="button" className="trig-btn trig-btn-primary" onClick={handleSaveJournal}>
            Save Entry
          </button>
        </div>
      </div>

      {/* Complete Formula Vault */}
      <div className="trig-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0 }}>
              The Master Formula Vault
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Complete reference cheat-sheet unlocked across all three levels
            </span>
          </div>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={handlePrint}>
            🖨 Print Cheat-Sheet
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.values(SKILLS_REGISTRY).slice(0, 12).map(skill => (
            <div
              key={skill.id}
              className="trig-card"
              style={{
                padding: '14px',
                borderLeft: `4px solid ${skill.level === 1 ? 'var(--color-zenith-blue)' : skill.level === 2 ? 'var(--color-sunlight)' : 'var(--color-side-hyp)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="side-pill side-pill-hyp" style={{ fontSize: '0.75rem' }}>
                  {skill.id} (L{skill.level})
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {skill.title}
                </span>
              </div>
              <div style={{ margin: '8px 0', fontSize: '1.05rem', textAlign: 'center' }}>
                <Tex math={skill.formulas[0] || '1'} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {skill.description}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            type="button"
            className="trig-btn trig-btn-primary"
            onClick={() => dispatch({ type: 'SET_LEVEL', payload: 1 })}
          >
            Revisit Level 1 Explorations ➔
          </button>
        </div>
      </div>
    </div>
  );
};
