import { describe, expect, it } from 'vitest';
import {
  hasExactSolutionForEveryNumberCount,
  hasExactSolutionUsingNumberCount
} from '../src/game/solver';

describe('solver number-count checks', () => {
  it('detects exact solutions for specific numbers-used counts', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const target = 15;

    expect(hasExactSolutionUsingNumberCount(numbers, target, 3)).toBe(true);
    expect(hasExactSolutionUsingNumberCount(numbers, target, 4)).toBe(true);
    expect(hasExactSolutionUsingNumberCount(numbers, target, 5)).toBe(true);
    expect(hasExactSolutionUsingNumberCount(numbers, target, 6)).toBe(true);
    expect(hasExactSolutionUsingNumberCount(numbers, target, 1)).toBe(false);
  });

  it('requires every count in the requested range to be solvable', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const target = 15;

    expect(hasExactSolutionForEveryNumberCount(numbers, target, 3, 6)).toBe(true);
    expect(hasExactSolutionForEveryNumberCount(numbers, target, 1, 6)).toBe(false);
  });
});
