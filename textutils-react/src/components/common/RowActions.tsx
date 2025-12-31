import Button from "./Button";

type Action = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "danger";
  show?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type Props = {
  actions: Action[];

  /** layout control */
  align?: "start" | "center" | "end";
  gap?: number; // bootstrap gap-1, gap-2 etc
  vertical?: boolean;
};

export default function RowActions({
  actions,
  align = "end",
  gap = 1,
  vertical = false,
}: Props) {
  const justify =
    align === "start"
      ? "justify-content-start"
      : align === "center"
      ? "justify-content-center"
      : "justify-content-end";

  return (
    <div
      className={`d-flex ${
        vertical ? "flex-column" : ""
      } ${justify} gap-${gap}`}
    >
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
          />
        ))}
    </div>
  );
}
