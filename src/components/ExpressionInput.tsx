import { FormEvent } from 'react';

interface ExpressionInputProps {
  disabled: boolean;
  canInsertOperator: boolean;
  canInsertLeftParen: boolean;
  canInsertRightParen: boolean;
  canBackspace: boolean;
  onSubmit: () => void;
  onInsertOperator: (operator: '+' | '-' | '*' | '/') => void;
  onInsertLeftParen: () => void;
  onInsertRightParen: () => void;
  onBackspace: () => void;
}

const OPERATORS: Array<{ value: '+' | '-' | '*' | '/'; label: string }> = [
  { value: '+', label: '+' },
  { value: '-', label: '-' },
  { value: '*', label: '×' },
  { value: '/', label: '÷' }
];

export const ExpressionInput = ({
  disabled,
  canInsertOperator,
  canInsertLeftParen,
  canInsertRightParen,
  canBackspace,
  onSubmit,
  onInsertOperator,
  onInsertLeftParen,
  onInsertRightParen,
  onBackspace
}: ExpressionInputProps): JSX.Element => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="keyboard-form" onSubmit={handleSubmit}>
      <div className="keyboard-row keyboard-row-operators">
        {OPERATORS.map((operator) => (
          <button
            key={operator.value}
            type="button"
            className="operator-btn operator-btn-symbol"
            onClick={() => onInsertOperator(operator.value)}
            disabled={disabled || !canInsertOperator}
          >
            {operator.label}
          </button>
        ))}
        <button
          type="button"
          className="operator-btn"
          onClick={onInsertLeftParen}
          disabled={disabled || !canInsertLeftParen}
        >
          (
        </button>
        <button
          type="button"
          className="operator-btn"
          onClick={onInsertRightParen}
          disabled={disabled || !canInsertRightParen}
        >
          )
        </button>
      </div>

      <div className="keyboard-row keyboard-row-actions">
        <button type="submit" className="primary-btn" disabled={disabled}>
          Submit
        </button>
        <button
          type="button"
          className="ghost-btn"
          onClick={onBackspace}
          disabled={disabled || !canBackspace}
        >
          Backspace
        </button>
      </div>
    </form>
  );
};
