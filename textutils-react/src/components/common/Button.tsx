import React from "react";

type Variant = "primary" | "secondary" | "warning" | "danger";
type Size = "sm" | "md";

type ButtonProps = {
  /** NEW (preferred) */
  children?: React.ReactNode;

  /** OLD (backward compatible) */
  label?: string;
  icon?: React.ReactNode;

  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  label,
  icon,
  onClick,
  type = "button",
  variant = "primary",
  size = "sm",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const content = children ?? (
    <>
      {icon && <span className="me-1">{icon}</span>}
      {label}
    </>
  );

  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Please wait..." : content}
    </button>
  );
}
