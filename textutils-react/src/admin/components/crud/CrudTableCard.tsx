import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import DataTable from "../table/AdminTable";

type Props<T> = {
  title: string;
  loading: boolean;
  data: T[];
  emptyText: string;
  columns: React.ReactNode;
  renderRow: (row: T) => React.ReactNode;
  colSpan: number;
};

export default function CrudTableCard<T>({
  title,
  loading,
  data,
  emptyText,
  columns,
  renderRow,
  colSpan,
}: Props<T>) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardBody
        className="p-0"
        loading={loading}
        empty={!loading && data.length === 0}
        emptyText={emptyText}
      >
        <DataTable<T>
          loading={loading}
          data={data}
          colSpan={colSpan}
          columns={columns}
          renderRow={renderRow}
        />
      </CardBody>
    </Card>
  );
}
