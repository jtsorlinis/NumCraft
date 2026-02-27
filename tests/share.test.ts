import { describe, expect, it } from 'vitest';
import { attemptToShareRow, buildShareText } from '../src/game/share';
import type { AttemptOutcome } from '../src/game/types';

describe('share formatting', () => {
  it('contains only puzzle id and emoji rows', () => {
    const attempts: AttemptOutcome[] = [
      { status: 'exact', expression: '100 * 9 + 25', value: 925, operatorCount: 2, score: 3 },
      { status: 'exact', expression: '(75 + 25) * 9', value: 900, operatorCount: 2, score: 3 },
      { status: 'fail', expression: '100 + 25', value: 125, operatorCount: 1, score: null }
    ];

    const share = buildShareText(54, attempts);

    expect(share).toBe('NumCraft #54\n🟩🟩🟩');
    expect(share).not.toContain('100');
    expect(share).not.toContain('*');
    expect(share).not.toContain('925');
  });

  it('uses numbers-used count for fail rows', () => {
    const attempt: AttemptOutcome = {
      status: 'fail',
      expression: '10 + 5 - 2',
      value: 13,
      operatorCount: 2,
      score: null
    };

    expect(attemptToShareRow(attempt)).toBe('⬛⬛⬛');
  });
});
