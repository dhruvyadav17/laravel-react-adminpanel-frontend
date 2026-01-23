type Props = {
  status: "active" | "archived" | "blocked";
};

export default function StatusBadge({ status }: Props) {
  const map = {
    active: "success",
    archived: "warning",
    blocked: "danger",
  };

  return (
    <span className={`badge badge-${map[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}
