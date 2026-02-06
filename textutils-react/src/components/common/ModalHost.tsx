import { useAppModal } from "../../context/AppModalContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function ModalHost() {
  const { modalType, modalData, closeModal } = useAppModal();

  if (!modalType) return null;

  switch (modalType) {
    case "confirm-delete":
      return (
        <ConfirmDeleteModal
          message={modalData.message}
          onConfirm={modalData.onConfirm}
          confirmLabel={modalData.confirmLabel}
          onClose={closeModal}
        />
      );

    default:
      return null;
  }
}
