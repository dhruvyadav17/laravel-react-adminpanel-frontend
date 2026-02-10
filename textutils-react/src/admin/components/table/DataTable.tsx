import React from "react";

type Props = {
  columns: React.ReactNode;
  children: React.ReactNode;
  colSpan: number;
};

export default function DataTable({
  columns,
  children,
  colSpan,
}: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead>{columns}</thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}
