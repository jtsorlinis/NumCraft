import { PuzzleHeader } from "./PuzzleHeader";

interface SubmitConfirmModalProps {
  open: boolean;
  target: number;
  currentValue: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmitConfirmModal = ({
  open,
  target,
  currentValue,
  onConfirm,
  onCancel,
}: SubmitConfirmModalProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Submit This Attempt?</h2>
        <p className="modal-note">
          Your expression does not match the target and will use your attempt.
        </p>

        <PuzzleHeader target={target} currentValue={currentValue} />
        <br />
        <div className="action-row result-actions">
          <button type="button" className="primary-btn" onClick={onConfirm}>
            Submit Anyway
          </button>
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
