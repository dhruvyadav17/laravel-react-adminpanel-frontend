import Modal from "./Modal";

type Props = {
  title: string;
  loading: boolean;
  onSave: () => void;
  onClose: () => void;
  saveText?: string;
  children: React.ReactNode;
};

export default function FormModal({
  title,
  loading,
  onSave,
  onClose,
  saveText,
  children,
}: Props) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      onSave={onSave}
      saveDisabled={loading}
      saveText={saveText || (loading ? "Saving..." : "Save")}
    >
      {children}
    </Modal>
  );
}
