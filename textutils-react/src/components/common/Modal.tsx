import Button from "./Button";

export default function Modal({
  title,
  children,
  onClose,
  onSave,
  saveDisabled,
  button_name,
}: any) {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{title}</h5>
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={onClose}
            />

            {onSave && (
              <Button
                label={button_name || "Save"}
                onClick={onSave}
                loading={saveDisabled}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
