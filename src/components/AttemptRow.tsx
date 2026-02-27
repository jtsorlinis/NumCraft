import { attemptToShareRow } from '../game/share';
import type { AttemptOutcome } from '../game/types';

interface AttemptRowProps {
  attempt: AttemptOutcome;
  index: number;
}

export const AttemptRow = ({ attempt, index }: AttemptRowProps): JSX.Element => {
  const row = attemptToShareRow(attempt);
  const score = attempt.score ?? Math.max(1, attempt.operatorCount + 1);

  return (
    <li className="attempt-row">
      <span>Attempt {index + 1}</span>
      <span className="attempt-status">
        {attempt.status === 'exact' ? `${score} nums` : 'Fail'}
      </span>
      <span className="attempt-emoji" aria-label="attempt result">
        {row}
      </span>
    </li>
  );
};
