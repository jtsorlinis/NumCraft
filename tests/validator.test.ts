import { describe, expect, it } from 'vitest';
import type { DailyPuzzle } from '../src/game/types';
import { validateExpression } from '../src/game/validator';

const basePuzzle: DailyPuzzle = {
  id: 'test',
  puzzleNumber: 1,
  dateKey: '2026-01-01',
  seed: 'test',
  target: 12,
  numbers: [10, 5, 4, 2, 1, 8],
  isPractice: false
};

describe('validator', () => {
  it('rejects non-integer division', () => {
    const result = validateExpression('5 / 2 + 8', basePuzzle);

    expect(result.isValidExpression).toBe(false);
    expect(result.consumesAttempt).toBe(false);
    expect(result.errorCode).toBe('NON_INTEGER_DIVISION');
  });

  it('rejects neutral operations', () => {
    const result = validateExpression('10 * 1 + 2', basePuzzle);

    expect(result.isValidExpression).toBe(false);
    expect(result.consumesAttempt).toBe(false);
    expect(result.errorCode).toBe('NEUTRAL_OPERATION');
  });

  it('enforces number usage counts', () => {
    const result = validateExpression('2 + 2 + 8', basePuzzle);

    expect(result.isValidExpression).toBe(false);
    expect(result.errorCode).toBe('NUMBER_USED_TOO_MANY_TIMES');
  });

  it('returns numbers-used score for an exact expression', () => {
    const puzzle: DailyPuzzle = {
      ...basePuzzle,
      target: 925,
      numbers: [100, 25, 9, 8, 7, 3]
    };

    const result = validateExpression('100 * 9 + 25', puzzle);

    expect(result.isValidExpression).toBe(true);
    expect(result.isExact).toBe(true);
    expect(result.consumesAttempt).toBe(true);
    expect(result.operatorCount).toBe(2);
    expect(result.numbersUsedCount).toBe(3);
    expect(result.score).toBe(3);
  });
});
