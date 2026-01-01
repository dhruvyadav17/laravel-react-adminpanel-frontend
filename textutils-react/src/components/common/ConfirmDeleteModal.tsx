import { useState } from "react";
import Modal from "./Modal";

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

  const handleDelete = async () => {
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
      title="Confirm Delete"
      onClose={onClose}
      onSave={handleDelete}
      saveDisabled={loading}
      button_name="Delete"
      dialogClassName="modal-sm"
      disableClose={loading}
    >
      <p className="text-danger mb-0">
        {message}
      </p>
    </Modal>
  );
}
