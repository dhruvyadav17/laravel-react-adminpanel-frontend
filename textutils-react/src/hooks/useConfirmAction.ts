import { useAppModal } from "../context/AppModalContext";

type ConfirmOptions = {
  message: string;
  onConfirm: () => Promise<void>;
  confirmLabel?: string;
};

export function useConfirmAction() {
  const { openModal } = useAppModal();

  return ({ message, onConfirm, confirmLabel }: ConfirmOptions) => {
    openModal("confirm-delete", {
      message,
      onConfirm,
      confirmLabel,
    });
  };
}
