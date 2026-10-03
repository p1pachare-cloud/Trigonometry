// src/components/input/MathKeypad.tsx
import React, { useState, useEffect } from 'react';
import { Tex } from '../math/Tex';

interface MathKeypadProps {
  allowSurds?: boolean;
  allowFractions?: boolean;
  allowTrigFunctions?: boolean;
  allowPi?: boolean;
  initialValue?: string;
  placeholder?: string;
  onSubmit: (val: string) => void;
  className?: string;
}

export const MathKeypad: React.FC<MathKeypadProps> = ({
  allowSurds = true,
  allowFractions = true,
  allowTrigFunctions = true,
  allowPi = true,
  initialValue = '',
  placeholder = 'Enter value...',
  onSubmit,
  className = '',
}) => {
  const [inputStr, setInputStr] = useState(initialValue);

  const appendKey = (key: string) => {
    setInputStr(prev => prev + key);
  };

  const handleBackspace = () => {
    setInputStr(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputStr('');
  };

  const handleSubmit = () => {
    if (inputStr.trim().length > 0) {
      onSubmit(inputStr);
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= '0' && e.key <= '9') {
        appendKey(e.key);
      } else if (e.key === '.' || e.key === '+' || e.key === '-' || e.key === '/' || e.key === '*' || e.key === '(' || e.key === ')') {
        appendKey(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className={`math-keypad-container trig-card ${className}`} style={{ padding: '16px', maxWidth: '340px' }}>
      {/* Display Screen */}
      <div
        style={{
          background: 'var(--surface-inset)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.2rem',
          color: 'var(--color-ink-deep)',
          overflowX: 'auto',
        }}
      >
        {inputStr.length > 0 ? (
          <Tex math={inputStr} />
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{placeholder}</span>
        )}
      </div>

      {/* Function Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
        {allowSurds && (
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '8px' }} onClick={() => appendKey('√')}>
            √
          </button>
        )}
        {allowFractions && (
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '8px' }} onClick={() => appendKey('/')}>
            a/b
          </button>
        )}
        {allowPi && (
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '8px' }} onClick={() => appendKey('π')}>
            π
          </button>
        )}
        <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '8px' }} onClick={() => appendKey('^2')}>
          x²
        </button>
      </div>

      {allowTrigFunctions && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '6px' }} onClick={() => appendKey('sin(')}>
            sin
          </button>
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '6px' }} onClick={() => appendKey('cos(')}>
            cos
          </button>
          <button type="button" className="trig-btn trig-btn-secondary" style={{ padding: '6px' }} onClick={() => appendKey('tan(')}>
            tan
          </button>
        </div>
      )}

      {/* Numeric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('7')}>7</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('8')}>8</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('9')}>9</button>
        <button type="button" className="trig-btn trig-btn-secondary" style={{ color: 'var(--color-error)' }} onClick={handleBackspace}>
          ⌫
        </button>

        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('4')}>4</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('5')}>5</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('6')}>6</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('-')}>−</button>

        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('1')}>1</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('2')}>2</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('3')}>3</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('+')}>+</button>

        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('0')}>0</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('.')}>.</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey('(')}>(</button>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={() => appendKey(')')}>)</button>
      </div>

      {/* Action Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
        <button type="button" className="trig-btn trig-btn-secondary" onClick={handleClear}>
          Clear
        </button>
        <button type="button" className="trig-btn trig-btn-primary" onClick={handleSubmit}>
          ✔ Submit
        </button>
      </div>
    </div>
  );
};
