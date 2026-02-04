import Button from "./Button";

export type RowAction = {
  key: string; // 🔒 REQUIRED & UNIQUE
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger" | "success";
  show?: boolean;
  disabled?: boolean;
  icon?: string;
  title?: string;
  className?: string;
};

type Props = {
  actions: RowAction[];
};

export default function RowActions({ actions }: Props) {
  const visibleActions = actions.filter((a) => a.show !== false);

  if (visibleActions.length === 0) return null;

  return (
<div className="d-flex justify-content-end">
  {visibleActions.map((action, index) => (
    <Button
      key={action.key}
      label={action.label}
      variant={action.variant}
      onClick={action.onClick}
      disabled={action.disabled}
      icon={action.icon}
      size="sm"
      title={action.title}
      className={`${!action.label ? "px-2" : ""} ${
        index !== visibleActions.length - 1 ? "mr-2" : ""
      }`}
    />
  ))}
</div>

  );
}
