type Props = {
  label?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  loading,
  disabled,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm mr-2" />
      )}
      {label}
    </button>
  );
}
