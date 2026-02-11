import DataTable from "./DataTable";
import TableEmptyRow from "./TableEmptyRow";

type Props<T> = {
  loading: boolean;
  data: T[];
  colSpan: number;
  columns: React.ReactNode;
  renderRow: (row: T) => React.ReactNode;
};

export default function AdminTable<T>({
  loading,
  data,
  colSpan,
  columns,
  renderRow,
}: Props<T>) {
  return (
    <DataTable colSpan={colSpan} columns={columns}>
      {loading ? null : data.length === 0 ? (
        <TableEmptyRow colSpan={colSpan} />
      ) : (
        data.map(renderRow)
      )}
    </DataTable>
  );
}
