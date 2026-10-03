# Product Requirements Document (PRD)
## Sky Surveyors — Trigonometry, Beginner to Advanced
### A Standalone, Three-Level Interactive Learning Module

---

## 0. Document Control

| Field | Value |
| --- | --- |
| **Product** | **Sky Surveyors — Trigonometry** |
| **Type** | Standalone React (Vite + TypeScript) single-page web application |
| **Version** | 1.0 — Production Specification (Baseline Approved) |
| **Target Audience** | Grades 9–12 (Ages 14–17); accessible to advanced Grade 8 |
| **Reference Module** | `Grade-7-powers_and_roots` (pedagogical flow, gamification skeleton, narration pipeline) |
| **Companion Document** | [trigonometry_trd.md](file:///c:/Users/asus/OneDrive/Desktop/trigonometry/trigonometry_trd.md) |
| **Security Status** | Hardened client architecture (zero client-side API keys; server-side proxy for TTS) |

### Confirmed Production Baselines (Resolving Prior Assumptions)

1. **Curriculum & Notation Scope:** Primary curriculum alignment targets US High School Common Core (Geometry & Algebra II/Precalculus) and CBSE/NCERT Class 10–11, with secondary coverage for UK GCSE/A-Level and Cambridge IGCSE. A persistent UI toggle allows instantaneous switching between reciprocal notation aliases: **`cosec`** (UK/India/Commonwealth default) and **`csc`** (US default).
2. **Calculator Integration Policy:** Dual-mode design:
   - *Level 1 (Beginner):* Focuses primarily on exact values ($30^\circ, 45^\circ, 60^\circ$) and integer Pythagorean triples. An in-app virtual calculator is provided for real-world decimal problems with a permanent, locked **`DEG`** mode badge and explicit sanity-checking prompts.
   - *Levels 2 & 3 (Intermediate & Advanced):* Unlocks full radian/degree switching (**`DEG` ↔ `RAD`**), inverse functions, and exact surd inputs via the bespoke **MathKeypad**.
3. **Narration Pipeline:** Two-tier hybrid architecture:
   - *Core Narrative Tier:* 100% pre-rendered, crystal-clear audio files for high-impact screens (Wonder hooks, 18 Story panels, Station formalization moments, and Mascot celebrations).
   - *Dynamic Feedback Tier:* On-demand procedural hints synthesised via a secure, rate-limited serverless proxy (`/api/tts`). Audio is fully optional with real-time on-screen captions enabled by default when sound is muted.
4. **Pedagogical Interpretation of "Vedic":** Interpreted strictly as **proven mental math speed techniques** (e.g., fast squaring for Pythagoras, rapid fraction rationalization) plus an authentic **Indian Mathematical Heritage strand** celebrating historical breakthroughs (Āryabhaṭa’s *jya* tables, Bhāskara I’s sine approximation, and Mādhava’s infinite series). All methods explicitly prove **"Why it works"** prior to demonstrating speed.

---

## 1. Executive Summary

**Sky Surveyors** transforms trigonometry from an intimidating set of abstract formulas into an empowering journey of discovery: *the superpower of measuring the unmeasurable*. Learners discover that with an angle and a baseline, they can measure the height of a Himalayan peak, navigate across an ocean, map celestial bodies, or sculpt sound waves.

The module is structured across **three progressive levels**:

| Level | Name | Difficulty | Core Promise | Core Mathematical Domain |
| --- | --- | --- | --- | --- |
| **1** | **Shadow Scouts** | Easy / Beginner | *"Measure anything tall using only an angle and a tape."* | Right-triangle ratios ($\sin, \cos, \tan$), SOH-CAH-TOA, exact values ($30^\circ, 45^\circ, 60^\circ$), angles of elevation & depression, Pythagorean triples. |
| **2** | **Circle Cartographers** | Medium / Intermediate | *"Make the circle give you the answer for any angle."* | The unit circle, coordinates as ratios, ASTC quadrant rules, reference angles, negative/coterminal angles, radians ($s=r\theta, A=\frac{1}{2}r^2\theta$), reciprocal ratios ($\csc, \sec, \cot$), Pythagorean identities. |
| **3** | **Sky Engineers** | Hard / Advanced | *"Prove it, solve it, and model it—from bridges to sound waves."* | Formal identity proofs, compound & double angle formulas, laws of sines and cosines (including SSA ambiguous case), trigonometric graphs, general solution of equations, inverse functions, periodic modelling. |

Every level executes the proven 4-stage pedagogical flow:
```
WONDER  ───────►  STORY  ───────►  SIMULATE  ───────►  PRACTICE  (+ Boss)  ───────►  NEXT LEVEL
 (Hook)          (Context)       (Teach + Test)           (Fluency)
```
Upon conquering Level 3, learners enter the **Finale & Reflection** sanctuary, receiving their personalised Formula Vault and Master Surveyor Certificate.

### 1.1 Structural Continuity with Reference Module

| Retained Component | Architectural Justification |
| --- | --- |
| **Wonder → Story → Simulate → Practice Arc** | Proven cognitive sequence: Curiosity Hook → Meaning/Context → Hands-on Discovery → Fluency & Mastery. |
| **Concrete → Pictorial → Abstract (CPA)** | Essential for spatial concepts: physical shadows/sticks → unit circle & dynamic triangles → algebraic identities & equations. |
| **Theo the Mascot & Mood States** | Provides emotional safety, continuous encouraging feedback, and contextual hints without patronising the learner. |
| **3-Step Hint Ladder** | Encouragement-first scaffolding: Nudge → Guided Step → Full Worked Solution. **Zero negative scoring or penalty traps.** |
| **Client-Side Persistence** | Zero-friction student onboarding: no logins or accounts required; state preserved across browser restarts. |

### 1.2 Deliberate Architectural & Pedagogical Enhancements

| Reference Module Approach | Sky Surveyors Implementation | Pedagogical / Technical Rationale |
| --- | --- | --- |
| Single linear topic | **3 fully articulated levels with independent cycles** | Spans beginner middle-school concepts to advanced high-school/college-prep mathematics. |
| Single quiz over a static map | **14 bespoke practice games + 3 climactic Boss encounters** | Different cognitive skills (rapid identification, spatial estimation, algebraic manipulation, geometric deduction) demand dedicated gameplay mechanics. |
| Static 100-item question bank | **Deterministic procedural generation with independent verification** | Infinite replayability; prevents rote memorisation; ensures verified correct answers across a multi-thousand-item parameter space. |
| Static answer reveal | **The Step Stepper (I-Do, We-Do, You-Do)** | Every worked solution is scaffolded step-by-step with a mandatory *"Why does this step work?"* explanation. |
| Generic theme | **Trigonometric Sun-and-Shadow Design System** | The UI itself obeys the laws of trigonometry: shadows cast dynamically via CSS `tan()`; the progress bar is an authentic sine wave. |
| Raw percentage scoring | **Continuous Bayesian Mastery Engine ($m \in [0, 1]$)** | Honest gating: Boss encounters unlock only when core competencies demonstrate proven retention and accuracy. |
| Client-side API key inlining | **Serverless Proxy with strict content hashing** | Closes security vulnerability identified in reference codebase; ensures zero API secrets reach client bundles. |

---

## 2. Product Vision & Goals

**Vision:** To demystify trigonometry by grounding every symbolic relation in intuitive spatial reality. Formulas are never delivered as unearned dogma—they are **manipulated, noticed, formally named, and then applied** to solve compelling real-world challenges.

### Measurable Success Metrics

| Dimension | Target Metric | Measurement Method |
| --- | --- | --- |
| **Completion Rate** | $\ge 80\%$ finish Level 1; $\ge 65\%$ of Level 1 finishers complete Level 2 | Local telemetry ring buffer tracking phase transitions |
| **Diagnostic Learning Gain** | Normalized gain score $g \ge +0.25$ ($+25$ percentage points pre-to-post) | Identical skill construct diagnostic items before and after level completion |
| **Core Competency Mastery** | $\ge 85\%$ of completers achieve $m \ge 0.70$ on core skills | Continuous Bayesian mastery model evaluation at level exit |
| **Active Time in Flow** | $18–25\text{ minutes}$ median chunk duration | Session timer logs bounded between user interactions |
| **Simulation Interactivity** | $\ge 92\%$ learners engage with all interactive simulation stations | Station completion flags within progress state |
| **Hint Efficiency** | $\le 12\%$ of correct answers require Level-3 (reveal) hint | Ratio of Level-3 hint invocations to total problem attempts |
| **Misconception Defusal** | $\ge 50\%$ reduction in repeat trigger of identical misconception tag | Longitudinal tracking of tagged distractors within a learner session |
| **Accessibility Compliance** | $100\%$ WCAG 2.2 AA conformance; full keyboard and screen reader operability | Automated axe-core regression tests + manual screen reader validation |
| **Runtime Performance** | First Contentful Paint $< 1.5\text{s}$, LCP $< 2.5\text{s}$, 60 fps simulation loops | Lighthouse CI audits and rAF delta telemetry on mid-tier mobile hardware |

---

## 3. Target Users & Personas

### 3.1 Primary Persona: The Apprehensive High Schooler (Ages 14–17)
- **Profile:** High school student taking Geometry, Algebra II, Precalculus, or CBSE Class 10/11. Often suffers from math anxiety or perceives trigonometry as a blur of arbitrary buttons on a calculator.
- **Pain Points:** Confusing opposite and adjacent sides; leaving calculators in radian mode when solving degree problems; feeling lost when identities require algebraic proof.
- **Needs:** Low-stakes exploration, immediate visual feedback, explicit explanations of *why* formulas work, and visible tracking of their growing competency.

### 3.2 Secondary Persona: The STEM Aspirant & Exam Consolidator (Ages 16–18)
- **Profile:** Preparing for competitive college entrance exams (SAT/ACT, AP Calculus, JEE Main, A-Levels).
- **Pain Points:** Knows formulas mechanically but lacks conceptual intuition for wave interference, the ambiguous SSA case, and rapid mental estimation.
- **Needs:** High-velocity practice games, Vedic mental math shortcuts, rigorous geometric derivations, and rich non-right-triangle problem solving.

### 3.3 Tertiary Persona: Teachers & Homeschool Educators
- **Profile:** Using the tool as an interactive classroom demonstration or assigning specific levels for targeted homework/revision.
- **Needs:** Clear curriculum alignment, predictable learning objectives, printable formula cheat-sheets, and a clean, local mastery summary screen without requiring student accounts.

---

## 4. Curriculum Alignment & Learning Objectives

The curriculum rigorously spans international standards:
- **US Common Core:** CCSS.MATH.CONTENT.HSG.SRT.C.6–8, HSG.SRT.D.10–11; HSF.TF.A.1–4, HSF.TF.B.5, HSF.TF.C.8–9.
- **CBSE / NCERT (India):** Class 10 (Ch. 8 & 9: *Introduction to Trigonometry* and *Applications*); Class 11 (Ch. 3: *Trigonometric Functions*); Class 12 (Ch. 2: *Inverse Trigonometric Functions*).
- **UK GCSE & A-Level:** GCSE Higher Tier (trigonometric ratios, exact values, sine/cosine rules, area formula) through A-Level Pure Mathematics (radians, circular functions, sec/cosec/cot, compound angles, identities, modeling).
- **Singapore MOE & IB Diploma:** E-Math / A-Math and IB Mathematics: Analysis and Approaches (SL/HL).

### 4.1 Granular Learning Objectives by Level

#### Level 1 — Shadow Scouts (Beginner)
- **LO 1.1:** Synthesise prerequisite geometric principles: angle sum ($180^\circ$), Pythagorean theorem ($a^2+b^2=c^2$), and similarity scale factors.
- **LO 1.2:** Accurately identify and label the **Hypotenuse**, **Opposite**, and **Adjacent** sides strictly relative to a designated acute angle $\theta$.
- **LO 1.3:** Define the fundamental trigonometric ratios: $\sin\theta = \frac{\text{opp}}{\text{hyp}}$, $\cos\theta = \frac{\text{adj}}{\text{hyp}}$, $\tan\theta = \frac{\text{opp}}{\text{adj}}$, and explain why they remain constant for similar triangles of any scale.
- **LO 1.4:** Construct and derive the exact trigonometric ratios for special angles ($0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$) using geometric folds of equilateral triangles and squares.
- **LO 1.5:** Solve for unknown side lengths and unknown acute angles in right-angled triangles using direct algebraic rearrangement and inverse functions ($\sin^{-1}, \cos^{-1}, \tan^{-1}$).
- **LO 1.6:** Apply the complementary angle theorem: $\sin\theta = \cos(90^\circ - \theta)$ and $\tan\theta = \cot(90^\circ - \theta)$.
- **LO 1.7:** Model and solve real-world single-observer heights and distances using angles of elevation and depression.
- **LO 1.8:** Identify primitive and scaled Pythagorean triples ($(3,4,5), (5,12,13), (8,15,17), (7,24,25)$) to bypass long calculations.

#### Level 2 — Circle Cartographers (Intermediate)
- **LO 2.1:** Evaluate reciprocal ratios: cosecant ($\csc\theta = \frac{1}{\sin\theta}$), secant ($\sec\theta = \frac{1}{\cos\theta}$), and cotangent ($\cot\theta = \frac{1}{\tan\theta}$), and apply quotient identities ($\tan\theta = \frac{\sin\theta}{\cos\theta}, \cot\theta = \frac{\cos\theta}{\sin\theta}$).
- **LO 2.2:** Geometrically derive and algebraically manipulate the three Pythagorean identities: $\sin^2\theta + \cos^2\theta = 1$, $1 + \tan^2\theta = \sec^2\theta$, and $1 + \cot^2\theta = \csc^2\theta$.
- **LO 2.3:** Determine all five remaining trigonometric ratios given any single ratio and quadrant constraint.
- **LO 2.4:** Define trigonometric functions for arbitrary real angles on the Cartesian plane via the Unit Circle ($x = \cos\theta, y = \sin\theta$).
- **LO 2.5:** Determine the sign of trigonometric functions across all four quadrants using the ASTC rule (*All Students Take Calculus*).
- **LO 2.6:** Map arbitrary angles $\theta \in [0^\circ, 360^\circ)$ to acute reference angles $\alpha$ and compute exact values.
- **LO 2.7:** Evaluate negative and coterminal angles using symmetry properties: $\sin(-\theta) = -\sin\theta$ (odd) and $\cos(-\theta) = \cos\theta$ (even).
- **LO 2.8:** Convert fluently between degrees and radians ($\pi\text{ rad} = 180^\circ$); solve arc length ($s = r\theta$) and sector area ($A = \frac{1}{2}r^2\theta$) problems.
- **LO 2.9:** Formulate and solve two-triangle height-and-distance problems involving dual observation points and oblique baselines.
- **LO 2.10:** Compute the area of any non-right triangle using the SAS sine area formula: $\text{Area} = \frac{1}{2}ab\sin C$.

#### Level 3 — Sky Engineers (Advanced)
- **LO 3.1:** Execute structured analytic proofs of complex trigonometric identities using disciplined one-sided transformation strategies.
- **LO 3.2:** Apply sum and difference formulas ($\sin(A \pm B), \cos(A \pm B), \tan(A \pm B)$) to construct non-standard exact values (e.g., $15^\circ, 75^\circ, 105^\circ$).
- **LO 3.3:** Utilize double-angle ($\sin 2A, \cos 2A, \tan 2A$) and power-reducing/half-angle identities in algebraic simplification.
- **LO 3.4:** Solve general non-right triangles using the **Law of Sines** ($\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}$) and **Law of Cosines** ($c^2 = a^2+b^2-2ab\cos C$).
- **LO 3.5:** Rigorously detect, classify, and solve the SSA **ambiguous case** (determining 0, 1, or 2 valid geometric solutions).
- **LO 3.6:** Graph, parameterize, and interpret sinusoidal transformations: $y = A\sin(B(x - C)) + D$, characterizing amplitude ($|A|$), period ($\frac{2\pi}{|B|}$), phase shift ($C$), and vertical midline ($D$).
- **LO 3.7:** Find exact and general solutions for trigonometric equations over specified intervals $[0, 2\pi)$ and over all real numbers, including quadratics in $\sin$ and $\cos$.
- **LO 3.8:** Evaluate inverse trigonometric functions ($\arcsin, \arccos, \arctan$) strictly within their restricted principal-value domains.
- **LO 3.9:** Model complex physical phenomena: navigation bearings, multi-plane 3D surveying, and wave cancellation interference.
- **LO 3.10 (Heritage Boost):** Analyse and numerically verify historical Indian algorithms: Bhāskara I’s rational sine approximation and Mādhava’s infinite polynomial series.

