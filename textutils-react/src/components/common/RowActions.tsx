import Button from "./Button";

type Action = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger" | "success";
  show?: boolean;
  disabled?: boolean;
  icon?: string;
};

export default function RowActions({ actions }: { actions: Action[] }) {
  return (
    <div className="btn-group btn-group-sm">
      {actions
        .filter((a) => a.show !== false)
        .map((a, i) => (
          <Button
            key={i}
            label={a.label}
            variant={a.variant}
            onClick={a.onClick}
            disabled={a.disabled}
            icon={a.icon}
            size="sm"
          />
        ))}
    </div>
  );
}
