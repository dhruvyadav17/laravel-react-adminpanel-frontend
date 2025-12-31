import TableSkeleton from "./TableSkeleton";

type Props = {
  isLoading: boolean;
  columns: React.ReactNode;
  children: React.ReactNode;
  emptyMessage?: string;
  colSpan: number;
};

export default function DataTable({
  isLoading,
  columns,
  children,
  emptyMessage = "No records found",
  colSpan,
}: Props) {
  return (
    <table className="table table-bordered">
      <thead className="table-dark">{columns}</thead>

      {isLoading ? (
        <TableSkeleton rows={5} cols={colSpan} />
      ) : (
        <tbody>
          {children}

          {!children && (
            <tr>
              <td colSpan={colSpan} className="text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      )}
    </table>
  );
}
