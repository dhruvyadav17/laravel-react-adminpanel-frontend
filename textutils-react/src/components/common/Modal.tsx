type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;
  saveDisabled?: boolean;
  button_name?: string;
};

export default function Modal({
  title,
  children,
  onClose,
  onSave,
  saveDisabled,
  button_name,
}: ModalProps) {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{title}</h5>
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            {onSave && (
              <button
                className="btn btn-primary"
                onClick={onSave}
                disabled={saveDisabled}
              >
                {button_name || "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
