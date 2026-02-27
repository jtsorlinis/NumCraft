import type { GameStats } from '../game/types';

interface StatsModalProps {
  open: boolean;
  isPractice: boolean;
  stats: GameStats;
  onClose: () => void;
}

export const StatsModal = ({ open, isPractice, stats, onClose }: StatsModalProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  const recentHistory = stats.history.slice(-7).reverse();

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Stats</h2>
        {isPractice ? <p className="modal-note">Practice mode does not change daily stats.</p> : null}

        <ul className="stats-list">
          <li>Total played: {stats.totalPlayed}</li>
          <li>Total wins: {stats.totalWins}</li>
          <li>Current streak: {stats.currentStreak}</li>
          <li>Max streak: {stats.maxStreak}</li>
          <li>Avg best score (wins): {stats.averageBestScore.toFixed(2)}</li>
        </ul>

        {recentHistory.length > 0 ? (
          <section className="history-block">
            <p className="eyebrow">Recent</p>
            <ul className="history-list">
              {recentHistory.map((entry) => (
                <li key={`${entry.dateKey}-${entry.puzzleNumber}`}>
                  #{entry.puzzleNumber} {entry.rows.join(' ')}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="action-row">
          <button type="button" className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
