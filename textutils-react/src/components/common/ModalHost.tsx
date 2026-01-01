import { useAppModal } from "../../context/AppModalContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function ModalHost() {
  const { modalType, modalData, closeModal } =
    useAppModal();

  if (modalType !== "confirm-delete") return null;

  return (
    <ConfirmDeleteModal
      message={modalData!.message}
      onConfirm={modalData!.onConfirm}
      onClose={closeModal}
    />
  );
}
