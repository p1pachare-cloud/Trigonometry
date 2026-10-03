// src/engine/mastery.ts
export const INITIAL_MASTERY = 0.25;
export const MASTERY_THRESHOLD = 0.70;
export const MIN_ATTEMPTS = 4;

export function calculateMasteryDelta(
  currentM: number,
  correct: boolean,
  attemptNumber: number // 1 = first try clean, 2 = after hint 1, 3 = after hint 2
): number {
  if (correct) {
    const alpha = attemptNumber === 1 ? 0.25 : 0.125;
    return currentM + alpha * (1.0 - currentM);
  } else {
    const beta = 0.20;
    return Math.max(0.05, currentM - beta * currentM);
  }
}

/** Spaced memory decay for skills unpracticed for > 24 hours */
export function applyTimeDecay(currentM: number, hoursSinceLastPractice: number): number {
  if (hoursSinceLastPractice <= 24 || currentM <= 0.50) return currentM;
  const decayWeeks = (hoursSinceLastPractice - 24) / (24 * 7);
  const decayFactor = Math.min(0.20, decayWeeks * 0.05);
  return Math.max(0.50, currentM - (currentM - 0.50) * decayFactor);
}

export function isSkillMastered(m: number, attempts: number): boolean {
  return m >= MASTERY_THRESHOLD && attempts >= MIN_ATTEMPTS;
}

export function areAllCoreSkillsMastered(
  coreSkillIds: string[],
  masteryState: Record<string, { m: number; attempts: number }>
): boolean {
  return coreSkillIds.every(id => {
    const s = masteryState[id];
    return s && isSkillMastered(s.m, s.attempts);
  });
}
