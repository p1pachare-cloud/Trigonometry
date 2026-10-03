// src/phases/Story.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../app/state/AppContext';
import { STORY_PANELS } from '../content/story';
import { Theo } from '../components/mascot/Theo';

export const Story: React.FC = () => {
  const { state, dispatch } = useApp();
  const { level } = state.nav;
  const [activePanelIdx, setActivePanelIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const panels = STORY_PANELS.filter(p => p.level === level);
  const currentPanel = panels[activePanelIdx] || panels[0];
  const isLastPanel = activePanelIdx === panels.length - 1;

  // Stop speech when panel changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [activePanelIdx, level]);

  const handleNext = () => {
    if (isLastPanel) {
      dispatch({ type: 'SET_PHASE', payload: 'simulate' });
    } else {
      setActivePanelIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activePanelIdx > 0) {
      setActivePanelIdx(prev => prev - 1);
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentPanel.spokenText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      <div className="trig-card" style={{ padding: '28px' }}>
        {/* Header with Panel Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="side-pill side-pill-hyp">Historical Narrative</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-mint-dark)' }}>
                Chapter {level} of 3
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', margin: '0 0 4px 0', color: 'var(--text-main)' }}>
              {currentPanel.title}
            </h2>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>📍 {currentPanel.setting}</div>
          </div>

          {/* Stepper Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {panels.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className="trig-btn"
                style={{
                  width: '34px',
                  height: '34px',
                  padding: 0,
                  borderRadius: '50%',
                  background: idx === activePanelIdx ? 'var(--brand-mint-primary)' : 'var(--surface-inset)',
                  color: idx === activePanelIdx ? '#ffffff' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: idx === activePanelIdx ? '2px solid var(--brand-mint-dark)' : '1px solid var(--card-border)',
                  boxShadow: idx === activePanelIdx ? '0 2px 8px rgba(16, 185, 129, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setActivePanelIdx(idx)}
                title={`Panel ${idx + 1}: ${p.title}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Narrative Panel Illustration Stage */}
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            position: 'relative',
            background: '#0a101d',
            border: '1px solid var(--card-border)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            marginBottom: '20px',
          }}
        >
          {/* Main Story Image */}
          {currentPanel.image ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', maxHeight: '460px', overflow: 'hidden' }}>
              <img
                src={currentPanel.image}
                alt={currentPanel.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
              />

              {/* Gradient Bottom Shroud for clean overlay contrast */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 60%, rgba(10,16,29,0.7) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Setting Tag Badge Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                <span>📍</span>
                <span>{currentPanel.setting}</span>
              </div>

              {/* Panel Progress Pill Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--color-sunlight)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                Panel {activePanelIdx + 1} of {panels.length}
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface-inset)',
              }}
            >
              <Theo mood="encouraging" size={110} />
            </div>
          )}
        </div>

        {/* Narrative Dialogue Box */}
        <div
          style={{
            background: 'var(--surface-inset)',
            borderRadius: 'var(--radius-lg)',
            padding: '22px 24px',
            border: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '22px',
          }}
        >
          {/* Theo Avatar Companion */}
          <div
            style={{
              flexShrink: 0,
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'var(--surface-card)',
              border: '2px solid var(--brand-mint-primary)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Theo mood={isLastPanel ? 'celebrating' : 'encouraging'} size={72} />
          </div>

          {/* Dialogue Speech & Narration Audio */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.55, color: 'var(--text-main)' }}>
                "{currentPanel.displayText}"
              </div>

              {/* Narration Listen Button */}
              {'speechSynthesis' in window && (
                <button
                  type="button"
                  className="trig-btn trig-btn-secondary"
                  style={{
                    flexShrink: 0,
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: isSpeaking ? 'var(--brand-coral-primary)' : 'var(--surface-card)',
                    color: isSpeaking ? '#ffffff' : 'var(--text-main)',
                    borderColor: isSpeaking ? 'var(--brand-coral-dark)' : 'var(--card-border)',
                  }}
                  onClick={handleToggleSpeech}
                  title="Listen to historical narration"
                >
                  <span>{isSpeaking ? '⏹ Stop' : '🔊 Listen'}</span>
                </button>
              )}
            </div>

            {state.settings.captions && (
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  borderTop: '1px dashed var(--card-border)',
                  paddingTop: '8px',
                }}
              >
                🎙 Narration Transcript: "{currentPanel.spokenText}"
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="trig-btn trig-btn-secondary"
            disabled={activePanelIdx === 0}
            style={{ opacity: activePanelIdx === 0 ? 0.4 : 1, padding: '10px 20px', fontSize: '0.95rem' }}
            onClick={handlePrev}
          >
            ◀ Previous Panel
          </button>

          <button
            type="button"
            className={`trig-btn ${isLastPanel ? 'trig-btn-coral' : 'trig-btn-primary'}`}
            style={{ padding: '10px 22px', fontSize: '0.95rem' }}
            onClick={handleNext}
          >
            {isLastPanel ? 'Enter Simulation Stations ➔' : 'Next Panel ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};

