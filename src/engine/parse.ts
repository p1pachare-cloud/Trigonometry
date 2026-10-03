// src/engine/parse.ts
export function evalMathExpression(src: string, variables: Record<string, number> = {}): number {
  const clean = src
    .replace(/\s+/g, '')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt');

  let idx = 0;

  const FN_MAP: Record<string, (x: number) => number> = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sqrt: Math.sqrt,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sec: (x) => 1 / Math.cos(x),
    csc: (x) => 1 / Math.sin(x),
    cosec: (x) => 1 / Math.sin(x),
    cot: (x) => 1 / Math.tan(x),
  };

  function parseExpression(): number {
    let val = parseTerm();
    while (clean[idx] === '+' || clean[idx] === '-') {
      const op = clean[idx++];
      const nextTerm = parseTerm();
      val = op === '+' ? val + nextTerm : val - nextTerm;
    }
    return val;
  }

  function parseTerm(): number {
    let val = parsePower();
    while (idx < clean.length) {
      if (clean[idx] === '*') {
        idx++;
        val *= parsePower();
      } else if (clean[idx] === '/') {
        idx++;
        const denom = parsePower();
        if (Math.abs(denom) < 1e-12) throw new RangeError('Division by zero');
        val /= denom;
      } else if (isAtomStart(clean[idx])) {
        // Implicit multiplication: e.g., 2sqrt(3), 3sin(x), (2+3)(4+5)
        val *= parsePower();
      } else {
        break;
      }
    }
    return val;
  }

  function parsePower(): number {
    const base = parseUnary();
    if (clean[idx] === '^') {
      idx++;
      const exponent = parseUnary();
      return Math.pow(base, exponent);
    }
    return base;
  }

  function parseUnary(): number {
    if (clean[idx] === '+') {
      idx++;
      return parseUnary();
    }
    if (clean[idx] === '-') {
      idx++;
      return -parseUnary();
    }
    return parseFactor();
  }

  function parseFactor(): number {
    if (clean[idx] === '(') {
      idx++;
      const val = parseExpression();
      if (clean[idx++] !== ')') throw new Error('Expected closing parenthesis');
      return val;
    }

    // Number literal
    const numMatch = /^(\d+\.?\d*|\.\d+)/.exec(clean.slice(idx));
    if (numMatch) {
      idx += numMatch[0].length;
      return parseFloat(numMatch[0]);
    }

    // Identifiers (functions or variables)
    const idMatch = /^[a-zA-Z]+/.exec(clean.slice(idx));
    if (!idMatch) throw new Error(`Unexpected character: ${clean[idx]}`);
    
    idx += idMatch[0].length;
    const name = idMatch[0].toLowerCase();

    if (name === 'pi') return Math.PI;
    if (name in variables) return variables[name];

    if (name in FN_MAP) {
      let arg: number;
      if (clean[idx] === '(') {
        idx++;
        arg = parseExpression();
        if (clean[idx++] !== ')') throw new Error('Expected closing parenthesis for function');
      } else {
        arg = parseFactor(); // Handles sqrt3 without parens
      }
      return FN_MAP[name](arg);
    }

    throw new Error(`Unknown identifier: ${name}`);
  }

  function isAtomStart(c: string | undefined): boolean {
    return c !== undefined && /[0-9.(a-zA-Z]/.test(c);
  }

  const result = parseExpression();
  if (idx !== clean.length) throw new Error(`Trailing unparsed tokens: ${clean.slice(idx)}`);
  return result;
}

export function areExpressionsEquivalent(
  exprA: string,
  exprB: string,
  rng: () => number,
  samples = 50,
  tol = 1e-9
): boolean {
  let validTests = 0;
  for (let i = 0; i < samples * 3 && validTests < samples; i++) {
    const testAngle = (rng() * 4 - 2) * Math.PI; // Random angle in [-2pi, 2pi]
    try {
      const valA = evalMathExpression(exprA, { x: testAngle, theta: testAngle, t: testAngle });
      const valB = evalMathExpression(exprB, { x: testAngle, theta: testAngle, t: testAngle });

      if (!Number.isFinite(valA) || !Number.isFinite(valB)) continue;
      if (Math.abs(valA) > 1e6 || Math.abs(valB) > 1e6) continue; // Skip near asymptotes

      validTests++;
      const diff = Math.abs(valA - valB);
      if (diff > tol * Math.max(1, Math.abs(valA), Math.abs(valB))) {
        return false;
      }
    } catch {
      // Discard singularities (e.g. division by zero at domain boundaries)
      continue;
    }
  }
  return validTests >= Math.min(samples, 15);
}
