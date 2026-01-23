import Button from "./Button";

type Action = {
  label?: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger";
  show?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type Props = {
  actions: Action[];
};

export default function RowActions({ actions }: Props) {
  return (
    <div className="d-flex justify-content-end gap-1">
      {actions
        .filter((a) => a.show !== false)
        .map((a, i) => (
          <Button
            key={i}
            label={a.label}
            icon={a.icon}
            variant={a.variant}
            onClick={a.onClick}
            disabled={a.disabled}
            size="sm"
          />
        ))}
    </div>
  );
}