---

## 5. Pedagogical Architecture

### 5.1 The Six Foundational Pedagogical Pillars

```
1. DISCOVER ──► NAME ──► USE       Direct manipulation before abstract nomenclature.
2. PREDICT ──► OBSERVE ──► EXPLAIN Establish curiosity gap via explicit prediction before observation.
3. MISCONCEPTION-FIRST DESIGN      Every wrong answer targets a verified cognitive misconception.
4. FADED WORKED EXAMPLES           I-Do (observe) ──► We-Do (partner) ──► You-Do (independent).
5. INTERLEAVING & SPACED DECAY     Regularly re-injects foundational skills to build long-term retention.
6. INTUITION BEFORE SPEED          Speed tricks unlock strictly after foundational mastery is established.
```

### 5.2 The Signature "SCALE" Problem-Solving Routine

Every right-triangle problem across all levels trains the learner to execute the **SCALE** discipline:

| Step | Move | Learner Cognitive Action | Why It Prevents Failure |
| :---: | :--- | :--- | :--- |
| **S** | **Sketch & Symbolise** | Draw the triangle and mark the $90^\circ$ right-angle square. | Prevents misorienting oblique triangles and establishes visual anchors. |
| **C** | **Choose $\theta$** | Circle the chosen reference angle $\theta$. | Side roles are meaningless until the reference vantage point is anchored. |
| **A** | **Assign Sides** | Label **H** (across from right angle), **O** (across from $\theta$), and **A** (adjacent to $\theta$). | Directly eliminates the #1 beginner error: confusing Hypotenuse with Adjacent. |
| **L** | **Link the Ratio** | Select SOH, CAH, or TOA based on the known and unknown sides. | Prevents blind guessing between sine, cosine, and tangent. |
| **E** | **Evaluate & Sense-Check** | Solve the algebraic equation and inspect the answer against reality. | Catches calculator radian errors, hypotenuse violations, and inversion errors. |

*In Levels 2 & 3, SCALE expands with a pre-step:* **`Z` (Zoom Out):** Is this a right triangle, a unit circle coordinate, an identity proof, or an oblique triangle requiring the sine/cosine rule?

### 5.3 The Step Stepper Engine (I-Do, We-Do, You-Do)

The Step Stepper scaffold operates across three adaptive modes tied to the learner's skill mastery ($m$):
1. **`I-Do` Mode ($m < 0.35$):** Theo narrates each step. The learner taps *"Next Step"*, with animated chalk drawing the diagram and formulas. Every step features an interactive *"Why does this work?"* button.
2. **`We-Do` Mode ($0.35 \le m < 0.65$):** The system completes mechanical steps automatically, pausing at critical junction steps (e.g., choosing the correct ratio or rearranging a fraction) for the learner to solve a lightweight micro-check.
3. **`You-Do` Mode ($m \ge 0.65$):** The learner executes each step independently on the interactive stage. Hints are available on demand, and feedback is provided immediately after each discrete move.

Learners retain agency: tapping *"Show me how again"* gracefully steps back one mode without penalty.

---

## 6. The Complete Learner Journey

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE TRAILHEAD (INTRO)                                  │
│       [Start Level 1]       [Adaptive Skip-Ahead Check (6 Qs)]       [Resume Session]  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
╔═══════════════════════════ LEVEL 1: SHADOW SCOUTS (Beginner) ══════════════════════════╗
║  WONDER: "The Giant You Can't Climb" (Pyramid & Sun interactive scrubber)               ║
║  STORY: "The Shadow Scouts" (6 illustrated historical panels: Thales & Eratosthenes)   ║
║  SIMULATE: 4 Interactive Stations (1A: Shadow Lab, 1B: Side Namer, 1C: Forge, 1D: SCALE)║
║  PRACTICE: Constellation Hub (5 Games: G1–G5)                                          ║
║  BOSS ENCOUNTER B1: "The Pyramid Vault" (8 Security Locks)                             ║
╚═══════════════════════════════════════════╤════════════════════════════════════════════╝
                                            │ Unlock: Boss Passed + Core Mastery ≥ 0.70
                                            ▼
╔════════════════════════ LEVEL 2: CIRCLE CARTOGRAPHERS (Intermediate) ══════════════════╗
║  WONDER: "The Wheel That Draws a Wave" (Ferris Wheel prediction curve canvas)          ║
║  STORY: "The Circle Cartographers" (6 panels: Kusumapura, Aryabhata & the Radian)      ║
║  SIMULATE: 5 Stations (2A: Unit Circle, 2B: Wave Tracer, 2C: Radian Roller, 2D, 2E)    ║
║  PRACTICE: Constellation Hub (5 Games: G6–G9 + G3-II)                                  ║
║  BOSS ENCOUNTER B2: "The Observatory Lock" (8 Multi-Quadrant Astrolabe Dials)          ║
╚═══════════════════════════════════════════╤════════════════════════════════════════════╝
                                            │ Unlock: Boss Passed + Core Mastery ≥ 0.70
                                            ▼
╔═══════════════════════════ LEVEL 3: SKY ENGINEERS (Advanced) ══════════════════════════╗
║  WONDER: "Can Two Sounds Make Silence?" (Phase cancellation interference simulator)    ║
║  STORY: "The Sky Engineers" (6 panels: Kerala School, Sangamagrama, Harbor Bearings)   ║
║  SIMULATE: 5 Stations + 1 Boost (3A: Mixer, 3B: Waves, 3C: Triangles, 3D: Proofs, 3E, 3F)║
║  PRACTICE: Constellation Hub (5 Games: G10–G14)                                        ║
║  BOSS ENCOUNTER B3: "The Final Build" (3-Act Applied Engineering Challenge)           ║
╚═══════════════════════════════════════════╤════════════════════════════════════════════╝
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                  THE FINALE & REFLECT                                  │
│    • Personal Reflection Journal      • Complete Unlocked Formula Vault (Printable)    │
│    • Master Surveyor Credential       • Interactive Sandbox "Free Play" Mode           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Level 1 — Shadow Scouts (Beginner)

### 7.1 Wonder Hook: "The Giant You Can't Climb"
- **Visual Scene:** A majestic Great Pyramid under a vibrant morning sky. A 2-meter surveyor's rod stands nearby.
- **Narrative Audio:** *"Nobody can climb to the top of this pyramid with a measuring tape. Yet over 2,500 years ago, a traveller calculated its exact height without taking a single step upward. How?"*
- **Interactive Scrubber:** The learner drags the golden sun across the sky arc ($10^\circ$ to $80^\circ$). As the sun moves, real-time shadows stretch and shrink.
- **Interactive Challenge:** *"Find the exact moment the shadow of the measuring rod equals the height of the rod itself."*
- **Discovery Moment:** At exactly $45^\circ$, both shadows match their objects' heights. Theo pops up: *"At 45 degrees, the shadow IS the height! But what if the sun is lower or higher? Can a tilt give us an exact multiplier?"*

### 7.2 Story: "The Shadow Scouts" (6 Panels)
- **Panel 1 (The Meridian Express):** Theo and the four apprentices (Ira, Kofi, Mei, Mateo) arrive at the foot of Giza. Theo tasks them with surveying ancient wonders.
- **Panel 2 (Thales by the Pyramid):** In 600 BCE, Thales plants his staff in the desert sand, waiting until his shadow equals his height to measure Pharaoh’s tomb.
- **Panel 3 (The Shifting Sun):** Later in the afternoon, the sun dips. Kofi measures a 2 m rod casting a 3.5 m shadow. Ira realizes: *"The triangle formed by the stick and shadow is identical in shape to the giant triangle of the pyramid!"*
- **Panel 4 (Eratosthenes Measures the Globe):** In Alexandria (c. 240 BCE), shadows cast in deep wells at Syene reveal the curvature and circumference of the Earth.
- **Panel 5 (The Naming of the Ratios):** Aboard the train, Mei writes: $\frac{\text{Opposite}}{\text{Hypotenuse}}$, $\frac{\text{Adjacent}}{\text{Hypotenuse}}$, $\frac{\text{Opposite}}{\text{Adjacent}}$. Theo stamps them: **Sine**, **Cosine**, **Tangent**.
- **Panel 6 (The Call to the Field):** Theo deploys the brass clinometer: *"Give me an angle and one distance, and we will measure the world."*

### 7.3 Interactive Simulation Stations

#### Station 1A · The Shadow Lab (Skills: E0, E3)
- **Phase 1 (Explore):** Drag the sun slider to adjust elevation angle $\theta$. Drag tower height slider ($10\text{ m}$ to $100\text{ m}$).
- **Phase 2 (Discover):** Learners record table entries of $\frac{\text{Height}}{\text{Shadow}}$. They observe that while tower size changes, the ratio remains constant for any given angle.
- **Phase 3 (Formalise):** The relation $\tan\theta = \frac{\text{Height}}{\text{Shadow}}$ is locked into the Formula Vault.
- **Phase 4 (Test):** Given $\theta = 31^\circ$ and a shadow of $50\text{ m}$, use the ratio table to predict tower height.

#### Station 1B · Side Namer & Ratio Builder (Skills: E1, E2)
- **Phase 1 (Explore):** A dynamic right-angled triangle rotatable in 360-degree space. The user taps between acute angle $A$ and acute angle $B$.
- **Phase 2 (Discover):** When $\theta$ switches from $A$ to $B$, the **Opposite** (coral) and **Adjacent** (teal) sides swap positions instantly. The **Hypotenuse** (violet, opposite the right angle) remains immutable.
- **Phase 3 (Formalise):** The SOH-CAH-TOA memory mnemonic is unlocked.
- **Phase 4 (Test):** Rapidly assign O, A, and H across 6 randomly rotated triangles. Drag fraction chips into ratio formulas.

#### Station 1C · Special Angle Forge (Skills: E4, E7)
- **Phase 1 (Explore):** Take an equilateral triangle with side length 2. Slice it down the line of symmetry. Take a unit square (side 1) and slice it along the diagonal.
- **Phase 2 (Discover):** The split equilateral yields angles $30^\circ, 60^\circ, 90^\circ$ with sides $1, \sqrt{3}, 2$. The split square yields $45^\circ, 45^\circ, 90^\circ$ with sides $1, 1, \sqrt{2}$.
- **Phase 3 (Formalise):** The radical pattern table is forged: $\sin(0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ) = \frac{\sqrt{0}}{2}, \frac{\sqrt{1}}{2}, \frac{\sqrt{2}}{2}, \frac{\sqrt{3}}{2}, \frac{\sqrt{4}}{2}$.
- **Phase 4 (Test):** Solve 5 special-angle rapid flash challenges without a calculator.

