import { AuditLog } from "@/types/audit";

interface Props {
  logs: AuditLog[];
  loading?: boolean;
}

export default function AuditLogsTable({
  logs,
  loading,
}: Props) {
  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  if (!logs.length) {
    return <div className="text-muted">No audit logs found.</div>;
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        <table className="table table-striped mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Action</th>
              <th>Subject</th>
              <th>IP</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>

                <td>
                  {log.user
                    ? `${log.user.name} (${log.user.email})`
                    : "System"}
                </td>

                <td>
                  <span className="badge bg-info">
                    {log.action}
                  </span>
                </td>

                <td>
                  {log.subject_type
                    ? `${log.subject_type} #${log.subject_id}`
                    : "-"}
                </td>

                <td>{log.ip_address ?? "-"}</td>

                <td>
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
