// src/app/CalculatorModal.tsx
import React, { useState } from 'react';
import { useApp } from './state/AppContext';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const { level } = state.nav;

  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcMode, setCalcMode] = useState<'DEG' | 'RAD'>('DEG');

  if (!isOpen) return null;

  const handleKey = (char: string) => {
    if (calcDisplay === '0' && !isNaN(Number(char))) {
      setCalcDisplay(char);
    } else {
      setCalcDisplay(prev => prev + char);
    }
  };

  const handleClear = () => {
    setCalcDisplay('0');
  };

  const handleBackspace = () => {
    setCalcDisplay(prev => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  const handleTrig = (fn: 'sin' | 'cos' | 'tan') => {
    try {
      const num = parseFloat(calcDisplay);
      if (isNaN(num)) return;
      const angleRad = calcMode === 'DEG' ? (num * Math.PI) / 180 : num;
      let res = 0;
      if (fn === 'sin') res = Math.sin(angleRad);
      if (fn === 'cos') res = Math.cos(angleRad);
      if (fn === 'tan') res = Math.tan(angleRad);
      setCalcDisplay(parseFloat(res.toFixed(4)).toString());
    } catch {
      setCalcDisplay('Error');
    }
  };

  const handleEqual = () => {
    try {
      const sanitized = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${sanitized})`)();
      setCalcDisplay(parseFloat(Number(res).toFixed(4)).toString());
    } catch {
      setCalcDisplay('Error');
    }
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
          maxWidth: '330px',
          padding: '20px',
          background: 'var(--card-bg)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
              Surveyor's Calculator
            </span>
            {/* Mode Badge */}
            <button
              type="button"
              className="side-pill"
              style={{
                background: calcMode === 'DEG' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                color: calcMode === 'DEG' ? 'var(--color-success)' : 'var(--color-warning)',
                border: `1.5px solid ${calcMode === 'DEG' ? 'var(--color-success)' : 'var(--color-warning)'}`,
                cursor: level === 1 ? 'default' : 'pointer',
                fontSize: '0.75rem',
              }}
              title={level === 1 ? 'Locked in DEG mode for Level 1' : 'Tap to switch DEG / RAD'}
              onClick={() => {
                if (level > 1) {
                  setCalcMode(prev => (prev === 'DEG' ? 'RAD' : 'DEG'));
                }
              }}
            >
              {calcMode} MODE {level === 1 && '(🔒)'}
            </button>
          </div>
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '2px 8px' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Screen */}
        <div
          style={{
            background: 'var(--surface-inset)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-ink-deep)',
            marginBottom: '14px',
            overflowX: 'auto',
          }}
        >
          {calcDisplay}
        </div>

        {/* Calculator Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <button type="button" className="trig-btn trig-btn-coral" onClick={() => handleTrig('sin')}>sin</button>
          <button type="button" className="trig-btn trig-btn-coral" onClick={() => handleTrig('cos')}>cos</button>
          <button type="button" className="trig-btn trig-btn-coral" onClick={() => handleTrig('tan')}>tan</button>
          <button type="button" className="trig-btn trig-btn-secondary" style={{ color: 'var(--color-error)' }} onClick={handleClear}>C</button>

          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('7')}>7</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('8')}>8</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('9')}>9</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('÷')}>÷</button>

          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('4')}>4</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('5')}>5</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('6')}>6</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('×')}>×</button>

          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('1')}>1</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('2')}>2</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('3')}>3</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('-')}>−</button>

          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('0')}>0</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('.')}>.</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={handleBackspace}>⌫</button>
          <button type="button" className="trig-btn trig-btn-secondary" onClick={() => handleKey('+')}>+</button>

          <button
            type="button"
            className="trig-btn trig-btn-primary"
            style={{ gridColumn: 'span 4', marginTop: '4px' }}
            onClick={handleEqual}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
