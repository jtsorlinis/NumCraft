import { attemptToShareRow } from './share';
import type { DailyHistoryEntry, DailyProgress, GameStats } from './types';

export const createEmptyStats = (): GameStats => ({
  version: 1,
  totalPlayed: 0,
  totalWins: 0,
  currentStreak: 0,
  maxStreak: 0,
  averageBestScore: 0,
  winScoreSum: 0,
  history: []
});

export const createHistoryEntry = (progress: DailyProgress): DailyHistoryEntry => {
  const rows = progress.attempts.map(attemptToShareRow);
  const won = progress.bestScore !== null;

  return {
    puzzleNumber: progress.puzzleNumber,
    dateKey: progress.dateKey,
    rows,
    bestScore: progress.bestScore,
    won
  };
};

export const applyFinishedDayToStats = (stats: GameStats, entry: DailyHistoryEntry): GameStats => {
  const alreadyRecorded = stats.history.some((item) => item.puzzleNumber === entry.puzzleNumber);
  if (alreadyRecorded) {
    return stats;
  }

  const won = entry.won;
  const totalPlayed = stats.totalPlayed + 1;
  const totalWins = stats.totalWins + (won ? 1 : 0);
  const winScoreSum = stats.winScoreSum + (won ? (entry.bestScore ?? 0) : 0);

  let currentStreak = stats.currentStreak;
  if (won) {
    const isConsecutiveDay =
      stats.lastPlayedPuzzle !== undefined && entry.puzzleNumber === stats.lastPlayedPuzzle + 1;

    if (stats.lastPlayedWon && isConsecutiveDay) {
      currentStreak = stats.currentStreak + 1;
    } else {
      currentStreak = 1;
    }
  } else {
    currentStreak = 0;
  }

  const maxStreak = Math.max(stats.maxStreak, currentStreak);
  const averageBestScore = totalWins === 0 ? 0 : winScoreSum / totalWins;

  return {
    ...stats,
    totalPlayed,
    totalWins,
    currentStreak,
    maxStreak,
    averageBestScore,
    winScoreSum,
    lastPlayedPuzzle: entry.puzzleNumber,
    lastPlayedWon: won,
    history: [...stats.history, entry]
  };
};