#### Station 1D · Missing-Side Solver (Skills: E5, E6, E8, E9)
- **Phase 1–3 (Scaffolded SCALE):** Complete a ramp problem, a kite height problem, and a lighthouse elevation problem using the Step Stepper.
- **Phase 4 (Test):** Solve 3 real-world challenges independently with the virtual Clinometer and verified calculation pad.

---

## 8. Level 2 — Circle Cartographers (Intermediate)

### 8.1 Wonder Hook: "The Wheel That Draws a Wave"
- **Visual Scene:** A towering Ferris Wheel rotating at a constant angular velocity. A passenger car glows neon gold.
- **Interactive Scrubber:** A hidden screen conceals the car's vertical height over time.
- **Learner Prediction Canvas:** The learner draws their intuitive prediction of the passenger's height curve over one full revolution.
- **Discovery Moment:** Pressing *"Spin Wheel"* unrolls the actual path: the passenger slows down at the top, accelerates through the vertical middle, tracing a smooth sine wave. Theo asks: *"Why does a constant spin around a circle create a wave? And what is the passenger's height at 210 degrees?"*

### 8.2 Story: "The Circle Cartographers" (6 Panels)
- **Panel 1 (Kusumapura, India, 499 CE):** The team meets Aryabhata, who records astronomical chords called **jya** (bowstrings) in increments of $3^\circ 45'$.
- **Panel 2 (Normalizing to One):** Aryabhata demonstrates that calculating ratios for different celestial spheres is tedious. By setting radius $R = 1$, the chord length directly gives the coordinate. The **Unit Circle** is born.
- **Panel 3 (Coordinates as Trigonometry):** Ira steps onto a giant coordinate plane. A rod of length 1 rotates to angle $\theta$. The x-coordinate is $\cos\theta$; the y-coordinate is $\sin\theta$. Even past $90^\circ$, coordinates never fail!
- **Panel 4 (The Journey of a Word):** Mateo traces the etymology: Sanskrit *jya* $\rightarrow$ Arabic *jiba* (written *jb*) $\rightarrow$ misread as *jayb* (bay/cove) $\rightarrow$ Latin *sinus* $\rightarrow$ English **Sine**.
- **Panel 5 (Walking the Rim):** In an ancient mountain observatory, degree divisions feel arbitrary. Kofi wraps the radius around the circle’s rim: $1\text{ radius} = 1\text{ radian}$. Walking $2\pi$ steps traverses the full circumference.
- **Panel 6 (The Identity Star-Map):** Theo connects the circle, right triangle, and Pythagoras: $\sin^2\theta + \cos^2\theta = 1$.

### 8.3 Interactive Simulation Stations

#### Station 2A · Unit Circle Playground (Skills: M6, M7, M8, M9)
- **Phase 1 (Explore):** Drag point $P$ anywhere around the unit circle ($0^\circ$ to $360^\circ$). Real-time visual projections drop onto the x-axis (cos) and y-axis (sin). A tangent extension meets the line $x = 1$.
- **Phase 2 (Discover):** In Quadrant 2, x is negative while y is positive. The learner observes how folding the triangle horizontally back into Quadrant 1 reveals the acute **reference angle** $\alpha = 180^\circ - \theta$.
- **Phase 3 (Formalise):** The ASTC Quadrant Sign Rule and Reference Angle algorithms are locked into the Vault.
- **Phase 4 (Test):** Given arbitrary angles ($135^\circ, 240^\circ, 330^\circ$), position point $P$, identify the reference angle, and assign exact values with correct signs.

#### Station 2B · Wave Tracer (Skills: M6, M9)
- **Phase 1 (Explore):** Synchronized dual-display: Unit Circle on the left, unfolded Cartesian wave graph on the right.
- **Phase 2 (Discover):** Tracing $\sin\theta$ and $\cos\theta$ simultaneously reveals that cosine is identical to sine, phase-shifted left by $90^\circ$ ($\frac{\pi}{2}\text{ rad}$). Negative angles demonstrate odd/even symmetry ($\sin(-\theta) = -\sin\theta, \cos(-\theta) = \cos\theta$).
- **Phase 3 (Formalise):** Periodicity ($T = 360^\circ = 2\pi$) and symmetry identities are locked.
- **Phase 4 (Test):** Match points on the wave to angles on the circle across 4 rapid challenges.

#### Station 2C · Radian Roller (Skills: M10, M11)
- **Phase 1 (Explore):** A virtual wheel of radius $r$ rolls across a measuring tape, uncoiling a neon ribbon equal to $r$.
- **Phase 2 (Discover):** Exactly $3.14159...$ ($\pi$) radii cover a straight half-turn ($180^\circ$). Exactly $2\pi$ radii cover the complete circle.
- **Phase 3 (Formalise):** Arc length formula $s = r\theta$ and sector area formula $A = \frac{1}{2}r^2\theta$ (where $\theta$ must be in radians) are derived.
- **Phase 4 (Test):** Convert 4 angles between degrees and radians; calculate pizza slice sector areas and orbital arc distances.

#### Station 2D · Identity Lab (Skills: M1, M2, M3, M4, M5)
- **Phase 1 (Explore):** An interactive right triangle embedded in the unit circle with hypotenuse 1.
- **Phase 2 (Discover):** By the Pythagorean theorem, $(\cos\theta)^2 + (\sin\theta)^2 = 1^2$. Dividing all terms by $\cos^2\theta$ yields $1 + \tan^2\theta = \sec^2\theta$. Dividing by $\sin^2\theta$ yields $1 + \cot^2\theta = \csc^2\theta$.
- **Phase 3 (Formalise):** Reciprocal definitions and the three Pythagorean identities enter the Vault.
- **Phase 4 (Test):** "Given one ratio, find all others": Given $\sin\theta = -\frac{3}{5}$ in Quadrant 3, use identity steps to calculate $\cos\theta, \tan\theta, \csc\theta, \sec\theta, \cot\theta$.

#### Station 2E · Height & Distance Studio (Skills: M12, M13)
- **Phase 1–3 (Scaffolded Studio):** Dual-station surveying scenarios (e.g., measuring a mountain peak from two baseline points $100\text{ m}$ apart; computing the height of a cloud ceiling using dual searchlights).
- **Phase 4 (Test):** Set up and solve 2 simultaneous trigonometric equations independently; compute oblique parcel area via $\frac{1}{2}ab\sin C$.

---

## 9. Level 3 — Sky Engineers (Advanced)

### 9.1 Wonder Hook: "Can Two Sounds Make Silence?"
- **Visual Scene:** An acoustic laboratory with two digital audio speakers aimed at a virtual microphone.
- **Narrative Audio:** *"Your noise-cancelling headphones can eliminate airplane engine roar by playing sound back into your ears. How can playing more sound add up to absolute silence?"*
- **Interactive Scrubber:** Speaker 1 plays a fixed sine wave: $y_1 = \sin(x)$. The learner controls Speaker 2's amplitude and phase offset slider ($C$): $y_2 = A\sin(x - C)$.
- **Discovery Moment:** When Speaker 2 is tuned to equal amplitude ($A = 1$) and shifted by half a cycle ($C = 180^\circ$ or $\pi$), the combined output wave flatlines to zero: $\sin(x) + \sin(x + 180^\circ) = 0$. Theo exclaims: *"Opposite phases cancel! Trigonometry powers wave interference, quantum mechanics, and wireless radio!"*

### 9.2 Story: "The Sky Engineers" (6 Panels)
- **Panel 1 (Kerala, India, 14th Century):** At Sangamagrama, astronomer Mādhava derives infinite series expansions for sine and cosine centuries before Newton or Leibniz. Trigonometry becomes exact, calculable, and computational.
- **Panel 2 (The Open Sea & Island Navigation):** Mateo navigates a ship between two distant lighthouses. The triangle formed with the harbor is not right-angled. SOH-CAH-TOA cannot be used directly.
- **Panel 3 (Dropping the Altitude):** Kofi drops an altitude line inside the oblique triangle, splitting it into two right-angled halves sharing a common height $h$. Equating $h = b\sin A = a\sin B$ reveals the **Law of Sines**.
- **Panel 4 (Pythagoras with a Correction):** Ira derives the missing third side when the included angle is known: $c^2 = a^2 + b^2 - 2ab\cos C$. It is the **Law of Cosines**—Pythagoras with a corrective adjustment for non-right angles.
- **Panel 5 (The Symphony of Superposition):** Mei synthesises musical chords on an oscilloscope, demonstrating how compound angles $\sin(A + B)$ govern harmonic frequencies.
- **Panel 6 (Master Surveyor Final Commission):** Theo inaugurates the engineering proving grounds: *"Now we prove identities, command general solutions, and engineer reality."*

### 9.3 Interactive Simulation Stations

#### Station 3A · Angle Mixer (Skills: H2, H3)
- **Phase 1 (Explore):** Stack two rotation angles $A$ and $B$ on the unit circle. Sliders allow interactive sweeping of $A$ and $B$.
- **Phase 2 (Discover):** Inspecting the geometric coordinate projections proves that $\sin(A + B) \neq \sin A + \sin B$. The true geometric breakdown reveals $\sin A\cos B + \cos A\sin B$. Setting $B = A$ immediately derives the double angle identity $\sin 2A = 2\sin A\cos A$.
- **Phase 3 (Formalise):** Sum, difference, and double-angle formulas locked in Vault.
- **Phase 4 (Test):** Calculate exact values for $\sin 75^\circ = \sin(45^\circ + 30^\circ) = \frac{\sqrt{6}+\sqrt{2}}{4}$ and $\cos 15^\circ = \frac{\sqrt{6}+\sqrt{2}}{4}$ with Step Stepper guidance.

#### Station 3B · Wave Interference Studio (Skills: H8, H4 Boost)
- **Phase 1 (Explore):** Full transformation console for $y = A\sin(B(x - C)) + D$.
- **Phase 2 (Discover):** Interactively observe how $A$ stretches amplitude vertically, $B$ compresses wavelength horizontally (Period = $\frac{2\pi}{B}$), $C$ translates phase horizontally, and $D$ shifts the midline vertically.
- **Phase 3 (Formalise):** Parameter extraction rules and sum-to-product wave superposition formulas locked in Vault.
- **Phase 4 (Test):** Match 3 unknown physical wave traces to their algebraic equations; extract parameters from an oscilloscope display.

#### Station 3C · Triangle Solver Lab (Skills: H5, H6, H7)
- **Phase 1 (Explore):** An oblique triangle canvas with draggable vertices $A, B, C$. Real-time side lengths and angle readouts update dynamically.
- **Phase 2 (Discover — The Ambiguous Case):** Lock angle $A$ and adjacent side $b$. Move a slider for side $a$. An animated swinging arc demonstrates:
  - If $a < b\sin A$ (shorter than the altitude), the side swings in mid-air: **0 triangles**.
  - If $a = b\sin A$, it touches the base at exactly $90^\circ$: **1 right triangle**.
  - If $b\sin A < a < b$, the arc cuts the baseline at two distinct points: **2 valid triangles** (one acute, one obtuse).
  - If $a \ge b$, the arc can only hit the positive baseline once: **1 triangle**.
- **Phase 3 (Formalise):** The Law of Sines, Law of Cosines, and Ambiguous Case decision trees locked in Vault.
- **Phase 4 (Test):** Analyze 4 triangle configurations; declare the case (0, 1, or 2 triangles) and solve all missing elements.

#### Station 3D · The Proof Builder (Skills: H1)
- **Phase 1 (Explore):** Step-by-step introduction to legal identity proof maneuvers (Convert to $\sin/\cos$, Common Denominator, Factor/Difference of Squares, Pythagorean Substitution, Conjugate Multiplication, Fraction Splitting).
- **Phase 2 (Discover):** Learners realize that transforming only the more complex side toward the target side prevents fallacious circular arguments (moving terms across an unearned equals sign).
- **Phase 3 (Formalise):** The Identity Strategy Checklist is locked in Vault.
- **Phase 4 (Test):** Construct 2 guided identity proofs by slotting step cards; solve 1 solo proof verified by the engine.

#### Station 3E · Equation Detective (Skills: H9, H10)
- **Phase 1 (Explore):** Simultaneous visualization: Cartesian sine curve intersected by horizontal line $y = k$ alongside the rotating Unit Circle.
- **Phase 2 (Discover):** Intersecting lines show multiple solutions within $[0, 2\pi)$ and an infinite pattern across $\mathbb{R}$. Principal value intervals explain why calculators only return one answer ($\arcsin \in [-\frac{\pi}{2}, \frac{\pi}{2}]$).
- **Phase 3 (Formalise):** General solution formulas ($\theta = n\pi + (-1)^n\alpha$ for sine; $\theta = 2n\pi \pm \alpha$ for cosine) locked in Vault.
- **Phase 4 (Test):** Solve linear and quadratic trigonometric equations (e.g., $2\sin^2 x - \sin x - 1 = 0$) over $[0, 2\pi)$, rejecting extraneous roots.

#### Station 3F (Heritage Boost) · Ancient Superpowers (Skill: H12)
- **Content:** Interactive numerical benchmark testing Bhāskara I’s 7th-century rational approximation:
  $$\sin\theta \approx \frac{4\theta(180^\circ - \theta)}{40500 - \theta(180^\circ - \theta)}$$
  and Mādhava’s polynomial series against modern floating-point values.
- **Outcome:** Non-gating exploration awarding the exclusive 🏺 **Ancient Superpower** badge.

---

## 10. The Speed Trick Vault (Authentic Mental Math & Heritage)

Tricks unlock in the learner's personal Vault **only after the underlying skill achieves mastery $m \ge 0.70$**. Every trick explicitly explains **Why it Works** mathematically before demonstrating its speed advantage.

