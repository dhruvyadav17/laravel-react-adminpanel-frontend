type Props = {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export default function StatusToggle({
  checked,
  onToggle,
  disabled,
}: Props) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${
        checked ? "btn-success" : "btn-secondary"
      }`}
      onClick={onToggle}
      disabled={disabled}
    >
      {checked ? "Active" : "Inactive"}
    </button>
  );
}
