import Button from "./Button";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;
  saveDisabled?: boolean;
  button_name?: string;

  // 🔥 dynamic width support
  dialogClassName?: string; // e.g. "modal-lg" | "modal-xl"
};

export default function Modal({
  title,
  children,
  onClose,
  onSave,
  saveDisabled,
  button_name,
  dialogClassName,
}: ModalProps) {
  return (
    <div className="modal show d-block" role="dialog">
      <div
        className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${
          dialogClassName || ""
        }`}
      >
        <div className="modal-content shadow">
          {/* ===== HEADER ===== */}
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* ===== BODY ===== */}
          <div className="modal-body px-4">{children}</div>

          {/* ===== FOOTER ===== */}
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
