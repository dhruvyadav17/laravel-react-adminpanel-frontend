type Props = {
  title: string;
  value: string | number;
  icon?: string;
  color?: "primary" | "success" | "warning" | "danger" | "info" | "dark";
};

export default function StatCard({
  title,
  value,
  icon,
  color = "primary",
}: Props) {
  return (
    <div className={`card text-bg-${color}`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">{title}</h6>
          <h3 className="mb-0">{value}</h3>
        </div>
        {icon && <i className={`${icon} fa-2x opacity-75`} />}
      </div>
    </div>
  );
}
