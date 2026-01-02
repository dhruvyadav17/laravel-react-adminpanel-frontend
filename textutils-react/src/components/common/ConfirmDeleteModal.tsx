import { useState } from "react";
import Modal from "./Modal";

type Props = {
  message: string;                 // 🔥 one-line message only
  onConfirm: () => Promise<void>;  // async safe
  onClose: () => void;
  confirmLabel?: string;
};

export default function ConfirmDeleteModal({
  message,
  onConfirm,
  onClose,
  confirmLabel = "Delete", // default
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
      saveDisabled={loading}
      button_name={loading ? "Deleting..." : "Delete"}
      dialogClassName="modal-sm"
      disableClose={loading}
    >
      {/* 🔥 RULE: ONE SENTENCE, CLEAR CONSEQUENCE */}
      <p className="text-danger mb-0">
        {message}
      </p>
    </Modal>
  );
}
