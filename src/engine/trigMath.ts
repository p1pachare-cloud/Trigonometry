// src/engine/trigMath.ts
import { Exact } from './exact';

export type TrigFn = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot' | 'cosec';

export const normalizeDegrees360 = (deg: number): number => ((deg % 360) + 360) % 360;
export const degToRad = (deg: number): number => (deg * Math.PI) / 180;
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

export function getQuadrant(deg: number): 1 | 2 | 3 | 4 | 'axis' {
  const norm = normalizeDegrees360(deg);
  if (norm % 90 === 0) return 'axis';
  if (norm < 90) return 1;
  if (norm < 180) return 2;
  if (norm < 270) return 3;
  return 4;
}

export function getReferenceAngle(deg: number): number {
  const norm = normalizeDegrees360(deg);
  if (norm <= 90) return norm;
  if (norm <= 180) return 180 - norm;
  if (norm <= 270) return norm - 180;
  return 360 - norm;
}

/** Pre-computed exact surd values for all special acute angles including 15° and 75° */
const EXACT_SPECIAL_MAP: Record<number, { sin: Exact; cos: Exact }> = {
  0: {
    sin: Exact.zero(),
    cos: Exact.one(),
  },
  15: {
    // (sqrt(6) - sqrt(2)) / 4
    sin: new Exact([{ n: 1, d: 4, r: 6 }, { n: -1, d: 4, r: 2 }]),
    // (sqrt(6) + sqrt(2)) / 4
    cos: new Exact([{ n: 1, d: 4, r: 6 }, { n: 1, d: 4, r: 2 }]),
  },
  30: {
    sin: Exact.of(1, 2, 1),
    cos: Exact.of(1, 2, 3),
  },
  45: {
    sin: Exact.of(1, 2, 2),
    cos: Exact.of(1, 2, 2),
  },
  60: {
    sin: Exact.of(1, 2, 3),
    cos: Exact.of(1, 2, 1),
  },
  75: {
    // (sqrt(6) + sqrt(2)) / 4
    sin: new Exact([{ n: 1, d: 4, r: 6 }, { n: 1, d: 4, r: 2 }]),
    // (sqrt(6) - sqrt(2)) / 4
    cos: new Exact([{ n: 1, d: 4, r: 6 }, { n: -1, d: 4, r: 2 }]),
  },
  90: {
    sin: Exact.one(),
    cos: Exact.zero(),
  },
};

export function getExactTrig(fn: TrigFn, deg: number): Exact | null {
  const ref = getReferenceAngle(deg);
  if (!(ref in EXACT_SPECIAL_MAP)) return null;

  const base = EXACT_SPECIAL_MAP[ref];
  const norm = normalizeDegrees360(deg);

  // ASTC signs
  const sinSign = (norm === 0 || norm === 180 || norm === 360) ? 1 : (norm > 180 ? -1 : 1);
  const cosSign = (norm === 90 || norm === 270) ? 1 : (norm > 90 && norm < 270 ? -1 : 1);

  const signedSin = sinSign < 0 ? base.sin.neg() : base.sin;
  const signedCos = cosSign < 0 ? base.cos.neg() : base.cos;

  switch (fn) {
    case 'sin': return signedSin;
    case 'cos': return signedCos;
    case 'tan': return signedCos.isZero() ? null : signedSin.div(signedCos);
    case 'csc':
    case 'cosec': return signedSin.isZero() ? null : signedSin.reciprocal();
    case 'sec': return signedCos.isZero() ? null : signedCos.reciprocal();
    case 'cot': return signedSin.isZero() ? null : signedCos.div(signedSin);
  }
}

/** Complete solution for the SSA Ambiguous Case */
export interface AmbiguousCaseResult {
  triangleCount: 0 | 1 | 2;
  altitude: number;
  triangles: Array<{ angleB: number; angleC: number; sideC: number }>;
}

export function solveAmbiguousCase(angleADeg: number, sideA: number, sideB: number): AmbiguousCaseResult {
  const radA = degToRad(angleADeg);
  const h = sideB * Math.sin(radA);
  const eps = 1e-9;

  if (angleADeg >= 90) {
    if (sideA <= sideB + eps) return { triangleCount: 0, altitude: h, triangles: [] };
    const sinB = (sideB * Math.sin(radA)) / sideA;
    const angleB = radToDeg(Math.asin(sinB));
    const angleC = 180 - angleADeg - angleB;
    const sideC = (sideA * Math.sin(degToRad(angleC))) / Math.sin(radA);
    return { triangleCount: 1, altitude: h, triangles: [{ angleB, angleC, sideC }] };
  }

  // Acute angle A
  if (sideA < h - eps) {
    return { triangleCount: 0, altitude: h, triangles: [] };
  }
  
  if (Math.abs(sideA - h) <= eps) {
    const angleB = 90;
    const angleC = 90 - angleADeg;
    const sideC = sideB * Math.cos(radA);
    return { triangleCount: 1, altitude: h, triangles: [{ angleB, angleC, sideC }] };
  }

  if (sideA >= sideB) {
    const sinB = (sideB * Math.sin(radA)) / sideA;
    const angleB = radToDeg(Math.asin(sinB));
    const angleC = 180 - angleADeg - angleB;
    const sideC = (sideA * Math.sin(degToRad(angleC))) / Math.sin(radA);
    return { triangleCount: 1, altitude: h, triangles: [{ angleB, angleC, sideC }] };
  }

  // Two valid triangles: h < sideA < sideB
  const sinB = (sideB * Math.sin(radA)) / sideA;
  const angleB1 = radToDeg(Math.asin(sinB));
  const angleC1 = 180 - angleADeg - angleB1;
  const sideC1 = (sideA * Math.sin(degToRad(angleC1))) / Math.sin(radA);

  const angleB2 = 180 - angleB1;
  const angleC2 = 180 - angleADeg - angleB2;
  const sideC2 = (sideA * Math.sin(degToRad(angleC2))) / Math.sin(radA);

  return {
    triangleCount: 2,
    altitude: h,
    triangles: [
      { angleB: angleB1, angleC: angleC1, sideC: sideC1 },
      { angleB: angleB2, angleC: angleC2, sideC: sideC2 },
    ],
  };
}

/** Right triangle missing side helper */
export function solveRightTriangleSide(
  thetaDeg: number,
  knownType: 'opp' | 'adj' | 'hyp',
  knownVal: number,
  targetType: 'opp' | 'adj' | 'hyp'
): { fn: 'sin' | 'cos' | 'tan'; isMultiply: boolean; value: number } {
  const rad = degToRad(thetaDeg);
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const t = Math.tan(rad);

  if (knownType === 'hyp') {
    if (targetType === 'opp') return { fn: 'sin', isMultiply: true, value: knownVal * s };
    return { fn: 'cos', isMultiply: true, value: knownVal * c };
  }
  if (knownType === 'opp') {
    if (targetType === 'hyp') return { fn: 'sin', isMultiply: false, value: knownVal / s };
    return { fn: 'tan', isMultiply: false, value: knownVal / t };
  }
  // known is adj
  if (targetType === 'hyp') return { fn: 'cos', isMultiply: false, value: knownVal / c };
  return { fn: 'tan', isMultiply: true, value: knownVal * t };
}
