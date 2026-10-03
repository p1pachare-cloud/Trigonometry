// src/engine/exact.ts
export interface RadicalTerm {
  n: number; // Numerator coefficient
  d: number; // Denominator coefficient (d > 0)
  r: number; // Radicand (square-free integer >= 1)
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return (Math.abs(a) / gcd(a, b)) * Math.abs(b);
}

/** Extracts square factors: r = o^2 * inner (where inner is square-free) */
export function extractSquareFree(r: number): [number, number] {
  if (r <= 0) return [0, 0];
  let out = 1;
  let inner = r;
  for (let f = 2; f * f <= inner; f++) {
    while (inner % (f * f) === 0) {
      out *= f;
      inner /= f * f;
    }
  }
  return [out, inner];
}

/** Combines like radicands, reduces fractions, drops zero terms, sorts by radicand */
export function normalizeTerms(terms: RadicalTerm[]): RadicalTerm[] {
  const map = new Map<number, { n: number; d: number }>();

  for (const { n, d, r } of terms) {
    if (n === 0 || r === 0) continue;
    const [outFactor, squareFreeRad] = extractSquareFree(r);
    const num = n * outFactor;
    const den = d;

    const existing = map.get(squareFreeRad);
    if (!existing) {
      map.set(squareFreeRad, { n: num, d: den });
    } else {
      const commonDen = lcm(existing.d, den);
      const combinedNum = existing.n * (commonDen / existing.d) + num * (commonDen / den);
      map.set(squareFreeRad, { n: combinedNum, d: commonDen });
    }
  }

  const result: RadicalTerm[] = [];
  for (const [r, { n, d }] of map.entries()) {
    if (n === 0) continue;
    const g = gcd(n, d);
    let finalN = n / g;
    let finalD = d / g;
    if (finalD < 0) {
      finalN = -finalN;
      finalD = -finalD;
    }
    result.push({ n: finalN, d: finalD, r });
  }

  return result.sort((a, b) => a.r - b.r);
}

export class Exact {
  public readonly terms: readonly RadicalTerm[];

  constructor(terms: RadicalTerm[]) {
    this.terms = Object.freeze(normalizeTerms(terms));
  }

  public static of(n: number, d = 1, r = 1): Exact {
    return new Exact([{ n, d, r }]);
  }

  public static zero(): Exact {
    return new Exact([]);
  }

  public static one(): Exact {
    return new Exact([{ n: 1, d: 1, r: 1 }]);
  }

  public isZero(): boolean {
    return this.terms.length === 0;
  }

  public add(other: Exact): Exact {
    return new Exact([...this.terms, ...other.terms]);
  }

  public neg(): Exact {
    return new Exact(this.terms.map(t => ({ ...t, n: -t.n })));
  }

  public sub(other: Exact): Exact {
    return this.add(other.neg());
  }

  public mul(other: Exact): Exact {
    const newTerms: RadicalTerm[] = [];
    for (const a of this.terms) {
      for (const b of other.terms) {
        newTerms.push({
          n: a.n * b.n,
          d: a.d * b.d,
          r: a.r * b.r,
        });
      }
    }
    return new Exact(newTerms);
  }

  /** Multiplicative inverse: rationalizes 1-term and 2-term surds using conjugates */
  public reciprocal(): Exact {
    if (this.isZero()) throw new RangeError('Exact division by zero');

    // Case 1: Single radical term: 1 / ( (n/d) * sqrt(r) ) = (d * sqrt(r)) / (n * r)
    if (this.terms.length === 1) {
      const { n, d, r } = this.terms[0];
      return new Exact([{ n: d, d: n * r, r }]);
    }

    // Case 2: Two radical terms: (a*sqrt(p) + b*sqrt(q)) -> Multiply by (a*sqrt(p) - b*sqrt(q))
    if (this.terms.length === 2) {
      const termA = this.terms[0];
      const termB = this.terms[1];
      const conjugate = new Exact([termA, { ...termB, n: -termB.n }]);
      const denomExact = this.mul(conjugate); // (a*sqrt(p))^2 - (b*sqrt(q))^2 is strictly rational
      
      if (denomExact.terms.length === 0) {
        throw new RangeError('Exact division by zero via conjugate cancellation');
      }
      
      const denomTerm = denomExact.terms[0]; // r must be 1
      const scaleN = denomTerm.d;
      const scaleD = denomTerm.n;
      return conjugate.mul(Exact.of(scaleN, scaleD, 1));
    }

    throw new Error('Exact reciprocal supports maximum 2 radical terms');
  }

  public div(other: Exact): Exact {
    return this.mul(other.reciprocal());
  }

  public toFloat(): number {
    return this.terms.reduce((acc, t) => acc + (t.n / t.d) * Math.sqrt(t.r), 0);
  }

  public equals(other: Exact): boolean {
    if (this.terms.length !== other.terms.length) return false;
    for (let i = 0; i < this.terms.length; i++) {
      if (
        this.terms[i].r !== other.terms[i].r ||
        this.terms[i].n !== other.terms[i].n ||
        this.terms[i].d !== other.terms[i].d
      ) {
        return false;
      }
    }
    return true;
  }

  /** Generates clean, canonical LaTeX (e.g., \frac{\sqrt{6} + \sqrt{2}}{4}) */
  public toTeX(): string {
    if (this.isZero()) return '0';

    const commonDen = this.terms.reduce((acc, t) => lcm(acc, t.d), 1);
    
    // Sort terms to put positive leading terms first if possible for aesthetics
    const sorted = [...this.terms].sort((a, b) => {
      if (a.n > 0 && b.n < 0) return -1;
      if (a.n < 0 && b.n > 0) return 1;
      return b.r - a.r;
    });

    const parts = sorted.map((t, idx) => {
      const scaledN = t.n * (commonDen / t.d);
      const sign = scaledN < 0 ? '-' : (idx === 0 ? '' : '+');
      const absN = Math.abs(scaledN);

      let radicalPart = '';
      if (t.r === 1) {
        radicalPart = `${absN}`;
      } else if (absN === 1) {
        radicalPart = `\\sqrt{${t.r}}`;
      } else {
        radicalPart = `${absN}\\sqrt{${t.r}}`;
      }

      return `${sign}${radicalPart}`;
    });

    const numStr = parts.join('');
    return commonDen === 1 ? numStr : `\\frac{${numStr}}{${commonDen}}`;
  }
}
