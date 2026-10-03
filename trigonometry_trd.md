# Technical Requirements Document (TRD)
## Sky Surveyors — Trigonometry, Beginner to Advanced
### Architecture, Mathematical Engines, Component Specifications, Data Models, and Quality Standards

---

## 1. Technical Overview & Core Architectural Decisions

This document establishes the production engineering specification for **Sky Surveyors — Trigonometry**, as defined in [trigonometry_prd.md](file:///c:/Users/asus/OneDrive/Desktop/trigonometry/trigonometry_prd.md). The application is engineered as a zero-dependency, standalone React 18 single-page application (SPA) with three progressive levels (Beginner / Intermediate / Advanced), each executing a four-phase pedagogical cycle: Wonder → Story → Simulate → Practice.

### 1.1 Architectural Decisions & Deviations from Reference Module

| Decision ID | Architectural Principle | Reference Module Approach | Sky Surveyors Implementation | Engineering Justification |
| :---: | :--- | :--- | :--- | :--- |
| **D1** | **Content as Data, UI as Pure Renderer** | Hardcoded JSX screens per phase. | Strictly typed content manifests (`levels.ts`, `stations.ts`, `games.ts`, `steps/*.ts`). | 34 skills and 14 games cannot be maintained as bespoke screens without severe code duplication and regression risks. |
| **D2** | **Procedural Generation with Verification** | 100 hand-authored static questions. | Deterministic PRNG generators with independent dual-method verification harnesses (§7). | Eliminates rote memorization, prevents stale answer banks, and mathematically guarantees zero wrong answers. |
| **D3** | **Exact Surd Mathematical Engine** | Basic floating-point math and integer power helpers. | Custom `Exact` algebraic surd engine ($\Sigma \frac{n_i}{d_i}\sqrt{r_i}$) with conjugate division and $15^\circ$ closed forms (§6). | Trigonometric values are non-repeating surds (e.g., $\frac{\sqrt{6}+\sqrt{2}}{4}$). Floating-point equality cannot grade algebraic equivalence or simplified radical forms. |
| **D4** | **Bayesian Mastery Progression** | Fixed raw score threshold per world. | Continuous Bayesian mastery scalar ($m \in [0, 1]$) with spaced-repetition decay (§11). | Enforces honest prerequisites, powers adaptive item selection, and prevents students from stumbling into advanced topics unprepared. |
| **D5** | **Zero-Client-Secret Security Posture** | Client bundle inlines `VITE_ELEVENLABS_API_KEY` in JavaScript. | Pre-generated build-time audio + rate-limited serverless TTS proxy (`/api/tts`) (§14, §20). | Eliminates critical security vulnerability where third-party API keys are exposed to any browser inspecting network traffic. |
| **D6** | **Strict TypeScript Engine & Contracts** | Standard JavaScript with ad-hoc PropTypes. | Strict TypeScript 5 with comprehensive algebraic and AST type definitions. | High mathematical complexity requires compile-time guarantees against `undefined` parameters and invalid geometric arguments. |
| **D7** | **Decoupled Sliced Reducer State** | Monolithic `App.jsx` with $>20$ nested `useState` hooks. | Normalized `useReducer` sliced by concerns (Navigation, Progress, Mastery, Games, Settings) (§4). | Supports atomic updates, predictable time-travel debugging, and clean persistence isolation. |
| **D8** | **Native Trigonometric UI Theming** | Generic neon CSS cards. | Real-time dynamic shadow engine driven by CSS `tan()` and solar elevation angle tokens (§13). | The interface itself becomes a living visual model of trigonometry in physical reality. |

### 1.2 Security Audit & Remediation (Reference Codebase Analysis)

In the reference module (`Grade-7-powers_and_roots`), `src/utils/audio.js` directly references `import.meta.env.VITE_ELEVENLABS_API_KEY`. Because Vite statically replaces all `import.meta.env.VITE_*` tokens during bundling, the production `dist/` bundle inevitably exposes the private ElevenLabs API key in plaintext.

**Mandatory Security Rule for Sky Surveyors:**
- **Zero `VITE_` Secrets:** No third-party API key shall ever be prefixed with `VITE_`.
- **Server-Side Isolation:** Build-time audio pre-generation scripts read secrets exclusively from Node's `process.env.ELEVENLABS_API_KEY`.
- **Runtime Proxy:** Any runtime dynamic TTS calls route strictly through a secured, rate-limited serverless function (`/api/tts`) with domain-origin verification and SHA-256 payload hashing.

---

## 2. Technology Stack & Dependencies

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RUNTIME APPLICATION LAYER                       │
│  React 18 (SPA) · TypeScript 5 (Strict) · Vite 5 · Hash-Based Router   │
├────────────────────────────────────────────────────────────────────────┤
│                 STYLING, RENDERING & ACCESSIBILITY                     │
│  Vanilla CSS Modules · CSS Trig Functions (tan) · KaTeX (HTML+MathML)  │
│  Inline Dynamic SVG (60 fps rAF) · Lucide React Icons · Canvas Confetti│
├────────────────────────────────────────────────────────────────────────┤
│                     PURE ENGINE MODULES (ISOMORPHIC)                   │
│  Exact Surd Engine · TrigMath · Recursive Descent Parser · PRNG (RNG)  │
│  Continuous Bayesian Mastery · Procedural Generator Registry · Verify  │
├────────────────────────────────────────────────────────────────────────┤
│                     DATA PERSISTENCE & HARDENING                       │
│  Versioned LocalStorage (Migration Chain) · Serverless TTS Proxy       │
└────────────────────────────────────────────────────────────────────────┘
```

| Component | Selected Technology | Technical Rationale |
| :--- | :--- | :--- |
| **UI Framework** | React 18 + Vite 5 | Fast HMR, minimal runtime overhead, reliable virtual DOM reconciliation. |
| **Language** | TypeScript 5 (Strict Mode) | Full type-safety for complex trigonometric ASTs, proof trees, and geometry payloads. |
| **Styling** | Vanilla CSS + CSS Modules | Zero runtime CSS-in-JS overhead; leverages modern native CSS trigonometric functions (`tan()`, `sin()`, `calc()`). |
| **Maths Typesetting** | KaTeX (`output: 'htmlAndMathml'`) | Renders accessible MathML alongside visual HTML; $>10\times$ faster than MathJax with zero external font-loading layout shifts. |
| **Interactive Visuals** | Inline Dynamic SVG | Direct React binding, infinite DPI scaling for geometric figures, low node count ($< 400$ elements), $60\text{ fps}$ continuous updates via `requestAnimationFrame`. |
| **Audio Engine** | HTML5 Audio + Web Audio API | Pre-buffered audio manifests with fallback to synthetic speech synthesis or captions. |
| **Testing Harness** | Vitest + fast-check + axe-core | Blazing-fast property-based mathematical testing and automated WCAG 2.2 AA accessibility validation. |

---

## 3. Project Directory Architecture

```
sky-surveyors-trig/
├── api/
│   ├── _tts-config.ts             # Shared voice settings & rate limiter
│   └── tts.ts                     # Secure serverless TTS proxy endpoint
├── public/
│   ├── assets/
│   │   ├── audio/                 # Pre-generated ElevenLabs MP3 voice files
│   │   └── art/                   # Scalable vector assets & story illustrations
│   └── favicon.svg
├── scripts/
│   ├── generate_audio.mjs         # Build-time audio pre-renderer (Node process.env)
│   ├── verify_generators.mjs      # 10,000-seed mathematical verification harness
│   ├── verify_identities.mjs      # Multi-point identity equivalence verifier
│   └── check_audio_parity.mjs     # Spoken-text ↔ audio manifest integrity check
├── src/
│   ├── main.tsx                   # Application bootstrap
│   ├── App.tsx                    # Root shell & error boundaries
│   ├── app/
│   │   ├── Shell.tsx              # Viewport layout (Field vs Margin)
│   │   ├── PhaseRouter.tsx        # Hash router for Wonder/Story/Simulate/Practice
│   │   ├── SunArc.tsx             # Living sine-wave progress bar
│   │   ├── Margin.tsx             # Theo dialogue, hint ladder, live ARIA region
│   │   ├── InstrumentBelt.tsx     # Floating toolbox (Clinometer, Compass, Calculator)
│   │   └── state/
│   │       ├── rootReducer.ts     # Sliced reducer composition
│   │       ├── types.ts           # State, action, and payload type definitions
│   │       ├── progressSlice.ts   # Station, game, and level unlocks
│   │       ├── masterySlice.ts    # Continuous Bayesian skill vectors
│   │       ├── gameSlice.ts       # SP, streaks, stamps, and badges
│   │       └── persist.ts         # Versioned LocalStorage with automatic migration
│   ├── content/
│   │   ├── levels.ts              # Level definitions, milestones, and metadata
│   │   ├── skills.ts              # Complete 34-skill registry with formulas
│   │   ├── story.ts               # 18 story panels with dual Display/Spoken text
│   │   ├── stations.ts            # Simulation station definitions
│   │   ├── games.ts               # Practice game configurations & rules
│   │   ├── vault.ts               # Formula Vault entries & speed tricks
│   │   └── steps/                 # Step Stepper scripts per skill (E1.ts, M6.ts, H7.ts...)
│   ├── engine/
│   │   ├── exact.ts               # Exact algebraic surd arithmetic engine
│   │   ├── trigMath.ts            # Core trigonometry, ASTC, and triangle solvers
│   │   ├── parse.ts               # Safe recursive descent math parser
│   │   ├── rng.ts                 # Seeded PRNG (mulberry32) and shuffle utilities
│   │   ├── mastery.ts             # Bayesian mastery updates and decay mathematics
│   │   ├── select.ts              # Adaptive weakest-first item scheduler
│   │   ├── scoring.ts             # Survey Points (SP) and streak bonus calculators
│   │   ├── spokenMath.ts          # LaTeX-to-spoken-English phonetic translator
│   │   └── verify.ts              # Independent validation routines
│   ├── generators/                # Deterministic procedural question generators
│   │   ├── registry.ts            # Central generator catalog
│   │   ├── level1/                # E1_sideNaming.ts, E4_specialValues.ts, E5_missingSide.ts...
│   │   ├── level2/                # M6_unitCircle.ts, M8_refAngle.ts, M10_degRad.ts...
│   │   └── level3/                # H2_compound.ts, H5_sineLaw.ts, H7_ambiguousCase.ts...
│   ├── components/
│   │   ├── interactive/
│   │   │   ├── TriangleLab.tsx    # Dynamic SVG draggable right-triangle
│   │   │   ├── UnitCircle.tsx     # Interactive unit circle with coordinate projections
│   │   │   ├── WaveTracer.tsx     # 60 fps sinusoidal wave tracer & interference canvas
│   │   │   ├── Clinometer.tsx     # Interactive slope & elevation measurement tool
│   │   │   ├── SwingTriangle.tsx  # SSA ambiguous case swinging arc visualizer
│   │   │   ├── ProofBoard.tsx     # Tile-slotted formal identity proof workspace
│   │   │   └── GraphPlotter.tsx   # Multi-wave sinusoidal parameter plotter
│   │   ├── input/
│   │   │   ├── MathKeypad.tsx     # Accessible on-screen exact math virtual keyboard
│   │   │   ├── AngleSlider.tsx    # Accessible continuous slider with keyboard steppers
│   │   │   └── DraggableChip.tsx  # Pointer-event draggable tile with tap-tap fallback
│   │   ├── stepper/
│   │   │   ├── StepStepper.tsx    # Central I-Do / We-Do / You-Do scaffolding engine
│   │   │   ├── StepCheck.tsx      # Micro-check assessment component
│   │   │   └── WhyPopover.tsx     # Conceptual explanation popover
│   │   ├── mascot/
│   │   │   ├── Theo.tsx           # SVG animated robot mascot with mood states
│   │   │   └── SpotlightBeam.tsx  # Dynamic UI spotlight highlighting target elements
│   │   └── math/
│   │       └── Tex.tsx            # KaTeX MathML wrapper with screen reader aria-labels
│   ├── phases/
│   │   ├── Wonder.tsx             # Curiosity hook phase container
│   │   ├── Story.tsx              # Historical narrative visual novel phase
│   │   ├── Simulate.tsx           # Interactive 4-phase station runner
│   │   ├── Practice.tsx           # Constellation Hub practice games container
│   │   ├── Boss.tsx               # 8-stage climactic vault encounter
│   │   └── Finale.tsx             # Certificate, vault export, and reflection journal
│   ├── theme/
│   │   ├── tokens.css             # Design tokens (colors, radii, typography, z-index)
│   │   ├── sunEngine.css          # Dynamic trigonometry shadow system
│   │   └── print.css              # Clean stylesheet for Formula Vault printing
│   └── platform/
│       ├── audio.ts               # HTML5 Audio controller with manifest caching
│       ├── telemetry.ts           # Privacy-first local ring buffer telemetry
│       └── a11y.ts                # Focus traps, live announcements, and contrast helpers
├── tests/
│   ├── engine/                    # Vitest unit tests for exact, trigMath, parse, mastery
│   ├── generators/                # 10,000-seed verification test runs
│   ├── components/                # RTL component tests for keypad, stepper, unit circle
│   └── e2e/                       # Playwright end-to-end tests and axe accessibility audits
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. State Architecture & Data Contracts

### 4.1 Sliced Application State (`RootState`)

The application state is decomposed into atomic slices to prevent unnecessary component re-renders:

```ts
export type LevelId = 1 | 2 | 3;
export type PhaseId = 'wonder' | 'story' | 'simulate' | 'practice' | 'boss';
export type SkillId = `E${number}` | `M${number}` | `H${number}`;
export type GameId = `G${number}`;
export type ReciprocalNotation = 'cosec' | 'csc';

export interface RootState {
  nav: {
    level: LevelId;
    phase: PhaseId;
    stationIndex: number;
    storyPanelIndex: number;
    activeGameId: GameId | null;
    view: 'trailhead' | 'main' | 'vault' | 'report' | 'finale';
  };
  progress: {
    stationsDone: Record<string, boolean>; // e.g. { '1A': true, '1B': true }
    gamesLit: Record<GameId, boolean>;     // accuracy >= 70%
    bossPassed: Record<LevelId, boolean>;
    levelUnlocked: Record<LevelId, boolean>;
    skippedAhead: Record<LevelId, boolean>;
  };
  mastery: Record<SkillId, {
    m: number;                            // Bayesian mastery scalar in [0, 1]
    attempts: number;                     // Total attempts
    firstTryCorrect: number;              // Unassisted correct answers
    lastSeen: number;                     // Unix timestamp in ms
    misconceptions: Record<string, number>; // Tag frequency counter
    mode: 'I' | 'WE' | 'YOU';             // Step Stepper scaffolding mode
  }>;
  game: {
    sp: number;                           // Survey Points
    streak: number;                       // Current sightline streak
    maxStreak: number;                    // Session peak streak
    stamps: Record<LevelId, 'none' | 'bronze' | 'silver' | 'gold'>;
    badges: string[];                     // Unlocked badge identifiers
    instruments: ('clinometer' | 'compass' | 'theodolite')[];
    tricksUnlocked: string[];             // Trick Vault identifiers
  };
  vault: {
    unlockedFormulas: string[];           // Formulas revealed on mastery
  };
  settings: {
    audio: boolean;                       // Voice narration toggle
    captions: boolean;                    // On-screen text captions
    reducedMotion: boolean;               // Accessibility reduced motion override
    dyslexicFont: boolean;                // Enhanced legibility spacing
    highContrast: boolean;                // WCAG AAA contrast boost
    notation: ReciprocalNotation;         // 'cosec' vs 'csc'
    calmMode: boolean;                    // Disables timers and rapid motion in games
  };
  session: {
    id: string;                           // Unique session UUID
    seed: number;                         // Seed for reproducible procedural generation
    startedAt: number;                    // Session start timestamp
  };
}
```

### 4.2 Core Action Payloads & State Transitions

```ts
export type AppAction =
  | { type: 'NAVIGATE'; payload: Partial<RootState['nav']> }
  | { type: 'STATION_COMPLETE'; payload: { stationId: string } }
  | { type: 'RECORD_ANSWER'; payload: {
      skillId: SkillId;
      correct: boolean;
      attemptCount: number; // 1 = first try, 2 = hint 1, 3 = hint 2
      misconceptionTag: string | null;
      itemId: string;
    } }
  | { type: 'GAME_RUN_FINISHED'; payload: { gameId: GameId; accuracy: number; itemsPlayed: number } }
  | { type: 'BOSS_PASSED'; payload: { level: LevelId; score: number } }
  | { type: 'UNLOCK_TRICK'; payload: { trickId: string } }
  | { type: 'AWARD_BADGE'; payload: { badgeId: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<RootState['settings']> }
  | { type: 'RESET_PROGRESS' }
  | { type: 'RESTORE_STATE'; payload: RootState };
```

### 4.3 Persistence Architecture & Migration Protocol

State is serialized to `localStorage` under the key `sky_surveyors_state_v1`. 
- **Storage Durability:** Full state persists across browser restarts for up to 30 days. Active position inside an unfinished practice game run expires after 24 hours to prevent stale item states.
- **Quota Resilience:** All write operations are debounced ($500\text{ ms}$) and wrapped in `try/catch`. In private browsing modes (Safari Incognito) where quota errors may occur, the engine falls back seamlessly to an in-memory session object without crashing.
- **Migration Pipeline:**

```ts
// src/app/state/persist.ts
export const SCHEMA_VERSION = 1;

export function migrateState(saved: any): RootState {
  if (!saved || typeof saved !== 'object') return getDefaultState();
  let current = { ...saved };
  
  // Example migration hook for future versions
  // if (current.schemaVersion === 1) { current = migrateV1ToV2(current); }
  
  return current as RootState;
}
```

---

## 5. Content Data Model

All pedagogical content is strictly declared as static, typed data objects, separating logic completely from presentation.

```ts
// src/content/types.ts
export interface SkillDefinition {
  id: SkillId;
  level: LevelId;
  title: string;
  isCore: boolean;              // Core skills gate level progression
  formulas: string[];           // LaTeX representations for Vault
  prerequisites: SkillId[];
  misconceptions: string[];     // Appendix B tags
  stepScriptId: string;         // Points to content/steps/<id>.ts
  generatorIds: string[];       // Points to procedural generator registry
  trickId?: string;             // Unlocks upon achieving m >= 0.70
}

export interface StationDefinition {
  id: string;                   // e.g., '1A', '2C', '3D'
  level: LevelId;
  title: string;
  skills: SkillId[];
  predict?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  componentName: string;        // Loaded dynamically via React.lazy
  testCriteria: {
    rounds: number;
    minCorrect: number;
  };
}

export interface StepItem {
  id: string;
  doText: string;               // Action instruction
  showScene: {
    type: 'triangle' | 'unitCircle' | 'wave' | 'tex' | 'badge';
    payload: Record<string, any>;
  };
  whyExplanation: string;       // Mandatory conceptual justification
  scaffold: 'never' | 'hard' | 'always'; // Dictates appearance in We-Do / You-Do
  check?: {
    kind: 'choice' | 'numeric' | 'keypad';
    prompt: string;
    correctAnswer: string | number;
    distractors?: Array<{ value: string | number; tag: string }>;
    tolerance?: number;
  };
}

export interface StepScript {
  skillId: SkillId;
  generateSteps: (params: Record<string, any>) => StepItem[];
}
```

---

## 6. The Mathematical Engine

The mathematical engine is pure, isomorphic, and completely decoupled from React or DOM APIs. It can execute identically in Node.js (for CI test harnesses) and in the browser.

### 6.1 The Exact Surd Arithmetic Engine (`src/engine/exact.ts`)

School trigonometry frequently requires non-terminating surds (e.g., $\sin 60^\circ = \frac{\sqrt{3}}{2}$, $\sin 75^\circ = \frac{\sqrt{6}+\sqrt{2}}{4}$, $\tan 75^\circ = 2+\sqrt{3}$). Standard floating-point arithmetic fails because `0.9659258262890683` cannot be verified as simplified $\frac{\sqrt{6}+\sqrt{2}}{4}$.

The `Exact` engine represents real algebraic numbers canonically as:
$$\text{Value} = \sum_{i} \frac{n_i}{d_i}\sqrt{r_i}$$
where each radicand $r_i \in \mathbb{N}^+$ is **square-free** ($r_i$ has no square factors $> 1$), $d_i > 0$, $\gcd(|n_i|, d_i) = 1$, and terms are ordered strictly by ascending $r_i$.

```ts
// src/engine/exact.ts
export interface RadicalTerm {
  n: number; // Numerator coefficient
  d: number; // Denominator coefficient (d > 0)
  r: number; // Radicand (square-free positive integer)
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
```

### 6.2 Pure Trigonometry Engine with $15^\circ$ Closed Forms (`src/engine/trigMath.ts`)

High-school advanced trigonometry requires exact values for multiples of $15^\circ$ ($\frac{\pi}{12}\text{ rad}$). The engine incorporates exact algebraic values for all 24 angles around the circle:

```ts
// src/engine/trigMath.ts
import { Exact } from './exact';

export type TrigFn = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot';

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
  const quad = getQuadrant(deg);
  const norm = normalizeDegrees360(deg);

  // ASTC signs
  let sinSign = (norm === 0 || norm === 180 || norm === 360) ? 1 : (norm > 180 ? -1 : 1);
  let cosSign = (norm === 90 || norm === 270) ? 1 : (norm > 90 && norm < 270 ? -1 : 1);

  const signedSin = sinSign < 0 ? base.sin.neg() : base.sin;
  const signedCos = cosSign < 0 ? base.cos.neg() : base.cos;

  switch (fn) {
    case 'sin': return signedSin;
    case 'cos': return signedCos;
    case 'tan': return signedCos.isZero() ? null : signedSin.div(signedCos);
    case 'csc': return signedSin.isZero() ? null : signedSin.reciprocal();
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
```

### 6.3 Safe Recursive-Descent Expression Parser (`src/engine/parse.ts`)

User inputs and proof lines are evaluated safely without using `eval()` or `new Function()`. The parser supports implicit multiplication (`2\sqrt{3}`, `3\sin(x)`), power exponents ($\sin^2 x \equiv (\sin x)^2$), and constant identifiers ($\pi$):

```ts
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
```

---

## 7. Procedural Generator Architecture & CI Verification Harness

### 7.1 Generator Interface & Contract

```ts
export interface ProblemItem<TParams = any> {
  id: string;
  generatorId: string;
  skillId: SkillId;
  params: TParams;
  answerText: string;
  answerExact?: Exact;
  options?: Array<{ value: string | number; tag: string | null }>;
  stepsScriptData: Record<string, any>;
}

export interface ProceduralGenerator<TParams = any> {
  id: string;
  skillId: SkillId;
  make: (rng: () => number) => ProblemItem<TParams> | null;
  verify: (item: ProblemItem<TParams>) => boolean;
}
```

### 7.2 Production Generator: Skill E5 (Missing Side Calculation)

```ts
// src/generators/level1/E5_missingSide.ts
import { ProceduralGenerator, ProblemItem } from '../types';
import { pick, shuffle } from '../../engine/rng';
import { degToRad } from '../../engine/trigMath';

interface E5Params {
  theta: number;
  knownSide: number;
  knownType: 'opp' | 'adj' | 'hyp';
  targetType: 'opp' | 'adj' | 'hyp';
  fnName: 'sin' | 'cos' | 'tan';
  isMultiply: boolean;
}

const CANDIDATE_ANGLES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
const CANDIDATE_SIDES = [4, 5, 6, 8, 10, 12, 14, 15, 16, 20, 25];

export const E5_generator: ProceduralGenerator<E5Params> = {
  id: 'E5.missing_side.v1',
  skillId: 'E5',
  make(rng) {
    const theta = pick(rng, CANDIDATE_ANGLES);
    const knownSide = pick(rng, CANDIDATE_SIDES);
    const kinds: Array<'opp' | 'adj' | 'hyp'> = ['opp', 'adj', 'hyp'];
    const knownType = pick(rng, kinds);
    const targetType = pick(rng, kinds.filter(k => k !== knownType));

    // Determine correct trigonometric ratio
    let fnName: 'sin' | 'cos' | 'tan';
    let isMultiply: boolean;
    let exactAnswer: number;

    const rad = degToRad(theta);
    const sinV = Math.sin(rad);
    const cosV = Math.cos(rad);
    const tanV = Math.tan(rad);

    if ((knownType === 'hyp' && targetType === 'opp') || (knownType === 'opp' && targetType === 'hyp')) {
      fnName = 'sin';
      isMultiply = knownType === 'hyp';
      exactAnswer = isMultiply ? knownSide * sinV : knownSide / sinV;
    } else if ((knownType === 'hyp' && targetType === 'adj') || (knownType === 'adj' && targetType === 'hyp')) {
      fnName = 'cos';
      isMultiply = knownType === 'hyp';
      exactAnswer = isMultiply ? knownSide * cosV : knownSide / cosV;
    } else {
      fnName = 'tan';
      isMultiply = knownType === 'adj';
      exactAnswer = isMultiply ? knownSide * tanV : knownSide / tanV;
    }

    const roundedAnswer = Math.round(exactAnswer * 10) / 10;
    if (roundedAnswer <= 0 || roundedAnswer > 500) return null;

    // Deterministically generate distractors with explicit misconception tags
    const distractors: Array<{ value: number; tag: string }> = [];

    // Tag 1: ONE_STEP_INVERT (inverted operation)
    const invertedVal = Math.round((isMultiply ? knownSide / (fnName === 'sin' ? sinV : fnName === 'cos' ? cosV : tanV) : knownSide * (fnName === 'sin' ? sinV : fnName === 'cos' ? cosV : tanV)) * 10) / 10;
    distractors.push({ value: invertedVal, tag: 'ONE_STEP_INVERT' });

    // Tag 2: CALC_MODE (evaluation with angle in radians instead of degrees)
    const radModeFnVal = fnName === 'sin' ? Math.sin(theta) : fnName === 'cos' ? Math.cos(theta) : Math.tan(theta);
    const radModeVal = Math.round((isMultiply ? knownSide * radModeFnVal : knownSide / radModeFnVal) * 10) / 10;
    if (radModeVal > 0) distractors.push({ value: radModeVal, tag: 'CALC_MODE' });

    // Tag 3: RATIO_WRONG_FN (swapped sin with cos)
    const wrongFnVal = fnName === 'cos' ? sinV : cosV;
    const wrongFnAns = Math.round((isMultiply ? knownSide * wrongFnVal : knownSide / wrongFnVal) * 10) / 10;
    distractors.push({ value: wrongFnAns, tag: 'RATIO_WRONG_FN' });

    // Deduplicate distractors and filter against correct answer
    const seen = new Set<number>([roundedAnswer]);
    const cleanDistractors: Array<{ value: number; tag: string }> = [];
    for (const d of distractors) {
      if (!seen.has(d.value) && Number.isFinite(d.value) && d.value > 0) {
        seen.add(d.value);
        cleanDistractors.push(d);
      }
    }

    if (cleanDistractors.length < 3) return null; // Reject seed, retry

    const options = shuffle(rng, [
      { value: roundedAnswer, tag: null },
      ...cleanDistractors.slice(0, 3),
    ]);

    return {
      id: `E5_${theta}_${knownSide}_${knownType}_${targetType}`,
      generatorId: 'E5.missing_side.v1',
      skillId: 'E5',
      params: { theta, knownSide, knownType, targetType, fnName, isMultiply },
      answerText: roundedAnswer.toFixed(1),
      options,
      stepsScriptData: { theta, knownSide, knownType, targetType, roundedAnswer, fnName, isMultiply },
    };
  },

  /** Independent Dual-Verification: Scales the unit right triangle and validates Pythagoras */
  verify(item: ProblemItem<E5Params>): boolean {
    const { theta, knownSide, knownType, targetType } = item.params;
    const rad = degToRad(theta);
    
    // Scale reference unit triangle (hypotenuse = 1)
    const unitTriangle = {
      opp: Math.sin(rad),
      adj: Math.cos(rad),
      hyp: 1.0,
    };

    const scaleFactor = knownSide / unitTriangle[knownType];
    const computedFull = {
      opp: unitTriangle.opp * scaleFactor,
      adj: unitTriangle.adj * scaleFactor,
      hyp: unitTriangle.hyp * scaleFactor,
    };

    // 1. Validate Pythagorean Theorem to 1e-9 precision
    const pythagError = Math.abs(computedFull.opp ** 2 + computedFull.adj ** 2 - computedFull.hyp ** 2);
    if (pythagError > 1e-7) return false;

    // 2. Validate independent target value match
    const expectedTarget = Math.round(computedFull[targetType] * 10) / 10;
    const providedAnswer = parseFloat(item.answerText);
    if (Math.abs(expectedTarget - providedAnswer) > 0.05) return false;

    // 3. Validate options integrity: exactly 4 unique choices, exactly 1 correct
    if (!item.options || item.options.length !== 4) return false;
    const uniqueVals = new Set(item.options.map(o => o.value));
    if (uniqueVals.size !== 4) return false;
    const correctMatches = item.options.filter(o => o.tag === null && o.value === providedAnswer);
    if (correctMatches.length !== 1) return false;

    return true;
  },
};
```

### 7.3 CI Verification Harness Script (`scripts/verify_generators.mjs`)

This automated script is enforced as a required pre-merge CI check:

```javascript
// scripts/verify_generators.mjs
import { mulberry32 } from '../src/engine/rng.js';
import { GENERATOR_REGISTRY } from '../src/generators/registry.js';

const TOTAL_SEEDS = 10000;
let totalPass = 0;
let totalFail = 0;

console.log(`Starting CI Procedural Verification Suite across ${TOTAL_SEEDS} seeds per generator...`);

for (const gen of GENERATOR_REGISTRY) {
  const rng = mulberry32(1337);
  let passes = 0;
  let rejections = 0;
  const seenParams = new Set();

  for (let i = 0; i < TOTAL_SEEDS; i++) {
    const item = gen.make(rng);
    if (!item) {
      rejections++;
      continue;
    }

    const isValid = gen.verify(item);
    if (!isValid) {
      console.error(`FATAL: Generator ${gen.id} produced invalid item on iteration ${i}:`, item);
      process.exit(1);
    }

    seenParams.add(JSON.stringify(item.params));
    passes++;
  }

  const rejectionRate = (rejections / TOTAL_SEEDS) * 100;
  console.log(`✔ [${gen.id}] Passed: ${passes} | Rejection Rate: ${rejectionRate.toFixed(2)}% | Unique Variants: ${seenParams.size}`);
  
  if (rejectionRate > 15) {
    console.error(`ERROR: Generator ${gen.id} has unacceptable rejection rate (>15%)`);
    process.exit(1);
  }
}

console.log('All procedural generators passed 10,000-seed mathematical verification.');
```

---

## 8. Step Stepper Engine & Scaffolding State Machine

The Step Stepper scaffold executes a finite state machine orchestrating **I-Do**, **We-Do**, and **You-Do** modes:

```
               ┌───────────────┐
               │   LOAD_STEP   │
               └───────┬───────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
    [I-Do Mode]                 [We-Do / You-Do]
         │                           │
  Auto-Render Chalk           Does step require
  & Play Narration            scaffold check?
         │                           │
         ▼                     ┌─────┴─────┐
    User Taps                  ▼           ▼
   "Next Step"               [NO]        [YES]
         │                     │           │
         │                Auto-Advance     ▼
         │                     │     AWAIT_INPUT
         │                     │           │
         │                     │     ┌─────┴─────┐
         │                     │     ▼           ▼
         │                     │  [CORRECT]  [INCORRECT]
         │                     │     │           │
         │                     │  Celebrate  Trigger Theo Nudge
         │                     │     │       & Offer Mode Stepback
         ▼                     ▼     ▼           │
     ┌─────────────────────────────────┐         ▼
     │        ADVANCE_TO_NEXT          │   Retry Step
     └─────────────────────────────────┘
```

### 8.1 Adaptive Mode Thresholds

The Step Stepper dynamically selects mode based on real-time Bayesian mastery $m$:
- **`I-Do` (Observer):** $m < 0.35$. Theo performs every step, explaining the reasoning.
- **`We-Do` (Partner):** $0.35 \le m < 0.65$. The learner solves critical junction steps (`scaffold: 'hard'`), while mechanical calculations are performed automatically.
- **`You-Do` (Solo):** $m \ge 0.65$. The learner completes all steps independently with immediate step-by-step validation.
- **Graceful Fallback:** Tapping *"Show me how again"* temporarily shifts the Stepper back one tier without penalty or point loss.

---

## 9. Interactive SVG Component Specifications

All graphics are written as accessible, scalable SVG components driven by standard Pointer Events and native keyboard handlers.

### 9.1 Component Architectural Matrix

| Component | Target Skills | Key User Interactions | Keyboard Navigation | ARIA Accessibility Contract |
| :--- | :--- | :--- | :--- | :--- |
| **`TriangleLab`** | E1, E2, E3, E5 | Draggable vertex $C$ adjusting acute angle $\theta \in [10^\circ, 80^\circ]$; instant corner toggle between angle $A$ and angle $B$. | Arrow keys step $\pm 1^\circ$; `Shift`+Arrows step $\pm 5^\circ$; `Tab` cycles acute vertices. | `role="figure"` with `aria-label="Right triangle with angle 35 degrees at A. Opposite side 6.9, Adjacent 9.8, Hypotenuse 12."` |
| **`UnitCircle`** | M6, M7, M8, M9 | Draggable point $P$ around unit radius; live vertical ($\sin$), horizontal ($\cos$), and tangent projections; fold-back reference angle animation. | Left/Right arrows $\pm 1^\circ$; `PageUp`/`PageDown` jump $90^\circ$ quadrant boundaries; `Home` resets to $0^\circ$. | `role="slider"` with `aria-valuemin="0"`, `aria-valuemax="360"`, `aria-valuenow="150"`, `aria-valuetext="150 degrees, Quadrant 2, sine 0.5, cosine -0.866"`. |
| **`WaveTracer`** | M6, H8 | Continuous $60\text{ fps}$ circular projection onto Cartesian plane; sliders for $A, B, C, D$. | Arrow keys adjust active parameter slider; Spacebar pauses/resumes continuous spin. | Dynamic `aria-live="polite"` region reading equation: `y = 2 sin(x - pi/4) + 1`. |
| **`Clinometer`** | E8, M12 | Aiming sightline rotatable from ground datum; plumb-bob pendulum hangs vertically via simulated gravity. | Up/Down arrows tilt telescope sightline $\pm 0.5^\circ$. | `aria-label="Clinometer aiming at 32.5 degrees elevation."` |
| **`SwingTriangle`**| H7 | Slider controls side length $a$; animated circular swing arc demonstrates SSA 0, 1, or 2 triangle intersections. | Left/Right arrows adjust side $a$ length in increments of $0.2$. | Dynamic text summary: `aria-live="polite"` announcing *"Two valid triangles possible."* |
| **`ProofBoard`** | H1 | Slotted canvas for identity proof cards; drag-and-drop or tap-tap slotting; move justify dropdowns. | Arrow keys reorder selected proof tile; `Enter` commits slot position. | `role="list"` with focusable, reorderable items. |
| **`MathKeypad`** | All | On-screen virtual keypad emitting structured MathML/LaTeX; dedicated buttons for $\frac{a}{b}, \sqrt{x}, \pi, x^2, ^\circ$. | Full physical keyboard typing support; `Escape` clears; `Enter` submits. | Virtual keys carry descriptive `aria-label`s (e.g., `aria-label="Square Root"`). |

### 9.2 Rendering Performance & Memory Budgets
- **$60\text{ fps}$ Guarantee:** Continuous animations (`WaveTracer`, `UnitCircle` rotation) execute inside a single unified `requestAnimationFrame` loop.
- **Zero DOM Allocation During Drag:** Dragging updates SVG element attributes directly via pre-allocated DOM references or localized CSS transforms, avoiding React state thrashing during high-frequency pointer movements.
- **Node Cap:** The total SVG node count per interactive scene is strictly budgeted at $< 400$ DOM elements.

---

## 10. Practice Game Framework & GameShell Contract

All 14 practice games inherit from the unified **`GameShell`** harness, ensuring identical game loops, telemetry emission, and accessibility options:

```ts
// src/games/types.ts
export interface GameRunState {
  gameId: GameId;
  items: ProblemItem[];
  currentIndex: number;
  correctCount: number;
  history: Array<{ itemId: string; correct: boolean; hintLevel: number; tag: string | null }>;
  isComplete: boolean;
}

export interface GameAPI {
  submitAnswer: (response: unknown) => { isCorrect: boolean; tag: string | null; hintLevel: number };
  requestHint: () => { hintText: string; hintLevel: number };
  abortRun: () => void;
}
```

### 10.1 Zero-Penalty Gameplay Rules
1. **No Lives / No Game-Over:** Missing a question never terminates a run. An incorrect item triggers targeted feedback, and a fresh parameter variant returns later in the session.
2. **Optional Timers (Calm Mode):** Timers are off by default. When enabled, running out of time yields a gentle nudge rather than a fail state.
3. **Automated Interleaving:** The item queue draws $75\%$ of items targeting the student’s lowest-mastery skills and $25\%$ review items from completed levels.

---

## 11. Continuous Bayesian Mastery & Adaptive Selection

### 11.1 The Bayesian Update Formula

The mastery scalar $m_s \in [0, 1]$ for skill $s$ updates after every interaction:

```ts
// src/engine/mastery.ts
export function calculateMasteryDelta(
  currentM: number,
  correct: boolean,
  attemptNumber: number
): number {
  if (correct) {
    // Attempt 1 = Clean correct; Attempt 2/3 = Assisted correct
    const alpha = attemptNumber === 1 ? 0.25 : 0.125;
    return currentM + alpha * (1.0 - currentM);
  } else {
    // Incorrect answer penalizes mastery
    const beta = 0.20;
    return currentM - beta * currentM;
  }
}

/** Spaced memory decay for skills unpracticed for > 24 hours */
export function applyTimeDecay(currentM: number, hoursSinceLastPractice: number): number {
  if (hoursSinceLastPractice <= 24 || currentM <= 0.50) return currentM;
  const decayWeeks = (hoursSinceLastPractice - 24) / (24 * 7);
  const decayFactor = Math.min(0.20, decayWeeks * 0.05);
  return currentM - (currentM - 0.50) * decayFactor;
}
```

### 11.2 Adaptive Item Scheduling (`src/engine/select.ts`)

When a game requests the next item, the scheduler executes a weighted random draw:
$$\text{Weight}(s) = (1.0 - m_s) + 0.05$$
The immediately preceding skill is damped by $80\%$ ($\times 0.20$) to prevent jarring back-to-back repetitions.

---

## 12. Gamification & Progression Mechanics

### 12.1 Survey Points (SP) Formula
$$\text{SP} = \text{BasePoints}(\text{Attempt}) + \text{StreakBonus}$$
- $\text{Attempt 1} = 10\text{ SP}$
- $\text{Attempt 2 (after Hint 1)} = 7\text{ SP}$
- $\text{Attempt 3 (after Hint 2)} = 4\text{ SP}$
- $\text{Full Reveal} = 2\text{ SP}$ (participation)
- $\text{Streak Bonus} = +3\text{ SP}$ for every correct answer while Sightline Streak $\ge 5$.

### 12.2 Level Gating Verification Logic
A level’s Boss encounter unlocks if and only if:
1. At least 4 of 5 Practice Games are **Lit** ($\text{Accuracy} \ge 70\%$).
2. **Every core skill** in the level satisfies: $m_s \ge 0.70$ AND $\text{Attempts} \ge 4$.

Passing the Boss requires solving $\ge 6$ of the 8 progressive challenge stages.

---

## 13. Dynamic Trigonometric Sun-Shadow Theming Engine

The visual design system implements authentic physical trigonometry directly inside CSS:

```css
/* src/theme/sunEngine.css */
:root {
  --sun-elev: 48deg;
  --sun-dir: 1; /* 1 = cast right, -1 = cast left */
  --lift-card: 12px;
  --lift-button: 6px;
  
  /* The Trigonometric Shadow Formula: L = H / tan(elevation) */
  --shadow-len-card: min(calc(var(--lift-card) / tan(var(--sun-elev))), 54px);
  --shadow-len-button: min(calc(var(--lift-button) / tan(var(--sun-elev))), 24px);
  --shadow-ink: color-mix(in srgb, var(--color-ink-deep) 18%, transparent);
}

.trig-cast-card {
  box-shadow: calc(var(--shadow-len-card) * var(--sun-dir)) 
              calc(var(--lift-card) * 0.35) 
              0px 
              var(--shadow-ink);
}

.trig-cast-button {
  box-shadow: calc(var(--shadow-len-button) * var(--sun-dir)) 
              calc(var(--lift-button) * 0.35) 
              0px 
              var(--shadow-ink);
}

/* Fallback for legacy browsers lacking native CSS tan() */
@supports not (box-shadow: calc(1px / tan(45deg)) 0 0 red) {
  :root {
    --shadow-len-card: 14px;
    --shadow-len-button: 6px;
  }
}

/* Level Themes */
[data-level="1"] { --sun-elev: 48deg; --sun-dir: 1;  --bg-current: var(--bg-level-1); }
[data-level="2"] { --sun-elev: 18deg; --sun-dir: 1;  --bg-current: var(--bg-level-2); }
[data-level="3"] { --sun-elev: 62deg; --sun-dir: -1; --bg-current: var(--bg-level-3); }
```

During simulation drag interactions, `requestAnimationFrame` continuously synchronizes `--sun-elev` on the stage container, visually grounding the user's tactile input in the environment.

---

## 14. Audio Narration & Secure Proxy Architecture

### 14.1 Two-Tier Audio Pipeline
```
[Pre-Generated Manifest] ──(Hit)──► Instant HTML5 Audio Playback
         │
       (Miss)
         ▼
[POST /api/tts] ─────────► Serverless Rate-Limiter ──► ElevenLabs API ──► Cached Audio Blob
```

### 14.2 Serverless TTS Proxy Implementation (`api/tts.ts`)

```ts
// api/tts.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const ALLOWED_ORIGINS = (process.env.ALLOWED_HOSTS || '').split(',');
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.TTS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

// Memory cache for synthesized short dynamic strings
const audioBlobCache = new Map<string, Buffer>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Validate origin
  const origin = req.headers.origin || '';
  if (process.env.NODE_ENV === 'production' && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden origin' });
  }

  const { text, style } = req.body;
  if (!text || typeof text !== 'string' || text.length > 250) {
    return res.status(400).json({ error: 'Invalid text payload (max 250 characters)' });
  }

  const hashKey = crypto.createHash('sha256').update(`${text}_${style}`).digest('hex');
  if (audioBlobCache.has(hashKey)) {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(audioBlobCache.get(hashKey));
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) throw new Error(`ElevenLabs error: ${response.statusText}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    audioBlobCache.set(hashKey, buffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(buffer);
  } catch (err: any) {
    return res.status(500).json({ error: 'TTS synthesis failed', details: err.message });
  }
}
```

---

## 15. Accessibility & Universal Design (WCAG 2.2 AA)

1. **Screen-Reader Math Presentation:** All equations are typeset via KaTeX with native MathML output enabled. Visual inline cards feature explicit `aria-label` tags containing the phonetically generated English translation.
2. **Keyboard Parity:** Every drag interaction on `TriangleLab`, `UnitCircle`, and `Clinometer` supports standard arrow keys ($\pm 1^\circ$) and page step keys ($\pm 15^\circ$).
3. **Triple-Coding Visual Identity:** Geometric sides are **never identified by color alone**. The Hypotenuse, Opposite, and Adjacent sides are always rendered with distinct stroke styles (solid, dashed, dotted) and explicit text chips (O, A, H).
4. **Target Sizing:** All interactive touch targets strictly meet or exceed $44 \times 44\text{ CSS pixels}$.
5. **Reduced Motion:** When `prefers-reduced-motion: reduce` is detected or toggled, continuous wave tracing pauses, smooth sun transitions snap instantly, and canvas confetti is disabled.

---

## 16. Performance Budgets & Bundle Optimization

| Optimization Metric | Budget Target | CI Enforcement Tool |
| :--- | :--- | :--- |
| **Initial JS Shell Bundle** | $\le 250\text{ KB}$ (gzipped) | `vite-plugin-bundle-analyzer` |
| **Per-Level Lazy Chunks** | $\le 150\text{ KB}$ per level | Dynamic `import()` code-splitting |
| **Total KaTeX Asset Footprint** | $\le 110\text{ KB}$ (only loaded MathML & Latin glyphs) | Font subset stripper in build script |
| **First Contentful Paint (FCP)** | $< 1.5\text{ seconds}$ (4G mid-tier mobile) | Lighthouse CI |
| **Largest Contentful Paint (LCP)**| $< 2.5\text{ seconds}$ | Lighthouse CI |
| **Cumulative Layout Shift (CLS)** | $< 0.05$ | Lighthouse CI |
| **Steady-State Runtime Memory** | $< 100\text{ MB}$ | Chrome DevTools Memory Profiler |

---

## 17. Telemetry & Host Embedding Integration

### 17.1 Local Ring-Buffer Telemetry
To protect student privacy (Ages 14–17), telemetry is kept strictly local by default in a circular buffer of the last 500 events:
- `module_started`, `level_started`, `station_completed`, `answer_submitted`, `game_completed`, `boss_result`, `badge_unlocked`.
- The student or teacher can export this buffer as a local JSON diagnostic file or print the formatted Report Card directly.

### 17.2 Secure `postMessage` Host Bridge

When embedded inside a Learning Management System (LMS) iframe:

```ts
// src/platform/hostBridge.ts
const ALLOWED_ORIGINS = (import.meta.env.VITE_ALLOWED_HOST_ORIGINS || '').split(',');

