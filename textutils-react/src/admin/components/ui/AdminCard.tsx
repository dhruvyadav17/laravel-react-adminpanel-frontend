import { Card, CardHeader, CardBody } from "../../../components/ui/Card";

type Props = {
  title?: string;
  loading?: boolean;
  empty?: boolean;
  emptyText?: string;
  className?: string;
  children: React.ReactNode;
};

export default function AdminCard({
  title,
  loading,
  empty,
  emptyText,
  className = "",
  children,
}: Props) {
  return (
    <Card className={className}>
      {title && <CardHeader title={title} />}
      <CardBody
        className="p-0"
        loading={loading}
        empty={empty}
        emptyText={emptyText}
      >
        {children}
      </CardBody>
    </Card>
  );
}
