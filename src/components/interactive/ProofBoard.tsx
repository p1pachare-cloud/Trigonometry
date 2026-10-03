// src/components/interactive/ProofBoard.tsx
import React, { useState } from 'react';
import { Tex } from '../math/Tex';

export interface ProofStep {
  id: string;
  tex: string;
  moveName: string;
  explanation: string;
}

interface ProofBoardProps {
  targetStatement: { lhs: string; rhs: string };
  scrambledSteps: ProofStep[];
  onComplete?: () => void;
  className?: string;
}

export const ProofBoard: React.FC<ProofBoardProps> = ({
  targetStatement,
  scrambledSteps,
  onComplete,
  className = '',
}) => {
  const [placedSteps, setPlacedSteps] = useState<ProofStep[]>([]);
  const [availableSteps, setAvailableSteps] = useState<ProofStep[]>(scrambledSteps);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddStep = (step: ProofStep) => {
    const nextPlaced = [...placedSteps, step];
    setPlacedSteps(nextPlaced);
    setAvailableSteps(availableSteps.filter(s => s.id !== step.id));

    // If all steps placed
    if (nextPlaced.length === scrambledSteps.length) {
      setIsSuccess(true);
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    setPlacedSteps([]);
    setAvailableSteps(scrambledSteps);
    setIsSuccess(false);
  };

  return (
    <div className={`proof-board-container trig-card ${className}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.15rem' }}>
          Analytic Proof Workspace
        </h4>
        <button
          type="button"
          className="trig-btn trig-btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          onClick={handleReset}
        >
          Reset Proof
        </button>
      </div>

      {/* Target Theorem Statement */}
      <div
        style={{
          background: 'var(--surface-inset)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          textAlign: 'center',
          borderLeft: '4px solid var(--color-zenith-blue)',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
          PROVE THE IDENTITY (LHS → RHS)
        </span>
        <div style={{ fontSize: '1.25rem' }}>
          <Tex math={`${targetStatement.lhs} \\equiv ${targetStatement.rhs}`} block={false} />
        </div>
      </div>

      {/* Active Proof Slot Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        <div style={{ padding: '8px 12px', background: 'var(--surface-inset)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>LHS: </span>
          <Tex math={targetStatement.lhs} />
        </div>

        {placedSteps.map((step, idx) => (
          <div
            key={step.id}
            className="trig-card"
            style={{
              padding: '10px 14px',
              borderLeft: '4px solid var(--color-sunlight)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '8px' }}>
                Step {idx + 1}:
              </span>
              <Tex math={`= ${step.tex}`} />
            </div>
            <span
              className="side-pill side-pill-adj"
              style={{ fontSize: '0.75rem', padding: '3px 8px' }}
            >
              {step.moveName}
            </span>
          </div>
        ))}

        {isSuccess && (
          <div
            className="trig-card"
            style={{
              padding: '10px 14px',
              borderLeft: '4px solid var(--color-success)',
              background: 'var(--color-success-bg)',
              fontWeight: 800,
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>= RHS Q.E.D. ✔ Proof Complete!</span>
            <span>🏆</span>
          </div>
        )}
      </div>

      {/* Available Scrambled Tiles */}
      {!isSuccess && (
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Choose the Next Valid Algebraic Move:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableSteps.map(step => (
              <button
                key={step.id}
                type="button"
                className="trig-btn trig-btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  textAlign: 'left',
                  width: '100%',
                }}
                onClick={() => handleAddStep(step)}
              >
                <div>
                  <Tex math={`= ${step.tex}`} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {step.explanation}
                  </div>
                </div>
                <span className="side-pill side-pill-hyp" style={{ fontSize: '0.75rem' }}>
                  {step.moveName}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
