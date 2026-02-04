type Props = {
  title: string;
  children: React.ReactNode;
};

export function Card({ title, children }: Props) {
  return (
    <div className="card mb-4">
      <div className="card-header fw-bold">
        {title}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
