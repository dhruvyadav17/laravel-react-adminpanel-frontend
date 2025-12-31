import { useState } from "react";
import Modal from "./Modal";
import { handleApiError } from "../../utils/toastHelper";

type Props = {
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export default function ConfirmDeleteModal({
  message,
  onConfirm,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose(); // ✅ close ONLY on success
    } catch (e) {
      handleApiError(e); // ❌ modal stays open
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Confirm Delete"
      onClose={onClose}
      onSave={handleConfirm}
      saveDisabled={loading}
      button_name={loading ? "Deleting..." : "Delete"}
      disableClose={loading}
    >
      <p className="text-danger mb-0">{message}</p>
    </Modal>
  );
}
