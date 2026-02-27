import type { AttemptOutcome } from './types';

const getNumbersUsed = (attempt: AttemptOutcome): number => {
  return Math.max(1, attempt.operatorCount + 1);
};

export const attemptToShareRow = (attempt: AttemptOutcome): string => {
  const count = getNumbersUsed(attempt);
  const square = attempt.status === 'exact' ? '🟩' : '⬛';
  return square.repeat(count);
};

export const buildShareText = (puzzleNumber: number, attempts: AttemptOutcome[]): string => {
  const rows = attempts.slice(0, 1).map(attemptToShareRow);
  return [`NumCraft #${puzzleNumber}`, ...rows].join('\n');
};
