import { describe, expect, it } from 'vitest';
import { createDailyPuzzleForDate, createPracticePuzzle, getTodayDailyPuzzle } from '../src/game/puzzle';
import { hasExactSolutionForEveryNumberCount } from '../src/game/solver';

describe('daily puzzles', () => {
  it('returns the same puzzle for the same Melbourne date', () => {
    const fromLocalOffset = getTodayDailyPuzzle(new Date('2026-02-01T00:10:00+11:00'));
    const fromUtcInstant = getTodayDailyPuzzle(new Date('2026-01-31T13:10:00Z'));

    expect(fromLocalOffset).toEqual(fromUtcInstant);
  });

  it('returns different puzzles for different dates', () => {
    const puzzleA = createDailyPuzzleForDate('2026-02-01');
    const puzzleB = createDailyPuzzleForDate('2026-02-02');

    expect(puzzleA.seed).not.toBe(puzzleB.seed);
    expect({ target: puzzleA.target, numbers: puzzleA.numbers }).not.toEqual({
      target: puzzleB.target,
      numbers: puzzleB.numbers
    });
  });

  it('ensures daily puzzles have exact solutions using 3 to 6 numbers', () => {
    const start = new Date('2026-01-01T00:00:00Z');

    for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + dayOffset);
      const dateKey = date.toISOString().slice(0, 10);
      const puzzle = createDailyPuzzleForDate(dateKey);

      expect(hasExactSolutionForEveryNumberCount(puzzle.numbers, puzzle.target, 3, 6)).toBe(true);
    }
  });

  it('ensures practice puzzles have exact solutions using 3 to 6 numbers', () => {
    for (const seed of ['default', 'alpha', 'beta', 'gamma', 'delta']) {
      const puzzle = createPracticePuzzle(seed);
      expect(hasExactSolutionForEveryNumberCount(puzzle.numbers, puzzle.target, 3, 6)).toBe(true);
    }
  });
});
