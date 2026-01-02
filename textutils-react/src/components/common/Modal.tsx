import { useEffect } from "react";
import Button from "./Button";

type Props = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;

  saveText?: string;
  cancelText?: string;

  saveVariant?: "primary" | "success" | "danger";
  loading?: boolean;
  disableClose?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function Modal({
  title,
  children,
  onClose,
  onSave,
  saveText = "Save",
  cancelText = "Cancel",
  saveVariant = "primary",
  loading = false,
  disableClose = false,
  size = "md",
}: Props) {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const sizeClass =
    size === "sm"
      ? "modal-sm"
      : size === "lg"
      ? "modal-lg"
      : "";

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block">
        <div className={`modal-dialog modal-dialog-centered ${sizeClass}`}>
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              {!disableClose && (
                <button className="close" onClick={onClose}>
                  ×
                </button>
              )}
            </div>

            {/* BODY */}
            <div className="modal-body">{children}</div>

            {/* FOOTER */}
            <div className="modal-footer">
              <Button
                label={cancelText}
                variant="secondary"
                onClick={onClose}
                disabled={disableClose}
              />

              {onSave && (
                <Button
                  label={saveText}
                  variant={saveVariant}
                  onClick={onSave}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
