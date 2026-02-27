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

  const getRankTrophy = (index: number): string | null => {
    if (index === 0) {
      return "🥇";
    }
    if (index === 1) {
      return "🥈";
    }
    if (index === 2) {
      return "🥉";
    }
    if (index === 3) {
      return "🥄";
    }
    return null;
  };

  const otherSolutions = solutions;
  const getYourSolutionIcon = (): string | null => {
    if (!latestAttempt) {
      return null;
    }

    if (latestAttempt.status !== "exact") {
      return "❌";
    }

    const numbersUsed = Math.max(1, latestAttempt.operatorCount + 1);
    const rankIndex = otherSolutions.findIndex(
      (solution) => solution.numbersUsed === numbersUsed,
    );
    if (rankIndex < 0) {
      return "✅";
    }

    return getRankTrophy(rankIndex);
  };
  const yourSolutionIcon = getYourSolutionIcon();

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
                <div className="solution-your-head">
                  <p className="solution-label-your">Your Solution</p>
                  {yourSolutionIcon ? (
                    <span className="solution-your-icon" aria-hidden="true">
                      {yourSolutionIcon}
                    </span>
                  ) : null}
                </div>
                <p className="solution-expression solution-expression-your">
                  {formatExpression(latestAttempt.expression)}
                </p>
              </div>
            ) : null}

            <div className="solution-card">
              <p className="eyebrow">Other Solutions</p>
              <ul className="solution-list">
                {otherSolutions.map((solution, index) => {
                  const trophy = getRankTrophy(index);
                  return (
                    <li
                      key={`${solution.numbersUsed}-${index}`}
                      className="solution-item"
                    >
                      <p className="solution-expression solution-expression-ranked">
                        {trophy ? (
                          <span className="solution-trophy" aria-hidden="true">
                            {trophy}
                          </span>
                        ) : null}
                        <span>{formatExpression(solution.expression)}</span>
                      </p>
                    </li>
                  );
                })}
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
