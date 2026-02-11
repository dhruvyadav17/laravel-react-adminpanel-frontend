import React from "react";

/* ===================================================== */
/* ================= TYPES ============================= */
/* ===================================================== */

type Props = {
  columns: React.ReactNode;
  children?: React.ReactNode;

  colSpan: number;

  isLoading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
};

/* ===================================================== */
/* ================= MAIN COMPONENT ==================== */
/* ===================================================== */

export default function DataTable({
  columns,
  children,
  colSpan,
  isLoading = false,
  isEmpty = false,
  emptyText = "No data available",
}: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead>{columns}</thead>

        <tbody>
          {isLoading && (
            <TableSkeleton colSpan={colSpan} />
          )}

          {!isLoading && isEmpty && (
            <TableEmptyRow
              colSpan={colSpan}
              text={emptyText}
            />
          )}

          {!isLoading && !isEmpty && children}
        </tbody>
      </table>
    </div>
  );
}

/* ===================================================== */
/* ================= INTERNAL: SKELETON ================ */
/* ===================================================== */

function TableSkeleton({
  rows = 5,
  colSpan,
}: {
  rows?: number;
  colSpan: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          <td colSpan={colSpan}>
            <div className="placeholder-glow">
              <span
                className="placeholder col-12 bg-secondary"
                style={{ height: 20 }}
              />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

/* ===================================================== */
/* ================= INTERNAL: EMPTY =================== */
/* ===================================================== */

function TableEmptyRow({
  colSpan,
  text,
}: {
  colSpan: number;
  text: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="text-center py-4 text-muted"
      >
        {text}
      </td>
    </tr>
  );
}
