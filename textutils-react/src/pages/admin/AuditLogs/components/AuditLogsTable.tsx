import DataTable from "@/components/common/DataTable";
import type { AuditLog } from "@/types/audit";

type Props = {
  logs: AuditLog[];
  loading: boolean;
};

export default function AuditLogsTable({ logs, loading }: Props) {
  return (
    <DataTable
      isLoading={loading}
      hasData={logs.length > 0}
      colSpan={4}
      columns={
        <tr>
          <th>User</th>
          <th>Action</th>
          <th>IP</th>
          <th>Date</th>
        </tr>
      }
    >
      {logs.map((log) => (
        <tr key={log.id}>
          <td>{log.user_name}</td>
          <td>{log.action}</td>
          <td>{log.ip_address}</td>
          <td>{log.created_at}</td>
        </tr>
      ))}
    </DataTable>
  );
}
