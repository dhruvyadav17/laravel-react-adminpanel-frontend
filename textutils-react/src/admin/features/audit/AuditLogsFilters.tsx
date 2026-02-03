type Props = {
  action?: string;
  onActionChange: (value?: string) => void;
};

export default function AuditLogsFilters({
  action,
  onActionChange,
}: Props) {
  return (
    <div className="mb-3" style={{ maxWidth: 240 }}>
      <select
        className="form-select"
        value={action ?? ""}
        onChange={(e) =>
          onActionChange(e.target.value || undefined)
        }
      >
        <option value="">All actions</option>
        <option value="login">Login</option>
        <option value="logout">Logout</option>
        <option value="role-assigned">Role Assigned</option>
        <option value="permission-changed">Permission Changed</option>
      </select>
    </div>
  );
}
