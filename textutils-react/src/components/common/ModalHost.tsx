import { useState } from "react";
import { useAppModal } from "../../context/AppModalContext";
import CrudModal from "./CrudModal";

export default function ModalHost() {
  const { modalType, modalData, closeModal } = useAppModal();
  const [loading, setLoading] = useState(false);

  if (!modalType) return null;

  switch (modalType) {
    case "confirm-delete":
      return (
        <CrudModal
          title="Confirm Action"
          saveText={modalData.confirmLabel ?? "Delete"}
          saveVariant="danger"
          loading={loading}
          onClose={closeModal}
          onSave={async () => {
            try {
              setLoading(true);
              await modalData.onConfirm();
              closeModal();
            } finally {
              setLoading(false);
            }
          }}
        >
          <p className="text-danger mb-0">
            {modalData.message}
          </p>
        </CrudModal>
      );

    default:
      return null;
  }
}