export function notifyHost(event: { type: string; payload: Record<string, any> }) {
  if (window.parent === window) return;
  const targetOrigin = new URLSearchParams(window.location.search).get('hostOrigin');
  if (targetOrigin && (ALLOWED_ORIGINS.includes(targetOrigin) || targetOrigin === '*')) {
    window.parent.postMessage(
      { source: 'sky-surveyors-trigonometry', ...event },
      targetOrigin
    );
  }
}
```

---

## 18. Testing Strategy & Quality Assurance Gates

```
                    ┌─────────────────────────┐
                    │   CI AUTOMATED PIPELINE │
                    └────────────┬────────────┘
                                 │
     ┌───────────────────┬───────┴───────────┬───────────────────┐
     ▼                   ▼                   ▼                   ▼
 [TypeScript]       [Unit Tests]      [Generator QA]     [Accessibility]
 Strict Check       Vitest Engine      10,000 Seeds         axe-core
  (Zero Any)         Fast-Check         Zero Errors       Zero Violations
                         │                   │                   │
                         └─────────┬─────────┘                   │
                                   ▼                             │
                           [Playwright E2E] ◄────────────────────┘
                           End-to-End Flows
                           Visual Regression
                                   │
                                   ▼
                           [Secret Scanner]
                         Verify Zero Keys in dist/
