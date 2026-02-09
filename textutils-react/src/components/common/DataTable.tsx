import React from "react";
import TableSkeleton from "./TableSkeleton";
import TableEmptyRow from "./TableEmptyRow";

type Props = {
  isLoading: boolean;
  columns: React.ReactNode;
  children: React.ReactNode;
  colSpan: number;

  /** explicit & predictable */
  hasData: boolean;
  emptyMessage?: string;
};

export default function DataTable({
  isLoading,
  columns,
  children,
  colSpan,
  hasData,
  emptyMessage,
}: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered text-nowrap w-100">
        <thead className="table-dark">{columns}</thead>

        {isLoading ? (
          <TableSkeleton rows={5} cols={colSpan} />
        ) : (
          <tbody>
            {hasData ? (
              children
            ) : (
              <TableEmptyRow
                colSpan={colSpan}
                message={emptyMessage}
              />
            )}
          </tbody>
        )}
      </table>
    </div>
  );
}
