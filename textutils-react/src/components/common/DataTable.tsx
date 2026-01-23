import { theme } from "../../ui/theme";
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
  const hasRows =
    Array.isArray(children) && children.length > 0;

  return (
    <table className={theme.table.base}>
      <thead className={theme.table.head}>{columns}</thead>

      {isLoading ? (
        <TableSkeleton rows={5} cols={colSpan} />
      ) : (
        <tbody>
          {hasRows ? (
            children
          ) : (
            <tr>
              <td colSpan={colSpan} className="text-center text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      )}
    </table>
  );
}
