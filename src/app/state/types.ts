// src/app/state/types.ts
import type { LevelId, PhaseId, SkillId } from '../../content/types';

export interface RootState {
  nav: {
    level: LevelId;
    phase: PhaseId;
    stationId: string;
    storyPanelIndex: number;
    activeGameId: string | null;
    view: 'trailhead' | 'main' | 'vault' | 'report' | 'calculator' | 'finale';
  };
  progress: {
    stationsDone: Record<string, boolean>;
    gamesLit: Record<string, boolean>;
    bossPassed: Record<LevelId, boolean>;
    levelUnlocked: Record<LevelId, boolean>;
  };
  mastery: Record<string, {
    m: number;
    attempts: number;
    lastSeen: number;
    misconceptions: Record<string, number>;
  }>;
  game: {
    sp: number;
    streak: number;
    maxStreak: number;
    stamps: Record<LevelId, 'none' | 'bronze' | 'silver' | 'gold'>;
    badges: string[];
    instruments: ('clinometer' | 'compass' | 'theodolite')[];
  };
  settings: {
    audio: boolean;
    captions: boolean;
    calmMode: boolean;
    notation: 'cosec' | 'csc';
  };
}

export type AppAction =
  | { type: 'NAVIGATE'; payload: Partial<RootState['nav']> }
  | { type: 'SET_LEVEL'; payload: LevelId }
  | { type: 'SET_PHASE'; payload: PhaseId }
  | { type: 'COMPLETE_STATION'; payload: string }
  | { type: 'LIGHT_GAME'; payload: string }
  | { type: 'PASS_BOSS'; payload: LevelId }
  | { type: 'RECORD_ANSWER'; payload: { skillId: SkillId; correct: boolean; attemptCount: number; tag: string | null } }
  | { type: 'AWARD_BADGE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<RootState['settings']> }
  | { type: 'RESET_PROGRESS' };
