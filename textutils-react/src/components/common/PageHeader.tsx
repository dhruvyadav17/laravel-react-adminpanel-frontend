type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="mb-0">{title}</h3>
          {subtitle && (
            <small className="text-muted">{subtitle}</small>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