| ID | Trick Name | Unlocks On | Core Technique & Mathematical Foundation | Speed Advantage |
| :--- | :--- | :---: | :--- | :--- |
| **T1** | **SOH-CAH-TOA Mnemonic** | E2 | *"Some Old Horses Can Always Hear Their Owners Approach"*. | Instant ratio memory recall under exam pressure. |
| **T2** | **Cover-Up Triangle** | E5 | Visual triangle divided horizontally. Unknown on top $\rightarrow$ multiply; unknown on bottom $\rightarrow$ divide. | Eliminates fraction rearrangement mistakes. |
| **T3** | **The Root-over-Two Ladder** | E4 | $\sin(0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ) = \frac{\sqrt{0}}{2}, \frac{\sqrt{1}}{2}, \frac{\sqrt{2}}{2}, \frac{\sqrt{3}}{2}, \frac{\sqrt{4}}{2}$. Reverse for cosine. | Zero memorisation needed for all 5 special angles. |
| **T3b**| **The Hand Trick** | E4 | Five fingers: $0^\circ$ (pinky) to $90^\circ$ (thumb). Fold finger $\theta$: $\sin\theta = \frac{\sqrt{\text{fingers below}}}{2}$, $\cos\theta = \frac{\sqrt{\text{fingers above}}}{2}$. | Physical tactile cheat-sheet usable anywhere. |
| **T4** | **Complementary Flip** | E7 | If $\alpha + \beta = 90^\circ$, then $\sin\alpha = \cos\beta$. Follows from swapping opposite and adjacent sides. | Bypasses calculation when angles sum to $90^\circ$. |
| **T5** | **ASTC Fold-Back** | M7, M8 | *"All Students Take Calculus"*. Fold angle to nearest x-axis for reference angle; apply quadrant sign. | Rapid evaluation of any angle without drawing full circles. |
| **T6** | **Triple Radar & Multiples**| E9 | Memorise $(3,4,5), (5,12,13), (8,15,17), (7,24,25)$. Recognize scale factor $k$. | Computes hypotenuse in $< 2\text{ seconds}$ without square roots. |
| **T7** | **Replace $\pi$ with $180^\circ$**| M10 | $\pi\text{ rad} \equiv 180^\circ$. E.g., $\frac{5\pi}{6} = \frac{5 \times 180^\circ}{6} = 150^\circ$. | Instant mental degree conversion without fraction division. |
| **T8** | **Small Angle Approximation** | M10 | For small $\theta$ in radians, $\sin\theta \approx \tan\theta \approx \theta$. Follows from $\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$. | Instant sanity checking in physics and surveying. |
| **T9** | **Doubled Triples** | H3 | If primitive triangle has $\sin A = \frac{3}{5}$, the double-angle $\sin 2A$ creates triple $(7, 24, 25)$. | Mental evaluation of double-angle ratios. |
| **T10**| **Bhāskara’s Sine Formula**| H12 | $\sin\theta \approx \frac{4\theta(180-\theta)}{40500 - \theta(180-\theta)}$. Max error $< 1.9\%$ across all angles. | Computes accurate sine values without tables or series. |
| **T11**| **Surd Rationalisation** | M5 | $\frac{1}{\sqrt{n}} = \frac{\sqrt{n}}{n}$. Multiplies numerator and denominator by conjugate surd. | Eliminates messy radicals from denominators instantly. |
| **V1** | **Vedic: Ending-in-5 Square**| E0 | For $n5^2$: multiply prefix $n \times (n+1)$, append $25$. (E.g., $75^2 \rightarrow 7 \times 8 = 56 \rightarrow 5625$). | Rapid mental squaring during Pythagorean computations. |
| **V2** | **Vedic: Near-Base Square** | E0 | For $98^2$ (base 100, deficit 2): $98 - 2 = 96$; append $2^2 = 04 \rightarrow 9604$. | Mental squaring of large baseline distances. |

---

## 11. Practice Phase: Constellation Hub & Game Catalogue

### 11.1 The Constellation Hub Architecture
Rather than a generic map, the Practice phase presents a celestial **Constellation of Stars**. Each game is an unlit star in the sky; completing a successful run (accuracy $\ge 70\%$) permanently **lights the star**. The **Boss Encounter** is the radiant central star, remaining locked until at least 4 of 5 stars are lit **and** all core level skills reach mastery $m \ge 0.70$.

Theo continually analyzes the learner’s real-time Bayesian mastery vector, positioning a golden beacon pointing to **"Theo Recommends"** over the game addressing the student's greatest growth opportunity.

### 11.2 Comprehensive Game Specifications (G1 to G14)

All games run inside the unified **GameShell** framework: procedural generation, verified mathematical grading, identical 3-step hint ladder, and zero lives or fail-states.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  GAME CHROME (Score · Sightline Streak · Theo Mascot · Hint Ladder · Calm Mode Toggle) │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│                                    GAME PLAY-FIELD                                     │
│               (SVG Interactive Graphics / MathKeypad / Dynamic Canvas)                 │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  RUN SUMMARY RECAP: Skills Leveled Up · Misconceptions Resolved · Theo Recommendation  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### G1 · Side Sniper (Level 1 · Skill: E1)
- **Mechanic:** Triangles drift smoothly across the radar in random rotational orientations ($0^\circ$ to $360^\circ$). A target prompt flashes: *"Tap the ADJACENT side relative to $\theta$!"* The learner taps the requested edge before the target drifts past.
- **Run Structure:** 12 triangles.
- **Calm Mode:** Drifting is disabled; triangles appear statically with a *"Submit"* button.
- **Misconceptions Targeted:** `ADJ_HYP_CONFUSION`, `OPP_ADJ_SWAP`.

#### G2 · Ratio Rush (Level 1 · Skills: E2, E3)
- **Mechanic:** A central right triangle with marked sides is displayed. Falling fraction cards appear at the top. The player drags each fraction into one of three landing bins: **$\sin\theta$**, **$\cos\theta$**, or **$\tan\theta$**. Correct streaks accelerate combo multipliers.
- **Run Structure:** 10 rounds.
- **Misconceptions Targeted:** `RATIO_INVERTED`, `RATIO_WRONG_FN`.

#### G3 · Height Hunter I & II (Levels 1 & 2 · Skills: E5, E6, E8, M12)
- **Mechanic:** Exploration-rich field scenarios: measuring a castle battlement, a kite trapped in a tree, a harbor lighthouse, or a drone above a stadium. The player positions the Clinometer, reads the elevation angle, selects the appropriate SCALE equation, and solves for the unknown height. Level 2 introduces dual-angle baselines.
- **Run Structure:** 6 narrative scenes.
- **Misconceptions Targeted:** `ONE_STEP_INVERT`, `CALC_MODE`.

#### G4 · Trick Duel (Level 1 · Skills: E4, E7, T3)
- **Mechanic:** Rapid flash challenges against Theo. A special angle value appears (e.g., $\cos 60^\circ$ or $\sin 45^\circ$). The player selects the exact value tile ($\frac{1}{2}, \frac{\sqrt{2}}{2}, \frac{\sqrt{3}}{2}$) from a pool.
- **Run Structure:** 12 quick flashes.
- **Misconceptions Targeted:** `SPECIAL_SWAP`.

#### G5 · Error Detective I & II (Levels 1 & 2 · Skills: All)
- **Mechanic:** A complete student notebook solution is presented with exactly **one mathematically faulty step**. The player taps the erroneous line, then identifies the exact misconception that caused it from a multiple-choice diagnostic list.
- **Run Structure:** 6 worked solutions.
- **Misconceptions Targeted:** All library tags.

#### G6 · Quadrant Painter (Level 2 · Skills: M6, M7, M8, M9)
- **Mechanic:** A large coordinate plane with the 4 quadrants. A prompt appears: *"Where is $\tan\theta > 0$ and $\cos\theta < 0$?"* The player paints the correct quadrants. Later rounds ask the learner to position an interactive angle arm to match specified coordinate signs.
- **Run Structure:** 8 challenges.
- **Misconceptions Targeted:** `SIGN_AFTER_SQRT`, `REF_ANGLE_SLIP`.

#### G7 · Unit Circle Runner (Level 2 · Skills: M6, M7, M8)
- **Mechanic:** An orb orbits the Unit Circle. Gateway checkpoints demand quick inputs: entering the coordinate values, selecting the reference angle, or picking the sign. Correct answers boost momentum; incorrect gates slow the orb but never cause game-over.
- **Run Structure:** 2 full laps (12 gates).
- **Calm Mode:** Turn-based stepping from gate to gate with no time pressure.
- **Misconceptions Targeted:** `REF_ANGLE_SLIP`, `SIGN_AFTER_SQRT`.

#### G8 · Radian Match-Up (Level 2 · Skills: M10, M11)
- **Mechanic:** A constellation memory grid of floating cards: Degree measures ($60^\circ$), Radian measures ($\frac{\pi}{3}$), Arc lengths, and Pie Sector graphics. Players flip and pair matching mathematical entities.
- **Run Structure:** 3 progressive boards ($4\times 2$, $4\times 3$, $4\times 4$).
- **Misconceptions Targeted:** `RAD_AS_DEGREES`, `RADIAN_DEGREE_RATIO_FLIP`.

#### G9 · Simplify Race (Level 2 · Skills: M1–M5)
- **Mechanic:** A messy trigonometric expression is displayed (e.g., $\frac{\tan x}{\sin x}$). A rack of algebraic rewrite tiles is available (e.g., *"Replace $\tan$ with $\sin/\cos$"*, *"Cancel terms"*, *"Apply $\sin^2+\cos^2=1$"*). The goal is to reach the simplest target form in the fewest moves.
- **Run Structure:** 8 expression puzzles.
- **Misconceptions Targeted:** `RECIPROCAL_VS_INVERSE`, `SQUARE_POSITION`.

#### G10 · Proof Builder Game (Level 3 · Skill: H1)
- **Mechanic:** Formal identity proof cards are scrambled. The player reorders the transformation steps and attaches the required mathematical justification move (*"Pythagorean Identity"*, *"Conjugate Multiplication"*, *"Factor Difference of Squares"*) to each link.
- **Run Structure:** 5 complete proofs.
- **Misconceptions Targeted:** `MOVE_ACROSS_EQ`, `CANCEL_TRIG_ARGUMENT`.

#### G11 · Wave Tuner (Level 3 · Skill: H8)
- **Mechanic:** A target physical wave (e.g., electrocardiogram, seismic rumble, or musical tone) is displayed on an oscilloscope. The player adjusts dials for Amplitude ($A$), Frequency/Period ($B$), Phase Shift ($C$), and Midline ($D$) until their wave achieves perfect constructive resonance with the target.
- **Run Structure:** 6 physical wave matching scenarios.
- **Misconceptions Targeted:** `PERIOD_SLIP`.

#### G12 · Triangle Verdict (Level 3 · Skills: H5, H6, H7)
- **Mechanic:** A courtroom-style case file presents partial triangle data (e.g., $A = 30^\circ, a = 7, b = 10$). The player acts as the judge, examining the evidence: Which rule applies? (Sine or Cosine), and how many valid triangles exist? (0, 1, or 2). A verdict gavel seals the choice.
- **Run Structure:** 8 diagnostic cases.
- **Misconceptions Targeted:** `AMBIG_IGNORED`, `AMBIGUOUS_OBTUSE_CHECK`.

#### G13 · Solution Sweep (Level 3 · Skills: H9, H10)
- **Mechanic:** A sinusoidal graph is intersected by a target line. The player must sweep and tap **every valid intersection solution** within the interval $[0, 2\pi)$. In later rounds, algebraic equations are solved using the MathKeypad and verified on the live sweep line.
- **Run Structure:** 8 equation sweeps.
- **Misconceptions Targeted:** `GENERAL_MISSING_SOLS`, `PRINCIPAL_RANGE`.

#### G14 · Exact or Bust (Level 3 · Skills: H2, H3, M5)
- **Mechanic:** The player synthesises non-standard exact values (e.g., $\sin 75^\circ$ or $\cos 105^\circ$) by picking an angle decomposition ($45^\circ + 30^\circ$), selecting the compound identity, dragging exact surd chips, and reducing the final expression to canonical form $\frac{\sqrt{6}\pm\sqrt{2}}{4}$.
- **Run Structure:** 8 exact value builds.
- **Misconceptions Targeted:** `DISTRIBUTE_SIN`, `LINEAR_TRIG_DISTRIBUTION`.

---

## 12. Problem System, Continuous Mastery & Feedback Engine

### 12.1 Problem Input Formats

1. **Multiple Choice (Single/Multi-Select):** 4 options maximum; every single distractor is deterministically tied to a specific misconception tag.
2. **The MathKeypad (Exact / Numeric):** Clean on-screen virtual keyboard supporting fractions ($\frac{a}{b}$), square roots ($\sqrt{x}$), $\pi$, powers ($x^2$), degree symbols ($^\circ$), and trigonometric functions. Prevents input parsing ambiguity.
3. **Diagram Direct Interaction:** Tapping edges, dragging vertices, positioning points on circles, aiming clinometer angles.
4. **Drag-to-Slot / Order:** Arranging procedural steps, proof lines, or matching cards.
5. **Continuous Sliders:** Accessible range sliders with fine keyboard stepper incrementation ($\pm 1^\circ$ on arrows; $\pm 15^\circ$ on Shift+arrows).
6. **Error Spotting:** Tapping line items directly in worked notebooks.

### 12.2 Procedural Generation with Independent Dual-Verification

