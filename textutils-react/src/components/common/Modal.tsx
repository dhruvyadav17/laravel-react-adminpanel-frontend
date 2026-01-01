import { useEffect } from "react";
import Button from "./Button";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;

  onSave?: () => void;
  saveDisabled?: boolean;
  button_name?: string;

  dialogClassName?: string;
  disableClose?: boolean;
};

export default function Modal({
  title,
  children,
  onClose,
  onSave,
  saveDisabled = false,
  button_name = "Save",
  dialogClassName = "",
  disableClose = false,
}: ModalProps) {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show" />

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`modal-dialog modal-dialog-centered ${dialogClassName}`}
          role="document"
        >
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>

              {!disableClose && (
                <button
                  type="button"
                  className="close"
                  onClick={onClose}
                >
                  <span>&times;</span>
                </button>
              )}
            </div>

            {/* BODY */}
            <div className="modal-body">
              {children}
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <Button
                label="Cancel"
                variant="secondary"
                onClick={onClose}
                disabled={disableClose}
              />

              {onSave && (
                <Button
                  label={button_name}
                  variant="danger"
                  onClick={onSave}
                  loading={saveDisabled}
                  disabled={disableClose}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
