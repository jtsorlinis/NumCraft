interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export const HelpModal = ({
  open,
  onClose,
}: HelpModalProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>How to Play</h2>
        <p className="modal-note">
          Build an expression with the six number tiles and operators to hit the
          target exactly.
        </p>

        <ul className="help-list">
          <li>Use each number tile at most once.</li>
          <li>You have one submitted attempt per puzzle.</li>
          <li>
            Every puzzle has exact solutions using 3, 4, 5, and 6 numbers.
          </li>
        </ul>
        <br />

        <div className="action-row">
          <button type="button" className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