To prevent item memorisation and guarantee 100% mathematical validity, every skill is supported by **at least 3 deterministic procedural generators**:
- **Seeded Pseudo-Random Generation:** Every problem instance is generated from a seeded PRNG (`mulberry32`). Any reported question can be recreated perfectly via its `seed` and `index`.
- **Independent Dual Verification:** The generator algorithm computes the item via standard trigonometric formulas. Before rendering, the item is fed to an **independent verification routine** utilizing a completely separate mathematical method (e.g., verifying a missing side via unit triangle scaling and Pythagorean validation; verifying identity equivalences via numerical multi-point sampling).
- **Distractor Validation:** If any distractor accidentally evaluates to the correct answer or duplicates another option, the generator automatically rejects the seed and regenerates.
- **Declared Pool Capacity:** Minimum $\ge 2,000$ distinct valid parameter combinations per level.

### 12.3 The Continuous Bayesian Mastery Model

Mastery of each skill is modeled as a continuous scalar $m \in [0, 1]$, initialized at $m_0 = 0.25$. After each item attempt, $m$ updates dynamically:

$$\Delta m = \begin{cases} 
0.25 \times (1 - m) & \text{if Correct on 1st Attempt (No Hints)} \\
0.125 \times (1 - m) & \text{if Correct after Level-1 or Level-2 Hint} \\
-0.20 \times m & \text{if Incorrect on Attempt}
\end{cases}$$

- **Time-Decay Function:** To incentivize retention and revision, skills with $m > 0.50$ not revisited for $> 24\text{ hours}$ decay gently toward $0.50$ at a rate of $20\%$ per week.
- **Gating Prerequisite:** A level’s Boss encounter unlocks only when **every core skill** in that level satisfies:
  $$m \ge 0.70 \quad \text{AND} \quad \text{Attempts} \ge 4$$
- **Adaptive Interleaving:** Practice game queues draw $70–80\%$ of items targeting the learner's weakest skills, interleaved with $20–30\%$ review items from earlier skills to combat forgetting.

### 12.4 The 3-Step Hint Ladder & Targeted Feedback

Feedback is immediate, constructive, and never presents a dead-end:

| Level | Type | System Action & Tone | Scoring |
| :---: | :--- | :--- | :--- |
| **0** | **Correct (First Try)** | Enthusiastic celebration; displays 1-line *"Why this works"* reinforcement. | Full SP ($10\text{ pts}$) + Sightline Streak increment. |
| **1** | **Targeted Nudge** | Analyzes the chosen distractor’s misconception tag; Theo highlights the relevant diagram element and provides a targeted cognitive hint (e.g., *"You used cosine. Which side is opposite the marked angle?"*). | $7\text{ SP}$ awarded upon correction. |
| **2** | **Guided Step Stepper** | The Step Stepper opens automatically at the exact failing step in **We-Do** mode, walking through the decision. | $4\text{ SP}$ awarded upon correction. |
| **3** | **Full Worked Reveal** | The full Step Stepper displays the complete solution in **I-Do** mode with animated chalk and audio narration. The item returns to the back of the queue with fresh parameters. | $2\text{ participation SP}$. Streak resets; no points deducted. |

---

## 13. Gamification & Progression Architecture

### 13.1 Survey Points (SP) & Sightline Streaks
- **Points:** $10\text{ SP}$ for first-try correct; $7\text{ SP}$ after Hint 1; $4\text{ SP}$ after Hint 2; $2\text{ SP}$ for completing a worked solution.
- **Sightline Streak:** An animated surveying sightline expands with each consecutive correct answer. At streak $\ge 5$, a $+3\text{ SP}$ precision bonus attaches to all correct answers. Missing an answer resets the streak but **never subtracts points**.

### 13.2 Compass Stamps (Level Masteries)
At the conclusion of each level, learners earn an engraved Compass Stamp for their surveyor log:
- 🥉 **Bronze Stamp:** All core level skills achieve $m \ge 0.70$.
- 🥈 **Silver Stamp:** All core skills $m \ge 0.80$ and Level Boss passed.
- 🥇 **Gold Stamp:** All core skills $m \ge 0.90$, Boss passed with $\ge 7/8$ score, and $\le 5$ reveal-hints used in the entire level.

### 13.3 Instrument Unlocks (Functional Tools)
Instruments earned at each level are not mere badges—they become **active functional tools** in the learner’s belt:
- 🔭 **The Clinometer (Level 1 Unlock):** An interactive elevation reader usable to inspect heights in later levels.
- 🧭 **The Angle Compass (Level 2 Unlock):** A floating, draggable Unit Circle widget for looking up reference angles and quadrant coordinates during Level 3 proofs.
- 📐 **The Theodolite (Level 3 Unlock):** A complete 3D surveying apparatus capable of computing oblique non-right triangles and bearings.

### 13.4 Boss Encounters & Confidence Bets
Each level concludes with an 8-stage Boss challenge:
- **B1: The Pyramid Vault (Level 1):** 8 security locks requiring escalating right-triangle solutions.
- **B2: The Observatory Lock (Level 2):** 8 multi-quadrant celestial dials requiring unit-circle solutions in degrees and radians.
- **B3: The Final Build (Level 3):** A 3-act applied engineering mission: (1) Survey a radio tower baseline, (2) Orient solar panels via equations, (3) Tune waves to cancel acoustic noise.
- **Confidence Bets:** Before each lock, the learner toggles *"Sure"* or *"Unsure"*. A correct *"Sure"* answer awards double bonus SP; an incorrect *"Sure"* answer deducts zero points but flags that skill for immediate Theo review.
- **Passing Standard:** $\ge 6$ of 8 stages correct to pass. Failed stages trigger a brief Theo coaching review and a fresh parameter retry.

---

## 14. Mascot, Voice & Narration Design

### 14.1 Theo the Theodolite-Bot
Theo is a charming, vintage brass theodolite robot standing on a sturdy tripod base, featuring a tilting telescope "eye", brass tuning knobs, and a spirit level bubble atop his head.
- **The Spotlight Eye:** Theo’s telescope emits a warm beam of light onto the interactive field, dynamically spotlighting the specific edge, angle, or formula line referenced in hints.
- **Mood States:**
  - *Curious:* Head tilted sideways, telescope zooming gently (Wonder and discovery).
  - *Measuring:* Telescope locks firmly onto a geometric angle, spirit bubble levels (Step Stepper active).
  - *Thinking:* Brass gears spin quietly with a soft click (Analysing an incorrect attempt).
  - *Encouraging:* Warm smile on LED display, lens glowing amber (Hint delivery).
  - *Celebrating:* Lens emits starry sparkles, tripod hops joyfully (Level/Boss victory).

### 14.2 Narration Architecture & Speech Standards
- **Paragraphs and Prompts Only:** Audio narration is strictly applied to story dialogue, challenge prompts, and hints. **Headers, menu labels, and raw table cells are never read aloud.**
- **Synchronized Spoken-Form Authoring:** Every spoken math line has a dedicated, phonetically accurate spoken string authored beside its visual LaTeX code:
  - *Visual:* $\sin 30^\circ = \frac{1}{2}$ $\longrightarrow$ *Spoken:* `"sine of thirty degrees equals one half"`
  - *Visual:* $\sqrt{3}/2$ $\longrightarrow$ *Spoken:* `"square root of three over two"`
  - *Visual:* $\theta = \tan^{-1}(7/9)$ $\longrightarrow$ *Spoken:* `"theta equals inverse tangent of seven over nine"`
- **Accessibility Captions:** Real-time synchronized text captions appear in the Margin whenever narration plays. If audio is muted in settings, captions remain visible by default.

---

## 15. UX, Aesthetics & Visual Design System

### 15.1 Core Aesthetic: The Interface Obeys Trigonometry

The application does not simply teach trigonometry—**the interface itself is governed by trigonometry**:
1. **Dynamic Trigonometric Shadow Engine:** Every card, button, and floating instrument casts a realistic CSS shadow computed dynamically from the solar elevation angle:
   $$\text{Shadow Length} = \frac{\text{Element Lift}}{\tan(\text{Sun Elevation})}$$
2. **Atmospheric Times of Day:**
   - *Level 1 (Morning):* Crisp sky blue, golden sunlight ($48^\circ$ sun elevation), blueprint grid textures.
   - *Level 2 (Golden Hour):* Rich sunset amber, deep purple horizons, long dramatic shadows ($18^\circ$ sun elevation).
   - *Level 3 (Night Sky):* Deep oceanic navy, glowing starlight, aurora accents, moonlight shadows ($62^\circ$ lunar elevation).
3. **The Living Sun Arc Progress Bar:** Progress through a level is charted by the sun traversing a true sine curve path: $y = \text{baseline} - \sin(\pi \cdot p) \times \text{amplitude}$.
4. **"Peek Under the Hood":** Tapping Theo's spirit level opens a discrete popover displaying the exact live trigonometric CSS formula currently styling the page.

### 15.2 Curated Color Palette & Tokens

```css
:root {
  /* Core Foundation Tokens */
  --color-ink-deep:     #0E1B3D; /* Primary typography & crisp geometry lines */
  --color-sunlight:     #FFC933; /* Highlights, angle arcs, discovery badges */
  --color-zenith-blue:  #2457F5; /* Primary interaction buttons & active tabs */
  
  /* Tri-Color Geometric Side Identity (Consistent & Immutable Across App) */
  --color-side-hyp:     #6C4DF6; /* Hypotenuse: Deep Royal Violet (Dotted/Solid) */
  --color-side-opp:     #FF5D73; /* Opposite: Radiant Coral Red (Dashed) */
  --color-side-adj:     #13B5A6; /* Adjacent: Ocean Teal (Solid) */
  
  /* Level Atmospheric Backgrounds */
  --bg-level-1:         #F2F7FF; /* Level 1: Morning Blueprint Sky */
  --bg-level-2:         linear-gradient(135deg, #2B1E5B 0%, #F29E4C 100%); /* Golden Hour */
  --bg-level-3:         #0A1030; /* Level 3: Midnight Deep Space */
}
```

*Every geometric side is triple-coded:* **Color + Text Label (O/A/H) + Stroke Style (Dashed/Solid/Dotted)**, ensuring 100% usability for colorblind learners.

### 15.3 Typography Hierarchy
- **Headlines & Display:** *Bricolage Grotesque* (punchy, energetic, with distinctive mathematical numerals).
- **Body & Dialogue:** *Atkinson Hyperlegible Next* (award-winning legibility engineered for dyslexia and vision impairments).
- **Theo’s Margin Notes:** *Caveat* (warm handwritten cursive for asides and encouragement).
- **Maths Typesetting:** *KaTeX* rendered as accessible HTML+MathML.

### 15.4 Responsive Layout Architecture
- **Desktop ($\ge 1024\text{px}$):** Split-view workspace. Left $65\%$: **The Field** (full-bleed interactive canvas). Right $35\%$: **The Margin** (Theo’s dialogue, Step Stepper cards, Formula Vault chips). Bottom: Floating Instrument Belt.
- **Tablet ($768\text{px} - 1023\text{px}$):** Proportional scaling of The Field; The Margin adapts as an expandable side drawer.
- **Mobile ($375\text{px} - 767\text{px}$):** Stacked vertical layout. The Field remains pinned to the top viewport ($55\text{vh}$); The Margin becomes an interactive bottom sheet with swipe-to-expand controls.

---

## 16. Authoritative Production Baselines (Resolving Open Inquiries)

This section provides definitive, final production answers to all six product planning questions:

### 1. Target Syllabus Alignment & Notation Switch
- **Decision:** The curriculum formally aligns with **US Common Core (HSG.SRT, HSF.TF)** and **CBSE Class 10 & 11**, fully covering UK GCSE/A-Level requirements.
- **Implementation:** Notation for reciprocal sine defaults to **`cosec`** (Commonwealth/India standard) with an instant header toggle to **`csc`** (US standard). The user's preference persists across sessions in `localStorage`.

### 2. Level 1 Calculator Policy
- **Decision:** Level 1 enforces mental and geometric derivation for all special angles ($30^\circ, 45^\circ, 60^\circ$) and triples.
- **Implementation:** For decimal real-world height problems, an in-app virtual calculator appears. It is permanently locked in **`DEG`** mode with a bright green badge. In one specific guided station, Theo presents a "broken" radian calculator to explicitly teach learners how to detect the `CALC_MODE` error.

### 3. Narration Rollout Strategy
- **Decision:** Tiered launch. Full pre-generated ElevenLabs studio audio ships in v1.0 for all **Wonder hooks, Story panels, Station formalizations, and Mascot cheers** (100% coverage of core narrative).
- **Implementation:** Dynamic procedural practice hints use the secure serverless TTS proxy with instant fallback to on-screen captions.

### 4. Branding & White-Label Positioning
- **Decision:** Standalone hero product titled **Sky Surveyors — Trigonometry**.
- **Implementation:** A tasteful, discrete *"Powered by Intellia Learning Engine"* appears in the footer and credits modal. No intrusive third-party frames or dependencies.

### 5. Educator Reporting Without Student Accounts
- **Decision:** A zero-login, privacy-first **"Learner Report Card & Mastery Snapshot"**.
- **Implementation:** A dedicated button in the header opens a printable modal displaying the student's mastery scores across all 34 skills, stamps earned, and time spent. The report can be printed via a clean `@media print` stylesheet or downloaded as a cryptographically signed JSON file for teacher review.

### 6. Boost Content Inclusion
- **Decision:** Both Boost Stations (**H4: Product-to-Sum** and **H12: Ancient Superpowers**) are fully included in v1.0.
- **Implementation:** They are classified as optional **Stargazer Expeditions**. They do not block level progression gates, allowing advanced students to dive deep while keeping the core path accessible to all.

---

## 17. Success Criteria & Release Gates