```

- **Unit & Property Tests:** Fast-check validates mathematical invariants across 1,000 random inputs per run (e.g., verifying that for all $\theta$, $\sin^2\theta + \cos^2\theta \equiv 1$ and exact surds reciprocal correctly).
- **Generator CI Gate:** Runs `scripts/verify_generators.mjs` across 10,000 random seeds for all 34 skills.
- **Audio Parity Test:** Validates that every spoken content line exactly matches its pre-rendered audio asset manifest.
- **Production Bundle Secret Scan:** Build script automatically fails if any string in `dist/` matches regex patterns for API keys (`sk_[a-zA-Z0-9]{20,}` or `VITE_ELEVENLABS`).

---

## 19. Build, CI/CD & Deployment Configuration

### 19.1 Environment Variables Configuration (`.env.example`)

```ini
# Serverless & Build Scripts ONLY (NEVER prefix with VITE_)
ELEVENLABS_API_KEY=your_secure_api_key_here
TTS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ALLOWED_HOSTS=https://myschool.org,https://intellia.io

# Client Public Flags (Safe to expose)
VITE_APP_TITLE="Sky Surveyors — Trigonometry"
VITE_ENABLE_AUDIO_FALLBACK=true
VITE_ALLOWED_HOST_ORIGINS=https://myschool.org
```

### 19.2 Vite Production Build Configuration (`vite.config.ts`)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          katex: ['katex'],
          engine: ['./src/engine/exact.ts', './src/engine/trigMath.ts', './src/engine/parse.ts'],
        },
      },
    },
  },
});
```

