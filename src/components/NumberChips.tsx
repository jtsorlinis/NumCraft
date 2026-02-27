interface NumberChipsProps {
  numbers: number[];
  usedIndices: Set<number>;
  disabled: boolean;
  canSelectNumber: boolean;
  onSelect: (index: number, value: number) => void;
}

export const NumberChips = ({
  numbers,
  usedIndices,
  disabled,
  canSelectNumber,
  onSelect
}: NumberChipsProps): JSX.Element => {
  return (
    <div className="keyboard-row keyboard-row-numbers">
      {numbers.map((number, index) => (
        <button
          type="button"
          key={`${number}-${index}`}
          className={`chip ${usedIndices.has(index) ? 'chip-used' : ''}`}
          onClick={() => onSelect(index, number)}
          disabled={disabled || usedIndices.has(index) || !canSelectNumber}
        >
          {number}
        </button>
      ))}
    </div>
  );
};