| Verification Gate | Mandatory Standard for Launch |
| :--- | :--- |
| **Functional Completeness** | All 3 Levels, 14 Stations, 14 Games, and 3 Boss encounters playable end-to-end without console errors. |
| **Mathematical Accuracy** | Every registered procedural generator passes $10,000$ consecutive seeds with **zero verification failures**. |
| **Pedagogical Coverage** | All 34 skills feature complete Step Stepper scripts across I-Do, We-Do, and You-Do modes. |
| **Accessibility Conformance** | $100\%$ pass on automated axe-core accessibility tests across all routes and themes; full keyboard-only operability verified. |
| **Performance Budgets** | Initial JavaScript bundle $\le 250\text{ KB}$ gzipped; mid-tier mobile Lighthouse score $\ge 90$ Performance and $\ge 95$ Accessibility. |
| **Security Certification** | Complete automated scan confirming zero API keys or secrets in client source or production `dist/` bundle. |

---

## 18. Out of Scope for v1.0 (Phase 2 Roadmap)

The following items are deliberately deferred to maintain focus on trigonometric excellence:
1. **Multiplayer / Classroom Competitions:** Real-time peer duels (planned for v1.2).
2. **Device Hardware Sensors (Augmented Reality Clinometer):** Using smartphone gyro/accelerometer to measure real physical trees outdoors (Phase 2 flagship feature).
3. **Calculus / Advanced Vector Modules:** Derivatives of trigonometric functions, Taylor series proofs, Euler’s formula ($e^{ix} = \cos x + i\sin x$), and spherical trigonometry (reserved for dedicated *Sky Surveyors: Calculus* follow-up module).
4. **Multi-Language Audio Dubbing:** Spanish and Hindi voiceover pipelines (slated for v1.1).

---

## Appendix A — Complete 34-Skill Formula Ladder & Pedagogical Recipes

Every skill in the module possesses an explicit Step Stepper recipe containing its mathematical definition, exact step-by-step procedure, "Why" justification, mental trick, and primary misconception defense.

### Level 1 — Shadow Scouts (Beginner)

#### Skill E0 · Prerequisite Toolkit (E0a: Angle Sum; E0b: Pythagoras; E0c: Scale Factors)
- **Mathematical Form:** $A + B + C = 180^\circ$; $a^2 + b^2 = c^2$; $k = \frac{\text{new}}{\text{old}}$.
- **Steps:** (1) Identify given elements $\rightarrow$ (2) Sum knowns and subtract from target $\rightarrow$ (3) For right triangles, verify hypotenuse $c = \sqrt{a^2+b^2}$ is longest.
- **Why:** Tearing the corners off any paper triangle forms a straight line ($180^\circ$).
- **Tricks:** V1 & V2 (Vedic squaring near base 100 or ending in 5).
- **Watch Out:** `PYTHAG_ADD_LEG` (adding instead of subtracting when finding a leg).

#### Skill E1 · Side Namer Relative to $\theta$
- **Mathematical Form:** $\text{Hypotenuse} \perp 90^\circ$; $\text{Opposite} \leftrightarrow \theta$; $\text{Adjacent} \cap \theta$.
- **Steps:** (1) Locate right-angle box $\rightarrow$ (2) Trace opposite edge to label **Hypotenuse** $\rightarrow$ (3) Anchor chosen angle $\theta$ $\rightarrow$ (4) Trace across to label **Opposite** $\rightarrow$ (5) Label remaining touching side as **Adjacent**.
- **Why:** "Opposite" and "Adjacent" describe spatial relationships to an observer standing at $\theta$. Swapping corners swaps their identities.
- **Watch Out:** `ADJ_HYP_CONFUSION`, `OPP_ADJ_SWAP`.

#### Skill E2 · Fundamental Right-Triangle Ratios
- **Mathematical Form:** $\sin\theta = \frac{\text{opp}}{\text{hyp}}, \quad \cos\theta = \frac{\text{adj}}{\text{hyp}}, \quad \tan\theta = \frac{\text{opp}}{\text{adj}}$.
- **Steps:** (1) Execute SCALE $\rightarrow$ (2) Write ratio fraction with explicit labels $\rightarrow$ (3) Substitute numerical lengths $\rightarrow$ (4) Reduce fraction.
- **Why:** The ratio of two sides in a right triangle depends solely on the acute angle, not triangle scale.
- **Trick:** T1 (SOH-CAH-TOA).
- **Watch Out:** `RATIO_INVERTED`, `RATIO_WRONG_FN`.

#### Skill E3 · Scale Invariance of Ratios
- **Mathematical Form:** $\triangle ABC \sim \triangle A'B'C' \implies \frac{\text{opp}}{\text{hyp}} = \frac{k \cdot \text{opp}}{k \cdot \text{hyp}} = \text{constant}$.
- **Steps:** (1) Measure ratio in unit triangle $\rightarrow$ (2) Scale triangle by $k$ $\rightarrow$ (3) Observe $k$ cancels in division.
- **Why:** Dilations preserve angles and multiply all lengths by $k$; fraction reduction washes $k$ away.

#### Skill E4 · Special Angle Exact Values ($0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$)
- **Mathematical Form:** Standard exact values table:
  $$\begin{array}{c|ccccc}
  \theta & 0^\circ & 30^\circ & 45^\circ & 60^\circ & 90^\circ \\ \hline
  \sin\theta & 0 & 1/2 & \sqrt{2}/2 & \sqrt{3}/2 & 1 \\
  \cos\theta & 1 & \sqrt{3}/2 & \sqrt{2}/2 & 1/2 & 0 \\
  \tan\theta & 0 & \sqrt{3}/3 & 1 & \sqrt{3} & \text{undef}
  \end{array}$$
- **Steps:** (1) Cut equilateral triangle of side 2 in half ($1, \sqrt{3}, 2$) $\rightarrow$ (2) Cut unit square diagonally ($1, 1, \sqrt{2}$) $\rightarrow$ (3) Read ratios directly.
- **Tricks:** T3 (The Root Pattern: $\frac{\sqrt{n}}{2}$), T3b (Hand Trick).
- **Watch Out:** `SPECIAL_SWAP` (swapping values of $30^\circ$ and $60^\circ$).

#### Skill E5 · Missing Side Calculation (SCALE)
- **Mathematical Form:** $\text{Target} = \text{Known} \times f(\theta)$ OR $\text{Target} = \frac{\text{Known}}{f(\theta)}$.
- **Steps:** (1) **S**ketch triangle $\rightarrow$ (2) **C**hoose $\theta$ $\rightarrow$ (3) **A**ssign O, A, H $\rightarrow$ (4) **L**ink ratio $\rightarrow$ (5) **E**valuate: if unknown is on top, multiply; if on bottom, divide.
- **Trick:** T2 (Cover-Up Triangle).
- **Watch Out:** `ONE_STEP_INVERT`, `CALC_MODE`.

#### Skill E6 · Missing Angle Calculation (Inverse Ratios)
- **Mathematical Form:** $\theta = \sin^{-1}\left(\frac{\text{opp}}{\text{hyp}}\right) = \cos^{-1}\left(\frac{\text{adj}}{\text{hyp}}\right) = \tan^{-1}\left(\frac{\text{opp}}{\text{adj}}\right)$.
- **Steps:** (1) Execute SCALE to find ratio of two known sides $\rightarrow$ (2) Input fraction into inverse function $\rightarrow$ (3) Sense-check: angle must be between $0^\circ$ and $90^\circ$.
- **Why:** Inverse functions reverse the mapping, retrieving the unique acute angle that generates that ratio.
- **Watch Out:** `INV_AS_RECIPROCAL` (confusing $\sin^{-1} x$ with $\frac{1}{\sin x}$).

#### Skill E7 · Complementary Angle Relationships
- **Mathematical Form:** $\sin\theta = \cos(90^\circ - \theta), \quad \cos\theta = \sin(90^\circ - \theta), \quad \tan\theta = \frac{1}{\tan(90^\circ - \theta)}$.
- **Steps:** (1) Subtract $\theta$ from $90^\circ$ $\rightarrow$ (2) Swap co-function ($\sin \leftrightarrow \cos, \tan \leftrightarrow \cot$).
- **Why:** In any right triangle, the side opposite to one acute angle is directly adjacent to the other acute angle.
- **Trick:** T4.

#### Skill E8 · Angles of Elevation & Depression
- **Mathematical Form:** $\tan(\text{angle}) = \frac{\text{vertical height}}{\text{horizontal distance}}$.
- **Steps:** (1) Draw horizontal sightline at eye level $\rightarrow$ (2) Measure elevation upwards, depression downwards $\rightarrow$ (3) Form right triangle $\rightarrow$ (4) Add observer eye-height if calculating total ground elevation.
- **Watch Out:** `ELEVATION_FROM_VERTICAL` (measuring angle from the vertical plumb line instead of horizontal).

#### Skill E9 · Pythagorean Triple Recognition
- **Mathematical Form:** $a^2 + b^2 = c^2$ for integers $(3,4,5), (5,12,13), (8,15,17), (7,24,25)$.
- **Steps:** (1) Check if two known sides share a common divisor $\rightarrow$ (2) Match against primitive triple $\rightarrow$ (3) Scale remaining side by common factor.
- **Trick:** T6.

---

### Level 2 — Circle Cartographers (Intermediate)

#### Skill M1 · Reciprocal Trigonometric Ratios
- **Mathematical Form:** $\csc\theta = \frac{1}{\sin\theta} = \frac{\text{hyp}}{\text{opp}}, \quad \sec\theta = \frac{1}{\cos\theta} = \frac{\text{hyp}}{\text{adj}}, \quad \cot\theta = \frac{1}{\tan\theta} = \frac{\text{adj}}{\text{opp}}$.
- **Steps:** (1) Find primary ratio $\rightarrow$ (2) Invert fraction. Remember: the "co" prefix hops over ($\sin \leftrightarrow \csc; \cos \leftrightarrow \sec$).
- **Watch Out:** `RECIPROCAL_VS_INVERSE`.

#### Skill M2 · Quotient Identities
- **Mathematical Form:** $\tan\theta = \frac{\sin\theta}{\cos\theta}, \quad \cot\theta = \frac{\cos\theta}{\sin\theta}$.
- **Steps:** (1) Write $\frac{\text{opp}/\text{hyp}}{\text{adj}/\text{hyp}}$ $\rightarrow$ (2) Cancel shared hypotenuse denominators $\rightarrow$ (3) Arrive at $\frac{\text{opp}}{\text{adj}}$.

#### Skill M3 · The Pythagorean Identities
- **Mathematical Form:** 
  $$\sin^2\theta + \cos^2\theta = 1, \quad 1 + \tan^2\theta = \sec^2\theta, \quad 1 + \cot^2\theta = \csc^2\theta$$
- **Steps:** (1) Start with $x^2 + y^2 = 1$ on unit circle $\rightarrow$ (2) Substitute $x=\cos\theta, y=\sin\theta$ $\rightarrow$ (3) Divide through by $\cos^2\theta$ or $\sin^2\theta$ to derive secondary forms.
- **Watch Out:** `SQUARE_POSITION`, `PYTHAGOREAN_ADDITION`.

#### Skill M4 · Given One Ratio, Find All Others
- **Mathematical Form:** Construct reference right triangle from ratio $\frac{p}{q}$; compute third side $\sqrt{q^2-p^2}$; apply quadrant signs.
- **Steps:** (1) Draw reference triangle in correct quadrant $\rightarrow$ (2) Solve missing side via Pythagoras $\rightarrow$ (3) Read off all 6 ratios $\rightarrow$ (4) Assign ASTC signs.

#### Skill M5 · Exact Surd Simplification
- **Mathematical Form:** Conjugate rationalisation: $\frac{1}{\sqrt{a}\pm\sqrt{b}} = \frac{\sqrt{a}\mp\sqrt{b}}{a-b}$.
- **Steps:** (1) Multiply numerator and denominator by surd conjugate $\rightarrow$ (2) Expand denominator difference of squares $\rightarrow$ (3) Reduce rational fractions.
- **Trick:** T11.

#### Skill M6 · The Unit Circle Coordinates
- **Mathematical Form:** Point $P(\theta) = (\cos\theta, \sin\theta)$ on $x^2+y^2=1$. Slope of radius $= \tan\theta$.
- **Steps:** (1) Rotate ray by angle $\theta$ from positive x-axis $\rightarrow$ (2) Project vertically to x-axis ($\cos$) and horizontally to y-axis ($\sin$).

#### Skill M7 · Signs by Quadrant (ASTC Rule)
- **Mathematical Form:**
  $$\text{Q1: All } (+), \quad \text{Q2: Sin } (+), \quad \text{Q3: Tan } (+), \quad \text{Q4: Cos } (+)$$
- **Steps:** (1) Identify terminal ray quadrant $\rightarrow$ (2) Check $(x, y)$ coordinate signs $\rightarrow$ (3) Assign signs to functions.
- **Trick:** T5.

#### Skill M8 · Reference Angle Reduction
- **Mathematical Form:** $\alpha \in [0^\circ, 90^\circ]$ measured to nearest x-axis:
  $$\text{Q1: } \alpha = \theta, \quad \text{Q2: } \alpha = 180^\circ - \theta, \quad \text{Q3: } \alpha = \theta - 180^\circ, \quad \text{Q4: } \alpha = 360^\circ - \theta$$
- **Steps:** (1) Reduce $\theta$ modulo $360^\circ$ $\rightarrow$ (2) Compute $\alpha$ to x-axis $\rightarrow$ (3) Look up exact value for $\alpha$ $\rightarrow$ (4) Affix ASTC sign.
- **Watch Out:** `REF_ANGLE_SLIP` (measuring to y-axis).

#### Skill M9 · Negative & Coterminal Angles
- **Mathematical Form:** $\theta \equiv \theta + 360^\circ k$; $\sin(-\theta) = -\sin\theta$ (odd); $\cos(-\theta) = \cos\theta$ (even).
- **Steps:** (1) Add/subtract $360^\circ$ to find primary coterminal angle $\rightarrow$ (2) Apply reflection symmetry across x-axis.

