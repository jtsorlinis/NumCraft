import { attemptToShareRow } from '../game/share';
import type { ExactSolution } from '../game/solver';
import type { AttemptOutcome } from '../game/types';

interface ResultModalProps {
  open: boolean;
  isFinished: boolean;
  attempts: AttemptOutcome[];
  bestScore: number | null;
  bestSolution: ExactSolution | null;
  puzzleNumber: number;
  isPractice: boolean;
  shareText: string;
  onClose: () => void;
  onCopyShare: () => void;
}

export const ResultModal = ({
  open,
  isFinished,
  attempts,
  bestScore,
  bestSolution,
  puzzleNumber,
  isPractice,
  shareText,
  onClose,
  onCopyShare
}: ResultModalProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>{bestScore === null ? 'Daily Result: Fail' : `Best Score: ${bestScore} nums`}</h2>
        <p>
          {isPractice ? `Practice #${puzzleNumber}` : `NumCraft #${puzzleNumber}`}
        </p>

        <div className="modal-rows">
          {attempts.map((attempt, index) => (
            <div key={`${attempt.status}-${index}`}>{attemptToShareRow(attempt)}</div>
          ))}
        </div>

        {isFinished && bestSolution ? (
          <div className="solution-card">
            <p className="eyebrow">Best Known Solution</p>
            <p className="solution-expression">{bestSolution.expression.replace(/\*/g, '×')}</p>
            <p className="modal-note">{bestSolution.numbersUsed} numbers used</p>
          </div>
        ) : null}

        <pre className="share-block">{shareText}</pre>

        <div className="action-row">
          <button type="button" className="primary-btn" onClick={onCopyShare}>
            Copy Share
          </button>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="modal-note">
          {isPractice ? 'Try another ?practice=seed value.' : 'Come back tomorrow for a new puzzle.'}
        </p>
      </div>
    </div>
  );
};
