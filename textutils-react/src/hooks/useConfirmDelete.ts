import { useAppModal } from "../context/AppModalContext";

type ConfirmPayload = {
  message: string;
  onConfirm: () => Promise<void>;
};

export function useConfirmDelete() {
  const { openModal } = useAppModal();

  return (message: string, onConfirm: () => Promise<void>) => {
    openModal("confirm-delete", {
      message,
      onConfirm,
    } as ConfirmPayload);
  };
}