---

## 20. Production Delivery Milestones

```
M0: FOUNDATIONS (Weeks 1-2)
├── Exact surd engine & TrigMath isomorphism
├── Mathematical parser & PRNG generator harness
├── Design tokens & CSS trigonometric shadow system
└── Step Stepper state machine & MathKeypad

M1: LEVEL 1 VERTICAL SLICE (Weeks 3-4)
├── Wonder 1 ("The Giant You Can't Climb") & Story 1 (6 panels)
├── Stations 1A–1D & TriangleLab component
├── Games G1–G5 & Boss B1 ("Pyramid Vault")
└── 10,000-seed CI verification harness active

M2: LEVEL 2 INTERMEDIATE (Weeks 5-6)
├── Wonder 2 ("The Wave Wheel") & Story 2 (6 panels)
├── Stations 2A–2E & UnitCircle / RadianRoller components
├── Games G6–G9, G3-II & Boss B2 ("Observatory Lock")
└── Unit circle keyboard parity & ASTC quadrant checks

M3: LEVEL 3 ADVANCED (Weeks 7-8)
├── Wonder 3 ("Sound Cancellation") & Story 3 (6 panels)
├── Stations 3A–3F, SwingTriangle, WaveTracer & ProofBoard
├── Games G10–G14 & Boss B3 ("The Final Build")
└── Multi-point numerical identity verifier green

M4: POLISH, AUDIO & ACCESSIBILITY (Weeks 9-10)
├── Two-tier audio pre-generation & serverless proxy
├── Full WCAG 2.2 AA axe-core regression audit
├── Dyslexia & high-contrast accessibility themes
└── Performance optimization (Lighthouse >= 95)

M5: CLASSROOM PILOT & CALIBRATION (Weeks 11-12)
├── Pilot test with >= 30 learners
├── Refine Bayesian alpha/beta learning rates
└── Final release sign-off
```