#### Skill M10 · Degree ↔ Radian Conversion
- **Mathematical Form:** $\text{Radians} = \text{Degrees} \times \frac{\pi}{180^\circ}, \quad \text{Degrees} = \text{Radians} \times \frac{180^\circ}{\pi}$.
- **Steps:** (1) Replace $\pi$ with $180^\circ$ for rapid mental conversion $\rightarrow$ (2) Simplify fractions.
- **Trick:** T7.
- **Watch Out:** `RAD_AS_DEGREES`, `RADIAN_DEGREE_RATIO_FLIP`.

#### Skill M11 · Arc Length & Sector Area
- **Mathematical Form:** $s = r\theta, \quad A = \frac{1}{2}r^2\theta \quad (\theta \text{ in radians})$.
- **Steps:** (1) Verify/convert angle $\theta$ strictly to radians $\rightarrow$ (2) Substitute into formulas $\rightarrow$ (3) Attach correct linear/square units.

#### Skill M12 · Two-Step Height & Distance Systems
- **Mathematical Form:** $h = \frac{d}{\cot\alpha - \cot\beta} = \frac{d\tan\alpha\tan\beta}{\tan\beta - \tan\alpha}$.
- **Steps:** (1) Sketch two right triangles sharing common vertical height $h$ $\rightarrow$ (2) Form two tangent equations $\rightarrow$ (3) Equate expressions for shared base and isolate $h$.

#### Skill M13 · Non-Right Triangle Area Formula
- **Mathematical Form:** $\text{Area} = \frac{1}{2}ab\sin C$.
- **Steps:** (1) Identify two known sides and their included angle $C$ $\rightarrow$ (2) Compute $\frac{1}{2}ab$ $\rightarrow$ (3) Multiply by $\sin C$.

---

### Level 3 — Sky Engineers (Advanced)

#### Skill H1 · Structured Identity Proving Strategy
- **Rules:** Never move terms across the equals sign! Work on the more complex side until it identically matches the other.
- **Sequential Strategy Protocol:**
  1. *Convert to Sin/Cos:* Replace $\tan, \cot, \sec, \csc$.
  2. *Single Fraction:* Combine terms over lowest common denominator.
  3. *Algebraic Factoring:* Factor differences of squares or pull out common factors.
  4. *Pythagorean Swap:* Substitute $1 - \sin^2 x \leftrightarrow \cos^2 x$, etc.
  5. *Conjugate Multiplier:* Multiply numerator and denominator by $(1 \pm \cos x)$.
  6. *Split Fractions:* $\frac{A+B}{C} = \frac{A}{C} + \frac{B}{C}$.
- **Watch Out:** `MOVE_ACROSS_EQ`, `CANCEL_TRIG_ARGUMENT`.

#### Skill H2 · Sum & Difference Formulas
- **Mathematical Form:**
  $$\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B, \quad \cos(A \pm B) = \cos A\cos B \mp \sin A\sin B$$
  $$\tan(A \pm B) = \frac{\tan A \pm \tan B}{1 \mp \tan A\tan B}$$
- **Steps:** (1) Decompose target angle into special angles ($75^\circ = 45^\circ + 30^\circ$, $15^\circ = 45^\circ - 30^\circ$) $\rightarrow$ (2) Expand formula $\rightarrow$ (3) Substitute exact surds $\rightarrow$ (4) Combine over common denominator $4$.
- **Watch Out:** `DISTRIBUTE_SIN` ($\sin(A+B) = \sin A + \sin B$).

#### Skill H3 · Double-Angle & Half-Angle Formulas
- **Mathematical Form:**
  $$\sin 2A = 2\sin A\cos A, \quad \cos 2A = \cos^2 A - \sin^2 A = 2\cos^2 A - 1 = 1 - 2\sin^2 A$$
  $$\sin^2 A = \frac{1 - \cos 2A}{2}, \quad \cos^2 A = \frac{1 + \cos 2A}{2}$$
- **Steps:** (1) Identify double argument $2A$ $\rightarrow$ (2) Choose optimal $\cos 2A$ variant to match knowns $\rightarrow$ (3) Evaluate.
- **Trick:** T9 (Doubled Triples).

#### Skill H4 (Boost) · Product-to-Sum & Sum-to-Product
- **Mathematical Form:**
  $$\sin A\cos B = \frac{1}{2}[\sin(A+B) + \sin(A-B)], \quad \cos A\cos B = \frac{1}{2}[\cos(A-B) + \cos(A+B)]$$
  $$\sin C + \sin D = 2\sin\left(\frac{C+D}{2}\right)\cos\left(\frac{C-D}{2}\right)$$
- **Application:** Acoustic beat frequency calculations and wave superposition.

#### Skill H5 · The Law of Sines
- **Mathematical Form:** $\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$.
- **Steps:** (1) Check for known opposite pair (side $a$ and angle $A$) $\rightarrow$ (2) Set up proportion $\rightarrow$ (3) Cross-multiply and solve $\rightarrow$ (4) Sense-check: larger side must oppose larger angle.
- **Watch Out:** `SINE_RULE_INVERT_PAIR`.

#### Skill H6 · The Law of Cosines
- **Mathematical Form:** $c^2 = a^2 + b^2 - 2ab\cos C \iff \cos C = \frac{a^2+b^2-c^2}{2ab}$.
- **Steps:** (1) Apply when SAS (two sides and included angle) or SSS (three sides) are given $\rightarrow$ (2) Substitute into formula $\rightarrow$ (3) Square root for side, or inverse cosine for angle $\rightarrow$ (4) Always solve for largest angle first when using SSS to detect obtuse angles.
- **Watch Out:** `COSINE_RULE_ORDER_OF_OPS` (calculating $(a^2+b^2 - 2ab) \times \cos C$).

#### Skill H7 · The Ambiguous Case (SSA)
- **Mathematical Form:** Given $A, a, b$; compute altitude $h = b\sin A$:
  - *If $A < 90^\circ$:* $a < h \implies 0$ triangles; $a = h \implies 1$ right triangle; $h < a < b \implies 2$ triangles ($B_1$ acute, $B_2 = 180^\circ - B_1$ obtuse); $a \ge b \implies 1$ triangle.
  - *If $A \ge 90^\circ$:* $a \le b \implies 0$ triangles; $a > b \implies 1$ triangle.
- **Watch Out:** `AMBIG_IGNORED`, `AMBIGUOUS_OBTUSE_CHECK`.

#### Skill H8 · Sinusoidal Wave Modeling
- **Mathematical Form:** $y = A\sin(B(x - C)) + D$.
  - $\text{Amplitude} = |A|, \quad \text{Period} = \frac{2\pi}{|B|}, \quad \text{Phase Shift} = C, \quad \text{Midline } y = D$.
- **Steps:** (1) Find midline $D = \frac{\max+\min}{2}$ $\rightarrow$ (2) Find amplitude $A = \frac{\max-\min}{2}$ $\rightarrow$ (3) Measure cycle length $T$ and compute $B = \frac{2\pi}{T}$ $\rightarrow$ (4) Find horizontal shift $C$.
- **Watch Out:** `PERIOD_SLIP` (using $2\pi B$ instead of $\frac{2\pi}{B}$).

#### Skill H9 · Trigonometric Equations & General Solutions
- **Mathematical Form:** Over interval $[0, 2\pi)$ or all $\mathbb{R}$:
  $$\sin x = k \implies x = n\pi + (-1)^n \arcsin(k), \quad \cos x = k \implies x = 2n\pi \pm \arccos(k)$$
- **Steps:** (1) Isolate trigonometric function $\rightarrow$ (2) Determine reference angle $\alpha$ $\rightarrow$ (3) Identify ASTC quadrants $\rightarrow$ (4) For quadratics, substitute $u = \sin x$, factor, and discard extraneous roots ($|u| > 1$).
- **Watch Out:** `GENERAL_MISSING_SOLS`.

#### Skill H10 · Inverse Trigonometric Functions & Principal Domains
- **Mathematical Form:**
  $$\arcsin: [-1, 1] \rightarrow \left[-\frac{\pi}{2}, \frac{\pi}{2}\right], \quad \arccos: [-1, 1] \rightarrow [0, \pi], \quad \arctan: \mathbb{R} \rightarrow \left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$$
- **Steps:** (1) Identify value sign $\rightarrow$ (2) Select answer strictly within principal domain $\rightarrow$ (3) For composition $\sin(\arccos(x))$, draw reference triangle with hypotenuse 1.
- **Watch Out:** `PRINCIPAL_RANGE`.

#### Skill H11 · Real-World Bearings & 3D Trigonometry
- **Mathematical Form:** Three-figure bearings clockwise from true North ($000^\circ$ to $360^\circ$); multi-plane projection linkage.
- **Steps:** (1) Draw local North datum line at every single waypoint $\rightarrow$ (2) Convert bearings to interior triangle angles $\rightarrow$ (3) Apply Sine/Cosine laws $\rightarrow$ (4) For 3D problems, solve horizontal plane base triangle first, then project into vertical elevation triangle.
- **Watch Out:** `BEARING_NOT_FROM_NORTH`.

#### Skill H12 (Boost) · Ancient Superpower Algorithms
- **Mathematical Form:**
  - Bhāskara I (629 CE): $\sin\theta^\circ \approx \frac{4\theta(180-\theta)}{40500 - \theta(180-\theta)}$.
  - Mādhava of Sangamagrama (1380 CE): $\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + \dots$
- **Steps:** (1) Evaluate algebraic rational approximation $\rightarrow$ (2) Compare against exact value $\rightarrow$ (3) Appreciate pre-calculus Indian mathematical genius.

---

## Appendix B — Comprehensive Misconception Library (25 Tags)

Every distractor option across the 14 games and procedural generators maps strictly to one of these verified cognitive failure modes:

| Misconception Tag | Description | Concrete Example | Targeted Remediation Nudge |
| :--- | :--- | :--- | :--- |
| `ADJ_HYP_CONFUSION` | Identifies Hypotenuse as Adjacent side. | Labels slanted side across from $90^\circ$ as "Adjacent". | *"Find the right-angle box first. The side across from it is ALWAYS the Hypotenuse!"* |
| `OPP_ADJ_SWAP` | Swaps Opposite and Adjacent roles. | Evaluates $\sin\theta = \text{adj}/\text{hyp}$. | *"Stand at angle $\theta$. Which side is directly across the room without touching you?"* |
| `RATIO_INVERTED` | Inverts numerator and denominator. | Computes $\tan\theta = \frac{\text{adj}}{\text{opp}}$ instead of $\frac{\text{opp}}{\text{adj}}$. | *"Check SOH-CAH-TOA! In TOA, Opposite is on top, Adjacent is on the bottom."* |
| `RATIO_WRONG_FN` | Chooses wrong trigonometric ratio. | Uses $\cos$ when problem involves Opposite and Hypotenuse. | *"List your two sides: you have Opposite and Hypotenuse. Only SINE connects those two!"* |
| `ONE_STEP_INVERT` | Divides when should multiply (or vice versa). | Solves $\sin 30^\circ = \frac{x}{12}$ as $x = 12 \div \sin 30^\circ$. | *"The unknown is on top! Multiply both sides by the denominator to set it free."* |
| `CALC_MODE` | Calculator set to Radians instead of Degrees. | Calculates $\sin 35^\circ \approx -0.428$ (Radian result). | *"Look at Theo's badge: your calculator is in RAD mode! Switch to DEG for degrees."* |
| `INV_AS_RECIPROCAL` | Treats $\sin^{-1} x$ as $\frac{1}{\sin x}$. | Computes $\sin^{-1}(0.5) = \frac{1}{\sin(0.5)} \approx 2.08$. | *"$\sin^{-1}$ means UNDO the ratio to find the angle—it does not mean flip the fraction!"* |
| `SPECIAL_SWAP` | Swaps special values ($30^\circ \leftrightarrow 60^\circ$). | Thinks $\sin 30^\circ = \frac{\sqrt{3}}{2}$. | *"Use the Root Ladder: $30^\circ$ is the small angle, so $\sin 30^\circ$ gets the small value: $1/2$."* |
| `SQUARE_POSITION` | Confuses $\sin^2\theta$ with $\sin(\theta^2)$. | Evaluates $\sin^2(30^\circ)$ as $\sin(900^\circ)$. | *"$\sin^2\theta$ is shorthand for $(\sin\theta)^2$. Find $\sin 30^\circ$ first, then square the result!"* |
| `SIGN_AFTER_SQRT` | Forgets negative sign in Quadrants 2, 3, 4. | Concludes $\cos\theta = +4/5$ when $\theta \in \text{Q2}$. | *"Check your ASTC quadrant compass! In Quadrant 2, cosine (the x-coordinate) must be negative."* |
| `REF_ANGLE_SLIP` | Measures reference angle to y-axis. | Takes reference angle of $150^\circ$ as $150^\circ - 90^\circ = 60^\circ$. | *"Reference angles must ALWAYS hug the horizontal x-axis! $180^\circ - 150^\circ = 30^\circ$."* |
| `RAD_AS_DEGREES` | Treats radians as degree measures. | Reads $\sin(\pi/6)$ as $\sin(0.52^\circ)$. | *"$\pi$ radians represents a half-circle ($180^\circ$). Replace $\pi$ with $180^\circ$ to see the angle!"* |
| `RADIAN_DEGREE_RATIO_FLIP` | Multiplies by $\frac{180}{\pi}$ instead of $\frac{\pi}{180}$. | Converts $45^\circ \rightarrow 45 \times \frac{180}{\pi}$. | *"Degrees to radians needs $\pi$ on top! Multiply by $\frac{\pi}{180^\circ}$ to cancel the degrees."* |
| `DISTRIBUTE_SIN` | Assumes linearity: $\sin(A+B) = \sin A + \sin B$. | Claims $\sin(60^\circ) = \sin 30^\circ + \sin 30^\circ = 1$. | *"Trigonometry curves! $\sin(A+B)$ requires the full Angle Mixer formula: $\sin A\cos B + \cos A\sin B$."* |
| `LINEAR_TRIG_DISTRIBUTION`| Claims $\sin(2x) = 2\sin x$. | Writes $\sin(60^\circ) = 2\sin(30^\circ) = 1$. | *"You cannot pull a factor out of a trig function! Use $\sin 2x = 2\sin x\cos x$."* |
| `CANCEL_TRIG_ARGUMENT` | Cancels inside function argument. | Simplifies $\frac{\sin 2x}{2} \rightarrow \sin x$. | *"The argument is locked inside the function! You cannot divide through an angle argument."* |
| `MOVE_ACROSS_EQ` | Moves terms across unproven equals sign. | Adds $\cot x$ to both sides in an identity proof. | *"Work on ONE side only! Moving terms across assumes what you are trying to prove."* |
| `RECIPROCAL_VS_INVERSE` | Confuses $\sec x$ with $\cos^{-1} x$. | Replaces $\sec x$ with $\arccos x$. | *"$\sec x$ flips the ratio ($\frac{1}{\cos x}$); $\arccos x$ finds the angle from a ratio."* |
| `AMBIG_IGNORED` | Assumes SSA always yields one triangle. | Solves only acute angle $B_1$ in SSA configuration. | *"Look at the swinging arc! When $h < a < b$, a second obtuse triangle always exists."* |
| `AMBIGUOUS_OBTUSE_CHECK`| Accepts obtuse $B_2$ when $A + B_2 \ge 180^\circ$. | Declares 2 triangles when $30^\circ + 160^\circ = 190^\circ$. | *"Check the angle sum! The second angle plus angle $A$ must be strictly less than $180^\circ$."* |
| `PERIOD_SLIP` | Multiplies period by $B$ instead of dividing. | States period of $\sin(2x)$ is $2\pi \times 2 = 4\pi$. | *"A larger $B$ speeds up the cycle, squeezing the wave! $\text{Period} = \frac{2\pi}{B} = \pi$."* |
| `GENERAL_MISSING_SOLS` | Reports only principal branch solution. | Solves $\sin x = 1/2$ as only $x = 30^\circ$. | *"Sine is positive in BOTH Quadrant 1 and Quadrant 2! $180^\circ - 30^\circ = 150^\circ$ is also a solution."* |
| `PRINCIPAL_RANGE` | Returns inverse angle outside allowed range. | Gives $\cos^{-1}(-0.5) = -60^\circ$ or $240^\circ$. | *"The $\arccos$ principal range is strictly $[0, 180^\circ]$. The answer must be $120^\circ$."* |
| `COSINE_RULE_ORDER_OF_OPS`| Subtracts $2ab$ before multiplying $\cos C$. | Computes $a^2+b^2-2ab\cos C$ as $(a^2+b^2-2ab) \times \cos C$. | *"Multiplication comes before subtraction! You must multiply $2ab \times \cos C$ before subtracting."* |
| `BEARING_NOT_FROM_NORTH` | Measures bearing from horizontal East. | Draws bearing $060^\circ$ as $60^\circ$ above the horizon. | *"Bearings ALWAYS start pointing directly North and rotate clockwise!"* |

