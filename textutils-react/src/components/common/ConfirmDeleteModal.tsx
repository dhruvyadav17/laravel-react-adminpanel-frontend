import { useState } from "react";
import Modal from "./Modal";

type Props = {
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  confirmLabel?: string;
};

export default function ConfirmDeleteModal({
  message,
  onConfirm,
  onClose,
  confirmLabel = "Delete",
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Confirm Action"
      onClose={onClose}
      onSave={handleConfirm}
      saveText={confirmLabel}
      saveVariant="danger"
      saveDisabled={loading}
      disableClose={loading}
      size="sm"
    >
      <p className="text-danger mb-0">{message}</p>
    </Modal>
  );
}
