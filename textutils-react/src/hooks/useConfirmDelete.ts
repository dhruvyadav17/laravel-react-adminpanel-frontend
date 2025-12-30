import { useAppModal } from "../context/AppModalContext";

export function useConfirmDelete() {
  const { openModal, closeModal } = useAppModal<any>();

  return (message: string, onConfirm: () => Promise<void>) => {
    openModal("confirm-delete", {
      message,
      onConfirm: async () => {
        await onConfirm();
        closeModal();
      },
    });
  };
}
