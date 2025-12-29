import React from "react";

type Variant = "primary" | "secondary" | "warning" | "danger";
type Size = "sm" | "md";

type Props = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

export default function Button({
  label,
  onClick,
  type = "button",
  variant = "primary",
  size = "sm",
  loading = false,
  disabled = false,
  icon,
  className = "",
}: Props) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Please wait..." : (
        <>
          {icon && <span className="me-1">{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
}
