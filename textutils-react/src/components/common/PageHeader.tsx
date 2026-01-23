type Props = {
  title: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, action }: Props) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 className="mb-0">{title}</h3>
      {action}
    </div>
  );
}
