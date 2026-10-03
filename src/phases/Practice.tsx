// src/phases/Practice.tsx
import React, { useState } from 'react';
import { useApp } from '../app/state/AppContext';
import { GAMES_REGISTRY } from '../content/games';
import { Theo } from '../components/mascot/Theo';
import confetti from 'canvas-confetti';
import { sound } from '../app/audio';

interface PracticeItem {
  prompt: string;
  options: Array<{ text: string; correct: boolean; tag?: string }>;
  whyReason: string;
}

function shuffleArray<T>(array: readonly T[] | T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Dynamic question banks for all games G1 to G14
const sampleItems: Record<string, PracticeItem[]> = {
  // --- LEVEL 1 GAMES ---
  G1: [
    {
      prompt: 'In a right triangle, which side is ALWAYS across from the 90° right angle?',
      options: [
        { text: 'The Hypotenuse', correct: true },
        { text: 'The Opposite side', correct: false, tag: 'ADJ_HYP_CONFUSION' },
        { text: 'The Adjacent side', correct: false, tag: 'ADJ_HYP_CONFUSION' },
        { text: 'The Median line', correct: false },
      ],
      whyReason: 'The Hypotenuse is by definition the side opposing the right-angle square.',
    },
    {
      prompt: 'Relative to acute angle θ, which side directly touches θ without being the Hypotenuse?',
      options: [
        { text: 'Adjacent side', correct: true },
        { text: 'Opposite side', correct: false, tag: 'OPP_ADJ_SWAP' },
        { text: 'Hypotenuse', correct: false, tag: 'ADJ_HYP_CONFUSION' },
        { text: 'Altitude', correct: false },
      ],
      whyReason: 'Adjacent means touching or neighboring the chosen angle.',
    },
    {
      prompt: 'If we switch our vantage point to the other acute angle, what happens to Opposite and Adjacent?',
      options: [
        { text: 'They swap places!', correct: true },
        { text: 'They stay the same', correct: false },
        { text: 'The Hypotenuse disappears', correct: false },
        { text: 'Both become zero', correct: false },
      ],
      whyReason: 'Opposite and Adjacent are relative descriptions anchored strictly to the chosen vantage corner.',
    },
    {
      prompt: 'In any right-angled triangle, which side is ALWAYS the longest?',
      options: [
        { text: 'The Hypotenuse', correct: true },
        { text: 'The Adjacent side', correct: false },
        { text: 'The Opposite side', correct: false },
        { text: 'It depends on angle θ', correct: false },
      ],
      whyReason: 'Because the 90° angle is the largest angle in the triangle, the Hypotenuse opposing it is strictly longest.',
    },
    {
      prompt: 'The side lying completely across the interior from angle θ is called the:',
      options: [
        { text: 'Opposite side', correct: true },
        { text: 'Adjacent side', correct: false },
        { text: 'Hypotenuse', correct: false },
        { text: 'Secant', correct: false },
      ],
      whyReason: 'Opposite means directly across the triangle from the chosen vantage point.',
    },
  ],
  G2: [
    {
      prompt: 'Which ratio fraction defines Sine θ?',
      options: [
        { text: 'Opposite ÷ Hypotenuse', correct: true },
        { text: 'Adjacent ÷ Hypotenuse', correct: false, tag: 'RATIO_WRONG_FN' },
        { text: 'Opposite ÷ Adjacent', correct: false, tag: 'RATIO_WRONG_FN' },
        { text: 'Hypotenuse ÷ Opposite', correct: false, tag: 'RATIO_INVERTED' },
      ],
      whyReason: 'SOH: Sine is Opposite over Hypotenuse.',
    },
    {
      prompt: 'Which ratio fraction defines Tangent θ?',
      options: [
        { text: 'Opposite ÷ Adjacent', correct: true },
        { text: 'Adjacent ÷ Opposite', correct: false, tag: 'RATIO_INVERTED' },
        { text: 'Adjacent ÷ Hypotenuse', correct: false, tag: 'RATIO_WRONG_FN' },
        { text: 'Hypotenuse ÷ Adjacent', correct: false },
      ],
      whyReason: 'TOA: Tangent is Opposite over Adjacent.',
    },
    {
      prompt: 'Which ratio fraction defines Cosine θ?',
      options: [
        { text: 'Adjacent ÷ Hypotenuse', correct: true },
        { text: 'Opposite ÷ Hypotenuse', correct: false, tag: 'RATIO_WRONG_FN' },
        { text: 'Hypotenuse ÷ Adjacent', correct: false, tag: 'RATIO_INVERTED' },
        { text: 'Opposite ÷ Adjacent', correct: false },
      ],
      whyReason: 'CAH: Cosine is Adjacent over Hypotenuse.',
    },
    {
      prompt: 'In terms of Sine and Cosine, what does Tangent θ equal?',
      options: [
        { text: 'sin θ ÷ cos θ', correct: true },
        { text: 'cos θ ÷ sin θ', correct: false },
        { text: 'sin θ × cos θ', correct: false },
        { text: '1 ÷ (sin θ + cos θ)', correct: false },
      ],
      whyReason: 'tan θ = (Opp/Hyp) ÷ (Adj/Hyp) = Opp/Adj = sin θ / cos θ.',
    },
    {
      prompt: 'If a right triangle has Opposite = 3 and Hypotenuse = 5, what is sin θ?',
      options: [
        { text: '3/5', correct: true },
        { text: '4/5', correct: false },
        { text: '3/4', correct: false },
        { text: '5/3', correct: false },
      ],
      whyReason: 'sin θ = Opposite / Hypotenuse = 3 / 5.',
    },
  ],
  G3: [
    {
      prompt: 'What handheld sighting instrument is used by surveyors to measure the angle of elevation?',
      options: [
        { text: 'Clinometer', correct: true },
        { text: 'Barometer', correct: false },
        { text: 'Galvanometer', correct: false },
        { text: 'Hydrometer', correct: false },
      ],
      whyReason: 'A clinometer measures angles of elevation and depression relative to horizontal.',
    },
    {
      prompt: 'When looking UP at the tip of a lighthouse from the ground, the angle measured from the horizontal is the:',
      options: [
        { text: 'Angle of Elevation', correct: true },
        { text: 'Angle of Depression', correct: false },
        { text: 'Refraction Angle', correct: false },
        { text: 'Bearing Angle', correct: false },
      ],
      whyReason: 'Angles measured upward from the eye-level horizontal line of sight are angles of elevation.',
    },
    {
      prompt: 'A tree casts a 20m shadow when the sun elevation is 45°. How tall is the tree?',
      options: [
        { text: '20 m', correct: true },
        { text: '10 m', correct: false },
        { text: '20√3 m', correct: false },
        { text: '40 m', correct: false },
      ],
      whyReason: 'Since tan 45° = 1 = Height / Shadow, Height = 20 × 1 = 20 m.',
    },
    {
      prompt: 'A 10m ladder leans against a vertical wall making a 30° angle with the ground. How high up does it reach?',
      options: [
        { text: '5.0 m', correct: true },
        { text: '8.66 m', correct: false },
        { text: '10.0 m', correct: false },
        { text: '2.5 m', correct: false },
      ],
      whyReason: 'Height = 10 × sin 30° = 10 × 0.5 = 5.0 m.',
    },
    {
      prompt: 'When looking DOWN from the top of an observation tower at a car, the angle between the horizontal line of sight and the car is the:',
      options: [
        { text: 'Angle of Depression', correct: true },
        { text: 'Angle of Elevation', correct: false },
        { text: 'Normal Angle', correct: false },
        { text: 'Zenith Angle', correct: false },
      ],
      whyReason: 'Angles measured downward from the horizontal are angles of depression.',
    },
  ],
  G4: [
    {
      prompt: 'What is the exact value of sin 30°?',
      options: [
        { text: '1/2', correct: true },
        { text: '√3/2', correct: false, tag: 'SPECIAL_SWAP' },
        { text: '√2/2', correct: false },
        { text: '1', correct: false },
      ],
      whyReason: 'By the Root Pattern, sin 30° = √1/2 = 1/2.',
    },
    {
      prompt: 'What is the exact value of cos 45°?',
      options: [
        { text: '√2/2', correct: true },
        { text: '1/2', correct: false },
        { text: '√3/2', correct: false },
        { text: '0', correct: false },
      ],
      whyReason: 'A unit square diagonal cut gives cos 45° = 1/√2 = √2/2.',
    },
    {
      prompt: 'What is the exact value of tan 45°?',
      options: [
        { text: '1', correct: true },
        { text: '√3', correct: false },
        { text: '1/2', correct: false },
        { text: 'undefined', correct: false },
      ],
      whyReason: 'In a 45-45-90 isosceles triangle, Opposite = Adjacent, so Opp/Adj = 1.',
    },
    {
      prompt: 'What is the exact value of sin 60°?',
      options: [
        { text: '√3/2', correct: true },
        { text: '1/2', correct: false },
        { text: '√2/2', correct: false },
        { text: '√3', correct: false },
      ],
      whyReason: 'By the 30-60-90 triangle, sin 60° = √3/2.',
    },
    {
      prompt: 'What is the exact value of cos 60°?',
      options: [
        { text: '1/2', correct: true },
        { text: '√3/2', correct: false },
        { text: '√2/2', correct: false },
        { text: '0', correct: false },
      ],
      whyReason: 'cos 60° = sin(90° - 60°) = sin 30° = 1/2.',
    },
  ],
  G5: [
    {
      prompt: 'A student writes: "sin θ = Adjacent ÷ Hypotenuse". What is their error?',
      options: [
        { text: 'Swapped Sine with Cosine', correct: true },
        { text: 'Swapped Sine with Tangent', correct: false },
        { text: 'Inverted the fraction upside down', correct: false },
        { text: 'The statement is actually correct', correct: false },
      ],
      whyReason: 'Adjacent ÷ Hypotenuse is Cosine (CAH), whereas Sine is Opposite ÷ Hypotenuse (SOH).',
    },
    {
      prompt: 'A student calculates: 6 ÷ sin 30° = 6 × 0.5 = 3. What went wrong?',
      options: [
        { text: 'Multiplied instead of dividing by 0.5', correct: true },
        { text: 'sin 30° is not 0.5', correct: false },
        { text: '6 × 0.5 is not 3', correct: false },
        { text: 'Used degrees instead of radians', correct: false },
      ],
      whyReason: '6 ÷ 0.5 = 6 × 2 = 12. Dividing by a fraction means multiplying by its reciprocal!',
    },
    {
      prompt: 'Can sin θ ever equal 1.7 in a real Euclidean right triangle?',
      options: [
        { text: 'No, because the Opposite side cannot exceed the Hypotenuse', correct: true },
        { text: 'Yes, if the angle is very large', correct: false },
        { text: 'Yes, if the triangle is obtuse', correct: false },
        { text: 'Yes, whenever tan θ > 1', correct: false },
      ],
      whyReason: 'The hypotenuse is the longest side, so |sin θ| = |Opp/Hyp| can never exceed 1.',
    },
    {
      prompt: 'A student writes: "tan 90° = 0". What is the true value?',
      options: [
        { text: 'Undefined (division by zero)', correct: true },
        { text: '1', correct: false },
        { text: '-1', correct: false },
        { text: 'Infinity is a regular number', correct: false },
      ],
      whyReason: 'tan 90° = sin 90° / cos 90° = 1 / 0, which is undefined.',
    },
    {
      prompt: 'Is it true that sin(30° + 30°) = sin 30° + sin 30°?',
      options: [
        { text: 'No! sin 60° = √3/2, but 0.5 + 0.5 = 1', correct: true },
        { text: 'Yes, trig functions distribute over addition', correct: false },
        { text: 'Yes, because 30 + 30 = 60', correct: false },
        { text: 'Only true for 45° angles', correct: false },
      ],
      whyReason: 'Trig functions are non-linear; sin(A+B) = sin A cos B + cos A sin B.',
    },
  ],

  // --- LEVEL 2 GAMES ---
  G6: [
    {
      prompt: 'In Quadrant 2, what are the signs of (cos θ, sin θ)?',
      options: [
        { text: '(-, +)', correct: true },
        { text: '(+, +)', correct: false },
        { text: '(-, -)', correct: false },
        { text: '(+, -)', correct: false },
      ],
      whyReason: 'ASTC: In Quadrant 2, x (cosine) is negative, y (sine) is positive.',
    },
    {
      prompt: 'In which quadrant is Tangent positive while Cosine is negative?',
      options: [
        { text: 'Quadrant 3', correct: true },
        { text: 'Quadrant 1', correct: false },
        { text: 'Quadrant 2', correct: false },
        { text: 'Quadrant 4', correct: false },
      ],
      whyReason: 'In Q3, both x and y are negative, so tan = y/x is positive.',
    },
    {
      prompt: 'According to the ASTC rule, which ratio is positive in Quadrant 4?',
      options: [
        { text: 'Cosine', correct: true },
        { text: 'Sine', correct: false },
        { text: 'Tangent', correct: false },
        { text: 'All of them', correct: false },
      ],
      whyReason: 'ASTC: A (All in Q1), S (Sine in Q2), T (Tangent in Q3), C (Cosine in Q4).',
    },
    {
      prompt: 'If sin θ < 0 and cos θ > 0, which quadrant does θ belong to?',
      options: [
        { text: 'Quadrant 4', correct: true },
        { text: 'Quadrant 1', correct: false },
        { text: 'Quadrant 2', correct: false },
        { text: 'Quadrant 3', correct: false },
      ],
      whyReason: 'Positive x (cosine) and negative y (sine) places θ directly in Quadrant 4.',
    },
    {
      prompt: 'In Quadrant 2, what is the sign of tan θ?',
      options: [
        { text: 'Negative', correct: true },
        { text: 'Positive', correct: false },
        { text: 'Zero', correct: false },
        { text: 'Undefined', correct: false },
      ],
      whyReason: 'tan θ = sin θ / cos θ = (+) / (-) = negative.',
    },
  ],
  G7: [
    {
      prompt: 'On the unit circle (radius = 1), what do the coordinates (x, y) represent?',
      options: [
        { text: '(cos θ, sin θ)', correct: true },
        { text: '(sin θ, cos θ)', correct: false },
        { text: '(tan θ, 1)', correct: false },
        { text: '(1, tan θ)', correct: false },
      ],
      whyReason: 'By standard parametric definition, x = r cos θ = cos θ, and y = r sin θ = sin θ.',
    },
    {
      prompt: 'What are the Cartesian coordinates on the unit circle at angle θ = 90° (π/2)?',
      options: [
        { text: '(0, 1)', correct: true },
        { text: '(1, 0)', correct: false },
        { text: '(0, -1)', correct: false },
        { text: '(-1, 0)', correct: false },
      ],
      whyReason: 'At 90°, cos 90° = 0 and sin 90° = 1, giving (0, 1).',
    },
    {
      prompt: 'What is the reference angle for θ = 150° in Quadrant 2?',
      options: [
        { text: '30°', correct: true },
        { text: '60°', correct: false },
        { text: '45°', correct: false },
        { text: '150°', correct: false },
      ],
      whyReason: 'In Q2, the acute angle made with the x-axis is 180° - 150° = 30°.',
    },
    {
      prompt: 'What is the exact value of cos 180°?',
      options: [
        { text: '-1', correct: true },
        { text: '0', correct: false },
        { text: '1', correct: false },
        { text: '1/2', correct: false },
      ],
      whyReason: 'At 180°, the terminal ray points along the negative x-axis at (-1, 0).',
    },
    {
      prompt: 'What are the coordinates on the unit circle at angle θ = 0°?',
      options: [
        { text: '(1, 0)', correct: true },
        { text: '(0, 1)', correct: false },
        { text: '(-1, 0)', correct: false },
        { text: '(0, 0)', correct: false },
      ],
      whyReason: 'cos 0° = 1 and sin 0° = 0, giving the point (1, 0).',
    },
  ],
  G8: [
    {
      prompt: 'How many radians equal a complete half-turn straight angle (180°)?',
      options: [
        { text: 'π radians', correct: true },
        { text: '2π radians', correct: false },
        { text: 'π/2 radians', correct: false },
        { text: '3π/2 radians', correct: false },
      ],
      whyReason: 'A full circle 360° = 2π radians, so 180° = π radians.',
    },
    {
      prompt: 'Convert 90° into radian measure:',
      options: [
        { text: 'π/2', correct: true },
        { text: 'π/3', correct: false },
        { text: 'π/4', correct: false },
        { text: 'π/6', correct: false },
      ],
      whyReason: '90° × (π / 180°) = π/2.',
    },
    {
      prompt: 'Convert 60° into radian measure:',
      options: [
        { text: 'π/3', correct: true },
        { text: 'π/6', correct: false },
        { text: 'π/4', correct: false },
        { text: '2π/3', correct: false },
      ],
      whyReason: '60° × (π / 180°) = π/3.',
    },
    {
      prompt: 'What is the formula for arc length s of a circle with radius r and angle θ in radians?',
      options: [
        { text: 's = rθ', correct: true },
        { text: 's = 0.5 r² θ', correct: false },
        { text: 's = 2πr / θ', correct: false },
        { text: 's = r / θ', correct: false },
      ],
      whyReason: 'By the very definition of radian measure, arc length is simply s = r × θ.',
    },
    {
      prompt: 'Convert π/4 radians into degrees:',
      options: [
        { text: '45°', correct: true },
        { text: '30°', correct: false },
        { text: '60°', correct: false },
        { text: '90°', correct: false },
      ],
      whyReason: '(π/4) × (180° / π) = 180° / 4 = 45°.',
    },
  ],
  G9: [
    {
      prompt: 'Simplify the fundamental Pythagorean identity: sin²θ + cos²θ',
      options: [
        { text: '1', correct: true },
        { text: 'tan²θ', correct: false },
        { text: '0', correct: false },
        { text: '2', correct: false },
      ],
      whyReason: 'By the Pythagorean theorem on the unit circle, x² + y² = cos²θ + sin²θ = 1.',
    },
    {
      prompt: 'Which expression is identically equal to 1 + tan²θ?',
      options: [
        { text: 'sec²θ', correct: true },
        { text: 'csc²θ', correct: false },
        { text: 'cot²θ', correct: false },
        { text: 'cos²θ', correct: false },
      ],
      whyReason: 'Dividing sin²θ + cos²θ = 1 by cos²θ produces tan²θ + 1 = sec²θ.',
    },
    {
      prompt: 'Simplify: (sin θ) × (csc θ)',
      options: [
        { text: '1', correct: true },
        { text: 'tan θ', correct: false },
        { text: 'cos θ', correct: false },
        { text: 'sin²θ', correct: false },
      ],
      whyReason: 'Since csc θ = 1 / sin θ, sin θ × (1 / sin θ) = 1.',
    },
    {
      prompt: 'Simplify: (cos θ) × (tan θ)',
      options: [
        { text: 'sin θ', correct: true },
        { text: 'cos²θ', correct: false },
        { text: '1', correct: false },
        { text: 'sec θ', correct: false },
      ],
      whyReason: 'cos θ × (sin θ / cos θ) = sin θ.',
    },
    {
      prompt: 'Which identity is equivalent to 1 - cos²θ?',
      options: [
        { text: 'sin²θ', correct: true },
        { text: '-sin²θ', correct: false },
        { text: 'tan²θ', correct: false },
        { text: 'sec²θ', correct: false },
      ],
      whyReason: 'Rearranging sin²θ + cos²θ = 1 gives sin²θ = 1 - cos²θ.',
    },
  ],

  // --- LEVEL 3 GAMES ---
  G10: [
    {
      prompt: 'To verify (1 - sin²θ) / cos θ = cos θ, which initial substitution is correct?',
      options: [
        { text: 'Replace (1 - sin²θ) with cos²θ', correct: true },
        { text: 'Replace cos θ with sin θ', correct: false },
        { text: 'Cancel out the sin² with cos', correct: false },
        { text: 'Cross multiply across an equals sign', correct: false },
      ],
      whyReason: 'Using the identity 1 - sin²θ = cos²θ gives cos²θ / cos θ = cos θ.',
    },
    {
      prompt: 'Expand and simplify: (sin θ + cos θ)² - 2 sin θ cos θ',
      options: [
        { text: '1', correct: true },
        { text: '0', correct: false },
        { text: '2', correct: false },
        { text: 'sin²θ - cos²θ', correct: false },
      ],
      whyReason: 'sin²θ + 2 sin θ cos θ + cos²θ - 2 sin θ cos θ = sin²θ + cos²θ = 1.',
    },
    {
      prompt: 'Which algebraic identity simplifies (sec θ - 1)(sec θ + 1)?',
      options: [
        { text: 'tan²θ', correct: true },
        { text: 'cot²θ', correct: false },
        { text: '1', correct: false },
        { text: 'cos²θ', correct: false },
      ],
      whyReason: 'Difference of squares: sec²θ - 1 = tan²θ.',
    },
    {
      prompt: 'When proving trigonometric identities, what is the safest methodology?',
      options: [
        { text: 'Work on one side (LHS or RHS) independently until it matches the other', correct: true },
        { text: 'Assume both sides are equal and cross multiply', correct: false },
        { text: 'Square both sides of the unproven statement', correct: false },
        { text: 'Plug in only θ = 0° and stop', correct: false },
      ],
      whyReason: 'Manipulating one side without assuming equality avoids circular reasoning.',
    },
    {
      prompt: 'Simplify: tan θ + cot θ in terms of sin and cos:',
      options: [
        { text: '1 ÷ (sin θ cos θ)', correct: true },
        { text: 'sin θ + cos θ', correct: false },
        { text: '1', correct: false },
        { text: 'tan²θ', correct: false },
      ],
      whyReason: 'sin/cos + cos/sin = (sin² + cos²) / (sin cos) = 1 / (sin cos).',
    },
  ],
  G11: [
    {
      prompt: 'For the general wave model y = A sin(B(x - C)) + D, what does |A| represent?',
      options: [
        { text: 'Amplitude (peak excursion from midline)', correct: true },
        { text: 'Period duration', correct: false },
        { text: 'Horizontal phase shift', correct: false },
        { text: 'Midline vertical offset', correct: false },
      ],
      whyReason: '|A| scales the vertical oscillation height above and below the center midline.',
    },
    {
      prompt: 'What is the period of the sinusoidal function y = sin(2x)?',
      options: [
        { text: 'π', correct: true },
        { text: '2π', correct: false },
        { text: '4π', correct: false },
        { text: 'π/2', correct: false },
      ],
      whyReason: 'Period = 2π / B = 2π / 2 = π.',
    },
    {
      prompt: 'In the graph y = 3 sin(x) + 5, what is the horizontal midline equilibrium equation?',
      options: [
        { text: 'y = 5', correct: true },
        { text: 'y = 3', correct: false },
        { text: 'y = 0', correct: false },
        { text: 'y = 8', correct: false },
      ],
      whyReason: 'The vertical shift D = +5 raises the center of oscillation to y = 5.',
    },
    {
      prompt: 'What is the natural fundamental period of y = cos x?',
      options: [
        { text: '2π radians (360°)', correct: true },
        { text: 'π radians (180°)', correct: false },
        { text: '4π radians (720°)', correct: false },
        { text: 'π/2 radians (90°)', correct: false },
      ],
      whyReason: 'A full cycle of cos x repeats every 2π radians.',
    },
    {
      prompt: 'What is the maximum value reached by the function y = -4 cos(x) + 7?',
      options: [
        { text: '11', correct: true },
        { text: '7', correct: false },
        { text: '3', correct: false },
        { text: '4', correct: false },
      ],
      whyReason: 'Maximum = midline + |amplitude| = 7 + 4 = 11.',
    },
  ],
  G12: [
    {
      prompt: 'Which formula states the Law of Sines for any non-right triangle ABC?',
      options: [
        { text: 'a / sin A = b / sin B = c / sin C', correct: true },
        { text: 'a sin A = b sin B = c sin C', correct: false },
        { text: 'c² = a² + b² - 2ab cos C', correct: false },
        { text: 'tan A / a = tan B / b', correct: false },
      ],
      whyReason: 'The ratio of each side length to the sine of its opposing angle is constant.',
    },
    {
      prompt: 'Which formula states the Law of Cosines to solve for side c?',
      options: [
        { text: 'c² = a² + b² - 2ab cos C', correct: true },
        { text: 'c² = a² + b² + 2ab cos C', correct: false },
        { text: 'c = a + b - 2ab cos C', correct: false },
        { text: 'c² = a² - b² - 2ab sin C', correct: false },
      ],
      whyReason: 'c² = a² + b² - 2ab cos C generalizes the Pythagorean theorem for non-right angles.',
    },
    {
      prompt: 'When you are given two sides and the included angle (SAS), which law should you use first?',
      options: [
        { text: 'Law of Cosines', correct: true },
        { text: 'Law of Sines', correct: false },
        { text: 'Pythagorean Theorem directly', correct: false },
        { text: 'Tangents Rule only', correct: false },
      ],
      whyReason: 'With SAS, the third side can be calculated immediately using the Law of Cosines.',
    },
    {
      prompt: 'In the ambiguous SSA (Side-Side-Angle) condition, how many triangles can theoretically exist?',
      options: [
        { text: '0, 1, or 2 triangles', correct: true },
        { text: 'Always exactly 1 triangle', correct: false },
        { text: 'Always exactly 2 triangles', correct: false },
        { text: 'Infinite triangles', correct: false },
      ],
      whyReason: 'Depending on whether the swinging side reaches the base, it can form 0, 1, or 2 distinct triangles.',
    },
    {
      prompt: 'When you know two angles and one side (ASA or AAS), which law finds the other sides fastest?',
      options: [
        { text: 'Law of Sines', correct: true },
        { text: 'Law of Cosines', correct: false },
        { text: 'Heron\'s formula', correct: false },
        { text: 'Compound angle theorem', correct: false },
      ],
      whyReason: 'With known angles, setting up the Sine ratio is direct and linear.',
    },
  ],
  G13: [
    {
      prompt: 'Solve 2 sin x - 1 = 0 for x in the interval [0, 2π):',
      options: [
        { text: 'π/6 and 5π/6', correct: true },
        { text: 'π/3 and 2π/3', correct: false },
        { text: 'π/4 and 3π/4', correct: false },
        { text: 'π/6 and 7π/6', correct: false },
      ],
      whyReason: 'sin x = 1/2. In [0, 2π), sine is positive in Q1 (π/6) and Q2 (π - π/6 = 5π/6).',
    },
    {
      prompt: 'Solve cos x = 0 for x in [0, 2π):',
      options: [
        { text: 'π/2 and 3π/2', correct: true },
        { text: '0 and π', correct: false },
        { text: 'π/4 and 7π/4', correct: false },
        { text: 'π/3 and 5π/3', correct: false },
      ],
      whyReason: 'Cosine represents x-coordinates, which vanish at the top (π/2) and bottom (3π/2) of the unit circle.',
    },
    {
      prompt: 'Can the equation cos x = 2.5 have any real solutions?',
      options: [
        { text: 'No, because the range of cos x is strictly [-1, 1]', correct: true },
        { text: 'Yes, in Quadrant 1', correct: false },
        { text: 'Yes, if x is a large angle', correct: false },
        { text: 'Yes, at x = 2.5π', correct: false },
      ],
      whyReason: 'Real cosine values never fall outside the interval [-1, 1].',
    },
    {
      prompt: 'How many solutions exist for sin x = 0 in the domain [0, 2π)?',
      options: [
        { text: '2 solutions (0 and π)', correct: true },
        { text: '1 solution', correct: false },
        { text: '3 solutions', correct: false },
        { text: '4 solutions', correct: false },
      ],
      whyReason: 'In [0, 2π), sin(0) = 0 and sin(π) = 0. Notice 2π is excluded by the half-open interval.',
    },
    {
      prompt: 'Solve tan x = 1 for x in [0, π):',
      options: [
        { text: 'π/4', correct: true },
        { text: '3π/4', correct: false },
        { text: 'π/2', correct: false },
        { text: 'π/3', correct: false },
      ],
      whyReason: 'tan x = 1 at 45°, which is π/4 radians.',
    },
  ],
  G14: [
    {
      prompt: 'What is the compound angle identity for sin(A + B)?',
      options: [
        { text: 'sin A cos B + cos A sin B', correct: true },
        { text: 'sin A cos B - cos A sin B', correct: false },
        { text: 'cos A cos B - sin A sin B', correct: false },
        { text: 'sin A sin B + cos A cos B', correct: false },
      ],
      whyReason: 'The Sine addition formula alternates terms with a plus sign: sin A cos B + cos A sin B.',
    },
    {
      prompt: 'What is the compound angle identity for cos(A + B)?',
      options: [
        { text: 'cos A cos B - sin A sin B', correct: true },
        { text: 'cos A cos B + sin A sin B', correct: false },
        { text: 'sin A cos B + cos A sin B', correct: false },
        { text: 'sin A cos B - cos A sin B', correct: false },
      ],
      whyReason: 'The Cosine addition formula pairs cosines and sines with an opposite minus sign.',
    },
    {
      prompt: 'To compute the exact surd value of sin 75°, which standard angle split is ideal?',
      options: [
        { text: '45° + 30°', correct: true },
        { text: '60° + 15°', correct: false },
        { text: '50° + 25°', correct: false },
        { text: '90° - 15°', correct: false },
      ],
      whyReason: 'Both 45° and 30° are standard special angles with known exact surds.',
    },
    {
      prompt: 'What is the exact value of sin 75° = sin(45° + 30°)?',
      options: [
        { text: '(√6 + √2) / 4', correct: true },
        { text: '(√6 - √2) / 4', correct: false },
        { text: '(√3 + 1) / 2', correct: false },
        { text: '√2 / 4', correct: false },
      ],
      whyReason: 'sin 45° cos 30° + cos 45° sin 30° = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4.',
    },
    {
      prompt: 'What is the double angle identity for sin(2θ)?',
      options: [
        { text: '2 sin θ cos θ', correct: true },
        { text: 'sin²θ - cos²θ', correct: false },
        { text: '2 sin θ', correct: false },
        { text: 'cos²θ - sin²θ', correct: false },
      ],
      whyReason: 'sin(θ + θ) = sin θ cos θ + cos θ sin θ = 2 sin θ cos θ.',
    },
  ],
};

export const Practice: React.FC = () => {
  const { state, dispatch } = useApp();
  const { level, activeGameId } = state.nav;

  // Active game run state
  const [inGameRun, setInGameRun] = useState(false);
  const [activeRunItems, setActiveRunItems] = useState<PracticeItem[]>([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [runScore, setRunScore] = useState(0);

  // Available games in this level
  const games = Object.values(GAMES_REGISTRY).filter(g => g.level === level);
  const currentGame = activeGameId ? GAMES_REGISTRY[activeGameId] : null;

  // Boss unlock criteria: >= 4 games lit in this level
  const litCount = games.filter(g => !!state.progress.gamesLit[g.id]).length;
  const isBossUnlocked = litCount >= 4 || !!state.progress.bossPassed[level];

  const currentPool = (currentGame && sampleItems[currentGame.id]) || sampleItems['G1'];
  const activeItem = activeRunItems[itemIndex] || activeRunItems[0] || currentPool[0];

  const handleStartGame = (gameId: string) => {
    sound.click();
    dispatch({ type: 'NAVIGATE', payload: { activeGameId: gameId } });
    const pool = sampleItems[gameId] || sampleItems['G1'];
    // Randomize question sequence and randomize the options within every single question dynamically
    const prepared = shuffleArray(pool).map(item => ({
      ...item,
      options: shuffleArray(item.options),
    }));
    setActiveRunItems(prepared);
    setInGameRun(true);
    setItemIndex(0);
    setSelectedIdx(null);
    setShowFeedback(false);
    setRunScore(0);
  };

  const handleSelectOption = (idx: number) => {
    if (showFeedback || !activeItem) return;
    setSelectedIdx(idx);
    setShowFeedback(true);

    const isCorrect = activeItem.options[idx].correct;
    if (isCorrect) {
      sound.correct();
      setRunScore(prev => prev + 1);
      dispatch({
        type: 'RECORD_ANSWER',
        payload: {
          skillId: (currentGame?.skills[0] || 'E1') as any,
          correct: true,
          attemptCount: 1,
          tag: null,
        },
      });
    } else {
      sound.wrong();
      dispatch({
        type: 'RECORD_ANSWER',
        payload: {
          skillId: (currentGame?.skills[0] || 'E1') as any,
          correct: false,
          attemptCount: 1,
          tag: activeItem.options[idx].tag || 'RATIO_WRONG_FN',
        },
      });
    }
  };

  const handleNextItem = () => {
    sound.click();
    setSelectedIdx(null);
    setShowFeedback(false);

    if (itemIndex >= activeRunItems.length - 1 || itemIndex >= 4) {
      // Completed game run!
      if (currentGame) {
        sound.fanfare();
        dispatch({ type: 'LIGHT_GAME', payload: currentGame.id });
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      }
      setInGameRun(false);
    } else {
      setItemIndex(prev => prev + 1);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      {/* --- CONSTELLATION HUB OVERVIEW --- */}
      {!inGameRun && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="side-pill side-pill-adj">Practice Hub</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '4px 0 0 0' }}>
                Level {level} Constellation of Stars
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                Light at least 4 game stars to awaken the Boss Encounter! ({litCount} of {games.length} stars lit)
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Theo mood="idle" size={70} />
              <div
                style={{
                  background: 'var(--surface-inset)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                }}
              >
                ✨ <strong>Theo Recommends: </strong>
                {games[0]?.name || 'Side Sniper'}
              </div>
            </div>
          </div>

          {/* Star Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {games.map(g => {
              const isLit = !!state.progress.gamesLit[g.id];
              return (
                <div
                  key={g.id}
                  className="trig-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: `4px solid ${isLit ? 'var(--color-sunlight)' : 'var(--card-border)'}`,
                    background: isLit ? 'rgba(255,201,51,0.06)' : 'var(--card-bg)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="side-pill side-pill-hyp" style={{ fontSize: '0.75rem' }}>
                        {g.id}
                      </span>
                      <span style={{ fontSize: '1.3rem' }}>{isLit ? '⭐ Lit' : '✧ Dim'}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', margin: '4px 0 6px 0', fontSize: '1.2rem' }}>
                      {g.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.35, margin: 0 }}>
                      {g.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={`trig-btn ${isLit ? 'trig-btn-secondary' : 'trig-btn-coral'}`}
                    style={{ marginTop: '16px', width: '100%' }}
                    onClick={() => handleStartGame(g.id)}
                  >
                    {isLit ? 'Replay Star' : 'Play Star ➔'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* The Central Radiant Boss Star */}
          <div
            className="trig-card"
            style={{
              padding: '24px',
              textAlign: 'center',
              border: isBossUnlocked ? '2px solid var(--color-sunlight)' : '1px solid var(--card-border)',
              background: isBossUnlocked ? 'rgba(255,201,51,0.1)' : 'var(--surface-inset)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
              {isBossUnlocked ? '🌟' : '🔒'}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0 0 6px 0' }}>
              Boss Encounter: {level === 1 ? 'The Pyramid Vault' : level === 2 ? 'The Observatory Lock' : 'The Final Build'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 16px auto' }}>
              {isBossUnlocked
                ? 'The celestial constellation is fully aligned! Face the 8 security locks to claim your Master Surveyor Stamp.'
                : `Light at least 4 game stars across Level ${level} to unlock the climactic Boss challenge.`}
            </p>

            <button
              type="button"
              className="trig-btn trig-btn-coral"
              disabled={!isBossUnlocked}
              style={{ opacity: isBossUnlocked ? 1 : 0.4, cursor: isBossUnlocked ? 'pointer' : 'not-allowed' }}
              onClick={() => dispatch({ type: 'SET_PHASE', payload: 'boss' })}
            >
              Enter Boss Encounter ➔
            </button>
          </div>
        </div>
      )}

      {/* --- IN-GAME RUNNER --- */}
      {inGameRun && currentGame && (
        <div className="trig-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="side-pill side-pill-hyp">Game: {currentGame.name}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                Question {itemIndex + 1} of {Math.min(5, activeRunItems.length || 5)} · Score: {runScore}
              </span>
            </div>
            <button
              type="button"
              className="trig-btn trig-btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              onClick={() => setInGameRun(false)}
            >
              Quit to Hub
            </button>
          </div>

          <div
            style={{
              background: 'var(--surface-inset)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0 0 16px 0' }}>
              {activeItem.prompt}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '540px', margin: '0 auto' }}>
              {activeItem.options.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                let bg = 'var(--surface-card)';
                let color = 'var(--text-main)';

                if (showFeedback) {
                  if (opt.correct) {
                    bg = 'var(--color-success)';
                    color = '#ffffff';
                  } else if (isSelected) {
                    bg = 'var(--color-error)';
                    color = '#ffffff';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className="trig-btn"
                    style={{
                      background: bg,
                      color,
                      padding: '12px 18px',
                      fontSize: '1rem',
                      justifyContent: 'flex-start',
                      border: '1px solid var(--card-border)',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => handleSelectOption(idx)}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: showFeedback && (opt.correct || isSelected) ? 'rgba(255,255,255,0.25)' : 'var(--surface-inset)',
                        color: showFeedback && (opt.correct || isSelected) ? '#ffffff' : 'var(--brand-mint-dark)',
                        fontWeight: '700',
                        marginRight: '12px',
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {showFeedback && (
            <div
              className="trig-card"
              style={{
                padding: '14px 18px',
                borderLeft: `4px solid ${activeItem.options[selectedIdx!]?.correct ? 'var(--color-success)' : 'var(--color-error)'}`,
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{activeItem.options[selectedIdx!]?.correct ? '✔ Correct!' : '💡 Targeted Nudge: '}</strong>
                <span>{activeItem.whyReason}</span>
              </div>
              <button type="button" className="trig-btn trig-btn-primary" onClick={handleNextItem}>
                {itemIndex >= Math.min(4, (activeRunItems.length || 5) - 1) ? 'Finish Run ➔' : 'Next Question ➔'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
