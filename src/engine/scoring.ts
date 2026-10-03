// src/engine/scoring.ts
export interface ScoreCalcParams {
  attemptNumber: number; // 1 = clean, 2 = hint 1, 3 = hint 2, 4 = reveal
  streak: number;
}

export function calculateSP(params: ScoreCalcParams): { sp: number; bonus: number } {
  let base = 0;
  if (params.attemptNumber === 1) base = 10;
  else if (params.attemptNumber === 2) base = 7;
  else if (params.attemptNumber === 3) base = 4;
  else base = 2; // participation

  const bonus = params.streak >= 5 ? 3 : 0;
  return { sp: base + bonus, bonus };
}

export function evaluateLevelStamp(
  coreMasteries: number[],
  bossPassed: boolean,
  bossScore: number,
  revealHintsUsed: number
): 'none' | 'bronze' | 'silver' | 'gold' {
  if (coreMasteries.length === 0) return 'none';
  const minM = Math.min(...coreMasteries);

  if (minM >= 0.90 && bossPassed && bossScore >= 7 && revealHintsUsed <= 5) {
    return 'gold';
  }
  if (minM >= 0.80 && bossPassed) {
    return 'silver';
  }
  if (minM >= 0.70) {
    return 'bronze';
  }
  return 'none';
}
