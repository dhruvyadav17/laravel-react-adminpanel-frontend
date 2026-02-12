import { useState } from "react";
import { useAppModal } from "../../context/AppModalContext";
import CrudModal from "./CrudModal";

export default function ModalHost() {
  const { modalType, modalData, closeModal } =
    useAppModal();

  const [loading, setLoading] =
    useState(false);

  if (!modalType || !modalData)
    return null;

  switch (modalType) {
    /* ===================================================== */
    /* ================= CONFIRM DELETE ==================== */
    /* ===================================================== */

    case "confirm-delete": {
      // TypeScript now safely narrows modalData
      const {
        message,
        confirmLabel,
        onConfirm,
      } = modalData;

      return (
        <CrudModal
          title="Confirm Action"
          saveText={
            confirmLabel ?? "Delete"
          }
          saveVariant="danger"
          loading={loading}
          onClose={closeModal}
          onSave={async () => {
            try {
              setLoading(true);
              await onConfirm();
              closeModal();
            } finally {
              setLoading(false);
            }
          }}
        >
          <p className="text-danger mb-0">
            {message}
          </p>
        </CrudModal>
      );
    }

    /* ===================================================== */
    /* ================= DEFAULT =========================== */
    /* ===================================================== */

    default:
      return null;
  }
}
