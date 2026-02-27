interface PuzzleHeaderProps {
  target: number;
  currentValue: number | null;
}

const getDistanceColor = (target: number, currentValue: number | null): string => {
  if (currentValue === null) {
    return 'var(--muted)';
  }

  const distance = Math.abs(target - currentValue);
  if (distance === 0) {
    return '#1e9f5c';
  }

  const closeThreshold = Math.max(10, Math.round(target * 0.1));
  if (distance <= closeThreshold) {
    return '#c9a227';
  }

  return '#cc3b3b';
};

export const PuzzleHeader = ({ target, currentValue }: PuzzleHeaderProps): JSX.Element => {
  const currentColor = getDistanceColor(target, currentValue);

  return (
    <section className="panel puzzle-header">
      <div className="target-values">
        <div className="target-block">
          <p className="eyebrow">Target</p>
          <p className="target">{target}</p>
        </div>
        <div className="target-block target-block-right">
          <p className="eyebrow">Current</p>
          <p className="target" style={{ color: currentColor }}>
            {currentValue ?? '—'}
          </p>
        </div>
      </div>
    </section>
  );
};
