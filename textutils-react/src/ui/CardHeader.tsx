export default function CardHeader({
  title,
  action,
}: {
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card-header d-flex justify-content-between align-items-center">
      <strong>{title}</strong>
      {action}
    </div>
  );
}
