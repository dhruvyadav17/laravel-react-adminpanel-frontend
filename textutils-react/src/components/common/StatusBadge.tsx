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
        className = "badge bg-success";
        break;
      case "inactive":
        label = "Inactive";
        className = "badge bg-secondary";
        break;
      case "locked":
        label = "Locked";
        className = "badge bg-danger";
        break;
      case "archived":
        label = "Archived";
        className = "badge bg-warning";
        break;
    }
  } else if (active !== undefined) {
    label = active ? "Active" : "Inactive";
    className = active
      ? "badge bg-success"
      : "badge bg-secondary";
  }

  return <span className={className}>{label}</span>;
}
