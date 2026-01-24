import { useEffect } from "react";
import Button from "./Button";
import { ICONS } from "../../constants/icons";

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
    size === "sm" ? "modal-sm" : size === "lg" ? "modal-lg" : "";

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show d-block">
        <div className={`modal-dialog modal-dialog-centered ${sizeClass}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              {!disableClose && (
                <button className="close" onClick={onClose}>
                  ×
                </button>
              )}
            </div>

            <div className="modal-body">{children}</div>

            <div className="modal-footer justify-content-between">
              <Button
                label={cancelText}
                variant="secondary"
                onClick={onClose}
                disabled={disableClose}
              />

              {onSave && (
                <Button
                  label={saveText}
                  icon={ICONS.SAVE}
                  variant={saveVariant}
                  loading={loading}
                  onClick={onSave}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
