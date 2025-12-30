import Modal from "./Modal";

type Props = {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDeleteModal({
  message,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal
      title="Confirm Delete"
      onClose={onClose}
      onSave={onConfirm}
      button_name="Delete"
    >
      <p className="text-danger mb-0">{message}</p>
    </Modal>
  );
}