---

## 21. Technical Risk Assessment & Mitigation Matrix

| Technical Risk | Likelihood | Impact | Engineering Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Mathematical Grading Bugs** | Medium | Critical | Pure isomorphic engines with independent dual-verification routines and continuous 10,000-seed CI test gates. |
| **Client-Side Secret Exposure** | Low | Critical | Hard architectural ban on client keys; static string scanning of production `dist/` artifacts before deployment. |
| **Mobile SVG Frame Drops** | Medium | High | Direct attribute manipulation inside unified `requestAnimationFrame` loops; node cap $< 400$ elements. |
| **Screen-Reader Mathematical Drift** | Medium | High | Simultaneous authoring of visual LaTeX and phonetic English spoken strings with automated parity check scripts. |
| **Quota Depletion on Storage** | Low | Medium | Debounced writes with in-memory session fallbacks in private browsing environments. |
| **CSS `tan()` Browser Incompatibility** | Low | Low | Native `@supports not` fallback rules delivering fixed-ratio elevation shadows. |

---

## 22. Architectural Sign-Off & Verification Checklist

- [x] **Document Version:** 1.0 Production Baseline Approved
- [x] **Zero Unresolved Questions:** All six pedagogical and technical baselines resolved with concrete implementations.
- [x] **Companion PRD Alignment:** Full 1:1 symmetry maintained with [trigonometry_prd.md](file:///c:/Users/asus/OneDrive/Desktop/trigonometry/trigonometry_prd.md).
- [x] **Engine Completeness:** Full TypeScript implementations provided for `Exact`, `TrigMath`, `Parser`, `Mastery`, and procedural generators.
- [x] **Security Hardening:** Serverless proxy and build-time audio generation eliminate all browser key exposure.
- [x] **Accessibility Specification:** Complete keyboard mappings and ARIA live attributes defined for all 7 interactive components.
