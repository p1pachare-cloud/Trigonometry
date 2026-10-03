// src/components/stepper/StepStepper.tsx
import React, { useState } from 'react';
import { Tex } from '../math/Tex';

export interface StepDefinition {
  id: string;
  doText: string;
  showFormula?: string;
  whyExplanation: string;
  check?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

interface StepStepperProps {
  steps: StepDefinition[];
  mode?: 'I' | 'WE' | 'YOU';
  onComplete?: () => void;
  className?: string;
}

export const StepStepper: React.FC<StepStepperProps> = ({
  steps,
  mode = 'WE',
  onComplete,
  className = '',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showWhy, setShowWhy] = useState(false);
  const [selectedCheckIdx, setSelectedCheckIdx] = useState<number | null>(null);
  const [checkError, setCheckError] = useState(false);

  const activeStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    setShowWhy(false);
    setSelectedCheckIdx(null);
    setCheckError(false);

    if (isLastStep) {
      if (onComplete) onComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleCheckAnswer = (idx: number) => {
    setSelectedCheckIdx(idx);
    if (!activeStep.check) return;

    if (idx === activeStep.check.correctIndex) {
      setCheckError(false);
    } else {
      setCheckError(true);
    }
  };

  const isCheckSolved = !activeStep.check || selectedCheckIdx === activeStep.check.correctIndex;

  return (
    <div className={`step-stepper-container trig-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="side-pill side-pill-hyp">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Mode: <strong>{mode === 'I' ? 'I-Do (Watch)' : mode === 'WE' ? 'We-Do (Guided)' : 'You-Do (Solo)'}</strong>
          </span>
        </div>

        <button
          type="button"
          className="trig-btn trig-btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          onClick={() => setShowWhy(!showWhy)}
        >
          {showWhy ? 'Hide Reason' : '💡 Why this step?'}
        </button>
      </div>

      {/* Action Instruction */}
      <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px', lineHeight: 1.4 }}>
        {activeStep.doText}
      </div>

      {/* Formula Demonstration */}
      {activeStep.showFormula && (
        <div
          style={{
            background: 'var(--surface-inset)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            marginBottom: '14px',
            fontSize: '1.2rem',
          }}
        >
          <Tex math={activeStep.showFormula} block={false} />
        </div>
      )}

      {/* "Why does this work?" Explanation Popover */}
      {showWhy && (
        <div
          className="trig-card"
          style={{
            padding: '12px 16px',
            background: 'rgba(255,201,51,0.1)',
            borderLeft: '4px solid var(--color-sunlight)',
            marginBottom: '14px',
            fontSize: '0.9rem',
          }}
        >
          <strong>Why this works: </strong>
          {activeStep.whyExplanation}
        </div>
      )}

      {/* Interactive Micro-Check in We-Do Mode */}
      {activeStep.check && (
        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
            Check: {activeStep.check.prompt}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeStep.check.options.map((opt, idx) => {
              const isSelected = selectedCheckIdx === idx;
              const isCorrect = idx === activeStep.check?.correctIndex;

              let btnStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '0.9rem' };
              if (isSelected && isCorrect) {
                btnStyle = { ...btnStyle, background: 'var(--color-success)', color: '#fff' };
              } else if (isSelected && !isCorrect) {
                btnStyle = { ...btnStyle, background: 'var(--color-error)', color: '#fff' };
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className="trig-btn trig-btn-secondary"
                  style={btnStyle}
                  onClick={() => handleCheckAnswer(idx)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {checkError && (
            <div style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginTop: '8px', fontWeight: 600 }}>
              Not quite! Check the reason above and try again.
            </div>
          )}

          {isCheckSolved && selectedCheckIdx !== null && (
            <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', marginTop: '8px', fontWeight: 600 }}>
              ✔ Correct! {activeStep.check.explanation}
            </div>
          )}
        </div>
      )}

      {/* Advance Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button
          type="button"
          className="trig-btn trig-btn-primary"
          disabled={!isCheckSolved}
          style={{ opacity: isCheckSolved ? 1 : 0.5, cursor: isCheckSolved ? 'pointer' : 'not-allowed' }}
          onClick={handleNext}
        >
          {isLastStep ? '✔ Complete Worked Example' : 'Next Step ➔'}
        </button>
      </div>
    </div>
  );
};
