// src/app/state/AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { RootState, AppAction } from './types';
import { calculateMasteryDelta, INITIAL_MASTERY } from '../../engine/mastery';
import { calculateSP } from '../../engine/scoring';

const STORAGE_KEY = 'sky_surveyors_trigonometry_state_v1';

const defaultState: RootState = {
  nav: {
    level: 1,
    phase: 'wonder',
    stationId: '1A',
    storyPanelIndex: 0,
    activeGameId: null,
    view: 'main',
  },
  progress: {
    stationsDone: {},
    gamesLit: {},
    bossPassed: { 1: false, 2: false, 3: false },
    levelUnlocked: { 1: true, 2: false, 3: false },
  },
  mastery: {
    E0: { m: 0.5, attempts: 2, lastSeen: Date.now(), misconceptions: {} },
    E1: { m: INITIAL_MASTERY, attempts: 0, lastSeen: Date.now(), misconceptions: {} },
    E2: { m: INITIAL_MASTERY, attempts: 0, lastSeen: Date.now(), misconceptions: {} },
  },
  game: {
    sp: 0,
    streak: 0,
    maxStreak: 0,
    stamps: { 1: 'none', 2: 'none', 3: 'none' },
    badges: [],
    instruments: ['clinometer'],
  },
  settings: {
    audio: true,
    captions: true,
    calmMode: false,
    notation: 'cosec',
  },
};

function loadState(): RootState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

function appReducer(state: RootState, action: AppAction): RootState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        nav: { ...state.nav, ...action.payload },
      };

    case 'SET_LEVEL':
      return {
        ...state,
        nav: {
          ...state.nav,
          level: action.payload,
          phase: 'wonder',
          stationId: action.payload === 1 ? '1A' : action.payload === 2 ? '2A' : '3A',
          storyPanelIndex: 0,
          activeGameId: null,
          view: 'main',
        },
      };

    case 'SET_PHASE':
      return {
        ...state,
        nav: { ...state.nav, phase: action.payload, activeGameId: null },
      };

    case 'COMPLETE_STATION':
      return {
        ...state,
        progress: {
          ...state.progress,
          stationsDone: { ...state.progress.stationsDone, [action.payload]: true },
        },
        game: {
          ...state.game,
          sp: state.game.sp + 25,
        },
      };

    case 'LIGHT_GAME':
      return {
        ...state,
        progress: {
          ...state.progress,
          gamesLit: { ...state.progress.gamesLit, [action.payload]: true },
        },
      };

    case 'PASS_BOSS': {
      const nextLevel = (action.payload + 1) as 1 | 2 | 3;
      const levelUnlocked = { ...state.progress.levelUnlocked };
      if (nextLevel <= 3) {
        levelUnlocked[nextLevel] = true;
      }

      const instruments = [...state.game.instruments];
      if (action.payload === 1 && !instruments.includes('compass')) instruments.push('compass');
      if (action.payload === 2 && !instruments.includes('theodolite')) instruments.push('theodolite');

      return {
        ...state,
        progress: {
          ...state.progress,
          bossPassed: { ...state.progress.bossPassed, [action.payload]: true },
          levelUnlocked,
        },
        game: {
          ...state.game,
          sp: state.game.sp + 100,
          instruments,
          stamps: {
            ...state.game.stamps,
            [action.payload]: 'silver',
          },
        },
      };
    }

    case 'RECORD_ANSWER': {
      const { skillId, correct, attemptCount, tag } = action.payload;
      const currSkill = state.mastery[skillId] || {
        m: INITIAL_MASTERY,
        attempts: 0,
        lastSeen: Date.now(),
        misconceptions: {},
      };

      const newM = calculateMasteryDelta(currSkill.m, correct, attemptCount);
      const newAttempts = currSkill.attempts + 1;
      const newMisconceptions = { ...currSkill.misconceptions };
      if (tag) {
        newMisconceptions[tag] = (newMisconceptions[tag] || 0) + 1;
      }

      const newStreak = correct ? state.game.streak + 1 : 0;
      const maxStreak = Math.max(state.game.maxStreak, newStreak);
      const { sp } = calculateSP({ attemptNumber: attemptCount, streak: newStreak });

      return {
        ...state,
        mastery: {
          ...state.mastery,
          [skillId]: {
            m: newM,
            attempts: newAttempts,
            lastSeen: Date.now(),
            misconceptions: newMisconceptions,
          },
        },
        game: {
          ...state.game,
          sp: state.game.sp + sp,
          streak: newStreak,
          maxStreak,
        },
      };
    }

    case 'AWARD_BADGE':
      if (state.game.badges.includes(action.payload)) return state;
      return {
        ...state,
        game: {
          ...state.game,
          badges: [...state.game.badges, action.payload],
          sp: state.game.sp + 50,
        },
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'RESET_PROGRESS':
      return defaultState;

    default:
      return state;
  }
}

interface AppContextValue {
  state: RootState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [state]);

  // Synchronize CSS Level Token
  useEffect(() => {
    document.documentElement.setAttribute('data-level', String(state.nav.level));
  }, [state.nav.level]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
