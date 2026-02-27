import type { AttemptOutcome } from '../game/types';
import { AttemptRow } from './AttemptRow';

interface AttemptListProps {
  attempts: AttemptOutcome[];
}

export const AttemptList = ({ attempts }: AttemptListProps): JSX.Element => {
  return (
    <section className="panel">
      <p className="eyebrow">Attempts</p>
      {attempts.length === 0 ? (
        <p className="empty-text">No submitted attempts yet.</p>
      ) : (
        <ul className="attempt-list">
          {attempts.map((attempt, index) => (
            <AttemptRow key={`${attempt.status}-${index}`} attempt={attempt} index={index} />
          ))}
        </ul>
      )}
    </section>
  );
};
