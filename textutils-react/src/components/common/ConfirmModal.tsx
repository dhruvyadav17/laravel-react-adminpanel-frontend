type Props = {
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  title = "Confirm Action",
  message,
  confirmText = "Delete",
  onConfirm,
  onClose,
}: Props) {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{title}</h5>
          </div>

          <div className="modal-body">
            <p>{message}</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
