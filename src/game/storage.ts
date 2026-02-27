import { createEmptyStats } from './stats';
import type { DailyProgress, GameStats } from './types';

const STORAGE_PREFIX = 'numcraft:v1';
const STATS_KEY = `${STORAGE_PREFIX}:stats`;
const THEME_KEY = `${STORAGE_PREFIX}:theme`;

const progressKey = (puzzleId: string): string => `${STORAGE_PREFIX}:daily:${puzzleId}`;

const safeParse = <T>(raw: string | null): T | null => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const loadDailyProgress = (puzzleId: string): DailyProgress | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return safeParse<DailyProgress>(localStorage.getItem(progressKey(puzzleId)));
};

export const saveDailyProgress = (progress: DailyProgress): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(progressKey(progress.puzzleId), JSON.stringify(progress));
};

export const loadStats = (): GameStats => {
  if (typeof localStorage === 'undefined') {
    return createEmptyStats();
  }

  const parsed = safeParse<GameStats>(localStorage.getItem(STATS_KEY));
  if (!parsed || parsed.version !== 1) {
    return createEmptyStats();
  }

  return {
    ...createEmptyStats(),
    ...parsed
  };
};

export const saveStats = (stats: GameStats): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const loadTheme = (): 'light' | 'dark' => {
  if (typeof localStorage === 'undefined') {
    return 'light';
  }

  const value = localStorage.getItem(THEME_KEY);
  return value === 'dark' ? 'dark' : 'light';
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(THEME_KEY, theme);
};
