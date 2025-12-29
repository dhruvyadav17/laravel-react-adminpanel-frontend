import { useState } from "react";
import ConfirmModal from "../components/common/ConfirmModal";

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<() => void>(() => {});

  const confirm = (fn: () => void) => {
    setAction(() => fn);
    setOpen(true);
  };

  const ConfirmUI = open ? (
    <ConfirmModal
      message="Are you sure you want to continue?"
      onClose={() => setOpen(false)}
      onConfirm={() => {
        action();
        setOpen(false);
      }}
    />
  ) : null;

  return { confirm, ConfirmUI };
}
