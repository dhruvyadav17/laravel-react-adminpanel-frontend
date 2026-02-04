import { useConfirmAction } from "./useConfirmAction";

/**
 * @deprecated
 * Use `useConfirmAction` instead.
 *
 * Kept for backward compatibility.
 */
export function useConfirmDelete() {
  const confirm = useConfirmAction();

  return (
    message: string,
    onConfirm: () => Promise<void>,
    confirmLabel?: string
  ) => {
    confirm({
      message,
      onConfirm,
      confirmLabel,
    });
  };
}
