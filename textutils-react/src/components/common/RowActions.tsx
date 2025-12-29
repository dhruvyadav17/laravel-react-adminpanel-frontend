import Button from "./Button";

type Action = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger";
  show?: boolean;
  disabled?: boolean;
};

export default function RowActions({ actions }: { actions: Action[] }) {
  return (
    <>
      {actions
        .filter((a) => a.show !== false)
        .map((a, i) => (
          <Button
            key={i}
            label={a.label}
            variant={a.variant}
            onClick={a.onClick}
            disabled={a.disabled}
            className="me-1"
          />
        ))}
    </>
  );
}
