import type { AttemptOutcome } from './types';

export const attemptToShareRow = (attempt: AttemptOutcome): string => {
  if (attempt.status === 'exact') {
    const score = attempt.score ?? Math.max(1, attempt.operatorCount + 1);
    return '🟩'.repeat(Math.max(1, score));
  }

  return '⬛';
};

export const buildShareText = (puzzleNumber: number, attempts: AttemptOutcome[]): string => {
  const rows = attempts.slice(0, 1).map(attemptToShareRow);
  return [`NumCraft #${puzzleNumber}`, ...rows].join('\n');
};
