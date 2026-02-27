import { randomInt, type RNG } from './seed';
import { hasExactSolutionForEveryNumberCount } from './solver';
import type { DailyPuzzle } from './types';

const LARGE_POOL = [25, 50, 75, 100] as const;
const SMALL_MIN = 1;
const SMALL_MAX = 10;
const REQUIRED_MIN_NUMBERS_USED = 3;
const REQUIRED_MAX_NUMBERS_USED = 6;

const generateNumbers = (rng: RNG): number[] => {
  const largeCount = randomInt(rng, 0, 4);
  const availableLarge = [...LARGE_POOL];
  const selected: number[] = [];

  for (let i = 0; i < largeCount; i += 1) {
    const index = randomInt(rng, 0, availableLarge.length - 1);
    selected.push(availableLarge[index]);
    availableLarge.splice(index, 1);
  }

  while (selected.length < 6) {
    selected.push(randomInt(rng, SMALL_MIN, SMALL_MAX));
  }

  return selected;
};

const fallbackPuzzle = (
  seed: string,
  puzzleNumber: number,
  dateKey: string,
  isPractice: boolean,
  id: string
): DailyPuzzle => {
  return {
    id,
    puzzleNumber,
    dateKey,
    seed,
    isPractice,
    // 15 can be made exactly with 3, 4, 5, and 6 numbers from this set.
    numbers: [1, 2, 3, 4, 5, 6],
    target: 15
  };
};

export const generatePuzzle = (
  rng: RNG,
  seed: string,
  puzzleNumber: number,
  dateKey: string,
  isPractice: boolean,
  id: string
): DailyPuzzle => {
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const numbers = generateNumbers(rng);
    const target = randomInt(rng, 100, 999);

    if (
      !hasExactSolutionForEveryNumberCount(
        numbers,
        target,
        REQUIRED_MIN_NUMBERS_USED,
        REQUIRED_MAX_NUMBERS_USED
      )
    ) {
      continue;
    }

    return {
      id,
      puzzleNumber,
      dateKey,
      seed,
      isPractice,
      target,
      numbers
    };
  }

  return fallbackPuzzle(seed, puzzleNumber, dateKey, isPractice, id);
};
