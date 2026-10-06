// src/content/types.ts
export type LevelId = 1 | 2 | 3;
export type PhaseId = 'wonder' | 'story' | 'simulate' | 'practice' | 'boss';
export type SkillId =
  | 'E0' | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'E7' | 'E8' | 'E9'
  | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8' | 'M9' | 'M10' | 'M11' | 'M12' | 'M13'
  | 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'H7' | 'H8' | 'H9' | 'H10' | 'H11' | 'H12';

export interface SkillDefinition {
  id: SkillId;
  level: LevelId;
  title: string;
  isCore: boolean;
  formulas: string[];
  description: string;
  prerequisites: SkillId[];
  misconceptions: string[];
  trickId?: string;
}

export interface SpeedTrick {
  id: string;
  title: string;
  unlocksSkill: SkillId;
  technique: string;
  whyItWorks: string;
  isVedic?: boolean;
}

export interface StoryPanel {
  id: string;
  level: LevelId;
  panelNumber: number;
  title: string;
  setting: string;
  artPrompt: string;
  displayText: string;
  spokenText: string;
  image?: string;
  audio?: string;
}

export interface StationTestOption {
  label: string;
  correct: boolean;
  explanation?: string;
}

export interface StationDefinition {
  id: string; // '1A', '1B', etc.
  shortTitle?: string; // friendly short name, e.g. 'Shadows', 'Ratios'
  level: LevelId;
  title: string;
  subtitle: string;
  skills: SkillId[];
  predictPrompt?: string;
  predictOptions?: string[];
  predictCorrectIdx?: number;
  predictExplanation?: string;
  testPrompt?: string;
  testOptions?: StationTestOption[];
  exploreGuide: string;
  formalizeFormula: string;
  formalizeRule: string;
}

export interface GameDefinition {
  id: string; // 'G1', 'G2', etc.
  name: string;
  level: LevelId;
  skills: SkillId[];
  tagline: string;
  description: string;
  runLength: number;
  litThreshold: number; // 0.70
  calmSupported: boolean;
}
