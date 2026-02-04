type Props = {
  label?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  title?: string;                // ✅ ADD (tooltip text)
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  size = "md",
  className = "",
  type = "button",
  title,                          // ✅ ADD
}: Props) {
  const sizeClass =
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}               // ✅ HTML tooltip
    >
      {loading && (
        <span className="spinner-border spinner-border-sm mr-2" />
      )}
      {icon && !loading && <i className={`${icon} mr-1`} />}
      {label}
    </button>
  );
}
