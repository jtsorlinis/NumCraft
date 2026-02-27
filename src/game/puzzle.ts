import { generatePuzzle } from './generator';
import { createSeededRng, hashStringToSeed } from './seed';
import { getPuzzleNumberForDate, getMelbourneDateString } from './timezone';
import type { DailyPuzzle } from './types';

export const PUZZLE_VERSION = 'v1';
export const PUZZLE_EPOCH = '2026-01-01';

export const buildDailySeed = (dateKey: string): string => {
  return `numcraft|${dateKey}|${PUZZLE_VERSION}`;
};

export const createDailyPuzzleForDate = (dateKey: string): DailyPuzzle => {
  const puzzleNumber = getPuzzleNumberForDate(dateKey, PUZZLE_EPOCH);
  const seed = buildDailySeed(dateKey);
  const rng = createSeededRng(seed);
  const id = `daily:${puzzleNumber}`;

  return generatePuzzle(rng, seed, puzzleNumber, dateKey, false, id);
};

export const getTodayDailyPuzzle = (now: Date = new Date()): DailyPuzzle => {
  const dateKey = getMelbourneDateString(now);
  return createDailyPuzzleForDate(dateKey);
};

export const createPracticePuzzle = (practiceSeed: string): DailyPuzzle => {
  const normalized = practiceSeed.trim() || 'default';
  const dateKey = `practice:${normalized}`;
  const seed = `numcraft|practice|${normalized}|${PUZZLE_VERSION}`;
  const rng = createSeededRng(seed);
  const rawNumber = hashStringToSeed(seed) % 100000;
  const puzzleNumber = rawNumber;
  const id = `practice:${normalized}`;

  return generatePuzzle(rng, seed, puzzleNumber, dateKey, true, id);
};
