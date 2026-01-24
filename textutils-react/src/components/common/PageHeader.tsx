type Props = {
  title: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, action }: Props) {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">{title}</h3>
        {action}
      </div>
    </div>
  );
}
