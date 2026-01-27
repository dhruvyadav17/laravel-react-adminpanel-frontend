import Button from "./Button";

export type RowAction = {
  key: string; // 🔒 REQUIRED & UNIQUE
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger" | "success";
  show?: boolean;
  disabled?: boolean;
  icon?: string;
};

type Props = {
  actions: RowAction[];
};

export default function RowActions({ actions }: Props) {
  const visibleActions = actions.filter(
    (a) => a.show !== false
  );

  if (visibleActions.length === 0) return null;

  return (
    <div className="btn-group btn-group-sm">
      {visibleActions.map((action) => (
        <Button
          key={action.key}
          label={action.label}
          variant={action.variant}
          onClick={action.onClick}
          disabled={action.disabled}
          icon={action.icon}
          size="sm"
        />
      ))}
    </div>
  );
}
