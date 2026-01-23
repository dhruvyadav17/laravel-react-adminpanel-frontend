import { theme } from "../../ui/theme";

type Props = {
  label?: string;
  onClick?: () => void;
  variant?: keyof typeof theme.colors;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
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
}: Props) {
  const sizeClass =
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type={type}
      className={`btn btn-${theme.colors[variant]} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm mr-2" />
      )}
      {icon && !loading && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  );
}
