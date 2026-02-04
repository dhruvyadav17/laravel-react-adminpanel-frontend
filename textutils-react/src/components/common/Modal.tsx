import { useEffect } from "react";
import Button from "./Button";
import { ICONS } from "../../constants/icons";

type Props = {
  title: string;
  children: React.ReactNode;

  onClose: () => void;

  /* primary action */
  onSave?: () => void;
  saveText?: string;
  saveVariant?: "primary" | "success" | "danger";

  /* secondary */
  cancelText?: string;

  /* state */
  loading?: boolean;
  disableClose?: boolean;

  /* layout */
  size?: "sm" | "md" | "lg";

  /* advanced */
  footer?: React.ReactNode; // 🔥 custom footer override
};

export default function Modal({
  title,
  children,
  onClose,

  onSave,
  saveText = "Save",
  saveVariant = "primary",
  cancelText = "Cancel",

  loading = false,
  disableClose = false,

  size = "md",
  footer,
}: Props) {
  /* ================= BODY LOCK ================= */
  useEffect(() => {
    document.body.classList.add("modal-open");

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !disableClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onEsc);
    };
  }, [disableClose, onClose]);

  const sizeClass =
    size === "sm" ? "modal-sm" : size === "lg" ? "modal-lg" : "";

  /* ================= RENDER ================= */
  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show" />

      {/* MODAL */}
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`modal-dialog modal-dialog-centered ${sizeClass}`}
          onClick={(e) => e.stopPropagation()}
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
                  aria-label="Close"
                >
                  ×
                </button>
              )}
            </div>

            {/* BODY */}
            <div className="modal-body">{children}</div>

            {/* FOOTER */}
            <div className="modal-footer justify-content-between">
              {footer ? (
                footer
              ) : (
                <>
                  <Button
                    label={cancelText}
                    variant="secondary"
                    onClick={onClose}
                    disabled={disableClose || loading}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
