import { useAppModal } from "../context/AppModalContext";

export function useConfirmDelete() {
  const { openModal } = useAppModal();

  return (message: string, onConfirm: () => Promise<void>) => {
    openModal("confirm-delete", {
      message,
      onConfirm,
    });
  };
}