---

## Appendix C — Production Story Scripts (18 Panels with Exact Narration)

### Level 1 — Shadow Scouts (6 Panels)
- **Panel 1.1 — The Meridian Express:**
  - *Scene:* The steampunk time-train pulls up before the Giza plateau at sunrise.
  - *Display:* "Destination: Giza, 600 BCE. Mission: Measure the Great Pyramid."
  - *Spoken:* "The Meridian Express rolls to a stop before the Great Pyramid of Giza. Nobody can climb this ancient wonder with a measuring tape. Apprentice surveyors, Theo has your first mission."
- **Panel 1.2 — Thales and the Staff:**
  - *Scene:* Thales of Miletus plants an upright wooden staff in the sand beside the monumental pyramid.
  - *Display:* "As the story is told, Thales waited for the sun to align."
  - *Spoken:* "As ancient stories tell, the philosopher Thales planted his staff in the desert sand. He did not climb. He waited until his own shadow was exactly as long as his staff."
- **Panel 1.3 — The Moving Shadow:**
  - *Scene:* Kofi measures a 2-meter staff casting a 3.5-meter shadow as the sun sinks.
  - *Display:* "Staff: 2 meters tall, 3.5 meters shadow. The tilt links them all."
  - *Spoken:* "Later in the afternoon, the sun dips. Kofi measures a two-meter rod casting a three-point-five meter shadow. Ira notices: the triangle made by the staff has the exact same shape as the giant triangle made by the pyramid."
- **Panel 1.4 — Measuring the Earth:**
  - *Scene:* Eratosthenes examines sunlight beams descending into deep wells in Syene and Alexandria.
  - *Display:* "Alexandria, c. 240 BCE: Eratosthenes measures the planet."
  - *Spoken:* "In Alexandria, Eratosthenes realized that shadows cast in two distant cities revealed the curvature of the world. With simple angles and footsteps, humanity measured the circumference of the Earth."
- **Panel 1.5 — The Naming of the Ratios:**
  - *Scene:* Inside the train observatory, Mei writes three fraction tiles while Theo stamps them with golden brass seals.
  - *Display:* "Sine = Opp / Hyp · Cosine = Adj / Hyp · Tangent = Opp / Adj"
  - *Spoken:* "Aboard the train, Mei names the three sacred ratios: opposite over hypotenuse, adjacent over hypotenuse, and opposite over adjacent. Theo stamps them with their true names: Sine, Cosine, and Tangent."
- **Panel 1.6 — The Call to the Field:**
  - *Scene:* Theo presents the brass Clinometer tool to the learner.
  - *Display:* "Unlock: The Clinometer. Give me an angle, and I will measure the world."
  - *Spoken:* "Theo unlatches the brass clinometer. Give me an angle and a single baseline distance, and together we will measure anything tall."

### Level 2 — Circle Cartographers (6 Panels)
- **Panel 2.1 — The Astronomers of Kusumapura:**
  - *Scene:* Ancient India, 499 CE. Astronomer Aryabhata unrolls palm-leaf manuscripts under a starry sky.
  - *Display:* "Kusumapura, 499 CE: Aryabhata's Bowstring Tables."
  - *Spoken:* "In ancient India, the astronomer Aryabhata mapped the heavens using bowstrings called jya. Instead of flat triangles, he placed angles inside circles."
- **Panel 2.2 — The Circle of Radius One:**
  - *Scene:* Aryabhata demonstrates drawing a circle of radius exactly 1.
  - *Display:* "Set Radius = 1. The chord becomes the coordinate."
  - *Spoken:* "Calculating ratios for different planetary spheres was tedious. Aryabhata simplified everything by setting the circle's radius to exactly one. The Unit Circle was born."
- **Panel 2.3 — Coordinates as Ratios:**
  - *Scene:* Ira stands on a giant Cartesian grid. A rotating arm of length 1 sweeps into Quadrant 2.
  - *Display:* "Point P = (cos θ, sin θ). Coordinates work for any angle!"
  - *Spoken:* "Ira watches the rotating beam sweep past ninety degrees. A right triangle cannot have an angle of one hundred and twenty degrees, but a circle can! The horizontal position is cosine; the vertical position is sine."
- **Panel 2.4 — The Journey of a Word:**
  - *Scene:* A parchment map tracing trade routes from India through Baghdad to medieval Europe.
  - *Display:* "Jya → Jiba → Jayb → Sinus → Sine."
  - *Spoken:* "Mateo traces the word's thousand-year journey. The Sanskrit word jya traveled to Arabic as jiba, was translated into Latin as sinus meaning a fold or bay, and finally became our English word, Sine."
- **Panel 2.5 — Walking the Rim:**
  - *Scene:* Kofi rolls a wheel along a circular track, uncoiling a ribbon of length $r$.
  - *Display:* "One Radius along the Rim = 1 Radian. π radians = 180°."
  - *Spoken:* "Degrees are arbitrary human divisions. Kofi wraps the circle's own radius along its curved rim. Walking exactly one radius marks one radian. Walking pi radians turns a perfect half-circle."
- **Panel 2.6 — The Great Identity Map:**
  - *Scene:* Theo aligns the right triangle inside the unit circle, highlighting $x^2 + y^2 = 1$.
  - *Display:* "sin²θ + cos²θ = 1. The Circle meets Pythagoras."
  - *Spoken:* "Theo links the unit circle directly to Pythagoras. Because the hypotenuse is always one, sine squared plus cosine squared must always equal one. We are ready to map the full circle."

### Level 3 — Sky Engineers (6 Panels)
- **Panel 3.1 — The Kerala Mathematicians:**
  - *Scene:* Kerala, 14th century. Mādhava of Sangamagrama sketches infinite series curves in sand.
  - *Display:* "Kerala, c. 14th Century: Mādhava's Infinite Series."
  - *Spoken:* "At the Kerala school of mathematics, Mādhava discovered that sine and cosine could be computed to infinite decimal precision using infinite series, centuries before European calculus."
- **Panel 3.2 — Ships in the Fog:**
  - *Scene:* Mateo navigates a ship caught between two coastal lighthouses forming an oblique triangle.
  - *Display:* "Oblique Triangles: When right angles disappear."
  - *Spoken:* "A ship navigates through dense fog between two distant lighthouses. The triangle formed with the coastline has no right angle. SOH-CAH-TOA alone cannot save them."
- **Panel 3.3 — The Altitude Split:**
  - *Scene:* Kofi draws an altitude line dividing the oblique triangle into two right-angled halves.
  - *Display:* "Shared Height: a / sin A = b / sin B (The Law of Sines)."
  - *Spoken:* "Kofi drops a vertical altitude down the center. By sharing a common height between two right triangles, the Law of Sines is revealed: every side divided by the sine of its opposite angle is perfectly equal."
- **Panel 3.4 — Correcting Pythagoras:**
  - *Scene:* Ira adjusts a triangle vertex, demonstrating how non-right angles stretch or shrink the hypotenuse.
  - *Display:* "c² = a² + b² - 2ab cos C (The Law of Cosines)."
  - *Spoken:* "When the angle between two known sides is not ninety degrees, Pythagoras needs an adjustment. The Law of Cosines applies a smooth correction term, handling any triangle in the universe."
- **Panel 3.5 — Harmonic Waves:**
  - *Scene:* Mei adjusts dual acoustic wave dials on a soundboard, watching them merge.
  - *Display:* "Superposition: sin(A + B). Sound, light, and radio."
  - *Spoken:* "Mei blends musical chords on an audio synthesizer. Combining two pure sine waves creates complex harmonics, governed by the compound angle formulas that power wireless communication."
- **Panel 3.6 — The Master Surveyor Commission:**
  - *Scene:* Theo stands atop a panoramic modern observatory bridge with all four apprentices.
  - *Display:* "Commission: Prove identities, command general solutions, engineer the future."
  - *Spoken:* "Theo turns to you with his telescope gleaming. You have mastered shadows and conquered the unit circle. Now, prove your identities and build the world. Welcome, Sky Engineer."

---

## Appendix D — Glossary for Content Creators & Engineers

- **Ambiguous Case (SSA):** A geometric scenario where two sides and a non-included acute angle are specified, potentially producing 0, 1, or 2 distinct non-congruent triangles depending on the altitude $h = b\sin A$.
- **Angle of Depression:** The acute angle measured downward from a true horizontal eye-level sightline to a target below.
- **Angle of Elevation:** The acute angle measured upward from a true horizontal eye-level sightline to a target above.
- **ASTC Rule:** A mnemonic (*All Students Take Calculus*) indicating which primary trigonometric functions are positive in Quadrants 1, 2, 3, and 4 respectively.
- **Bearing:** A navigation heading measured in degrees strictly clockwise from true North ($000^\circ$ to $360^\circ$), customarily written with three digits.
- **Clinometer:** An optical instrument designed to measure angles of slope, elevation, or depression relative to gravity.
- **Coterminal Angles:** Angles in standard position that share the identical terminal ray (differing by an integer multiple of $360^\circ$ or $2\pi\text{ radians}$).
- **Identity:** An algebraic trigonometric equation that evaluates to true for every single valid domain value for which both expressions are defined.
- **Law of Cosines:** A generalized form of the Pythagorean theorem applicable to all planar triangles: $c^2 = a^2 + b^2 - 2ab\cos C$.
- **Law of Sines:** A proportional law relating side lengths of any triangle to the sines of their opposite angles: $\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}$.
- **Principal Value:** The uniquely defined value returned by an inverse trigonometric function within its mathematically restricted range.
- **Radian:** The SI unit of angular measure defined as the subtended angle at the center of a circle whose arc length is equal to the radius ($1\text{ rad} = \frac{180^\circ}{\pi} \approx 57.2958^\circ$).
- **Reference Angle:** The positive acute angle ($\alpha \in [0^\circ, 90^\circ]$) formed between the terminal ray of an angle and the horizontal x-axis.
- **Surd:** An irrational root expression left in radical form (e.g., $\sqrt{2}, \sqrt{3}, \frac{\sqrt{6}+\sqrt{2}}{4}$) for exact mathematical representation.
- **Theodolite:** A precision surveying instrument equipped with rotatable horizontal and vertical telescopes used for measuring 3D angles.
- **Unit Circle:** A circle of radius exactly 1 centered at the origin $(0, 0)$ of the Cartesian coordinate plane, defined by $x^2 + y^2 = 1$.
