import type { ExactSolution } from "../game/solver";
import type { AttemptOutcome } from "../game/types";

interface ResultModalProps {
  open: boolean;
  isFinished: boolean;
  isTestMode: boolean;
  bestScore: number | null;
  latestAttempt: AttemptOutcome | null;
  solutions: ExactSolution[];
  puzzleNumber: number;
  isPractice: boolean;
  onClose: () => void;
  onShare: () => void;
  onNextPuzzle: () => void;
}

export const ResultModal = ({
  open,
  isFinished,
  isTestMode,
  bestScore,
  latestAttempt,
  solutions,
  puzzleNumber,
  isPractice,
  onClose,
  onShare,
  onNextPuzzle,
}: ResultModalProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  const formatExpression = (expression: string): string => {
    return expression.replace(/\*/g, "×").replace(/\//g, "÷");
  };

  const otherSolutions = solutions;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>
          {bestScore === null
            ? "Daily Result: Fail"
            : `Best Score: ${bestScore} nums`}
        </h2>
        <p>
          {isPractice
            ? `Practice #${puzzleNumber}`
            : `NumCraft #${puzzleNumber}`}
        </p>

        {isFinished && otherSolutions.length > 0 ? (
          <>
            {latestAttempt ? (
              <div
                className={
                  latestAttempt.status === "exact"
                    ? "solution-card solution-card-your solution-card-your-exact"
                    : "solution-card solution-card-your solution-card-your-fail"
                }
              >
                <p className="solution-label-your">Your Solution</p>
                <p className="solution-expression solution-expression-your">
                  {formatExpression(latestAttempt.expression)}
                </p>
              </div>
            ) : null}

            <div className="solution-card">
              <p className="eyebrow">Other Solutions</p>
              <ul className="solution-list">
                {otherSolutions.map((solution, index) => (
                  <li
                    key={`${solution.numbersUsed}-${index}`}
                    className="solution-item"
                  >
                    <p className="solution-expression">
                      {formatExpression(solution.expression)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}

        <div className="action-row result-actions">
          <button type="button" className="primary-btn" onClick={onShare}>
            Share
          </button>
          {isTestMode ? (
            <button type="button" className="ghost-btn" onClick={onNextPuzzle}>
              New Puzzle
            </button>
          ) : (
            <button type="button" className="ghost-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>

        {!isTestMode && (
          <p className="modal-note">Come back tomorrow for a new puzzle.</p>
        )}
      </div>
    </div>
  );
};
