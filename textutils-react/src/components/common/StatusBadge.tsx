type Props = {
  status?: "active" | "inactive" | "locked" | "archived";
  active?: boolean;
};

export default function StatusBadge({
  status,
  active,
}: Props) {
  let label = "Inactive";
  let className = "badge badge-secondary";

  if (status) {
    switch (status) {
      case "active":
        label = "Active";
        className = "badge badge-success";
        break;
      case "inactive":
        label = "Inactive";
        className = "badge badge-secondary";
        break;
      case "locked":
        label = "Locked";
        className = "badge badge-danger";
        break;
      case "archived":
        label = "Archived";
        className = "badge badge-warning";
        break;
    }
  } else if (active !== undefined) {
    label = active ? "Active" : "Inactive";
    className = active
      ? "badge badge-success"
      : "badge badge-secondary";
  }

  return <span className={className}>{label}</span>;
}
