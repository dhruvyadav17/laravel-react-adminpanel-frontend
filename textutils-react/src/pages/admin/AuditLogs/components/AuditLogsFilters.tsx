type Props = {
  action?: string;
  onActionChange: (value?: string) => void;
};

export default function AuditLogsFilters({
  action,
  onActionChange,
}: Props) {
  return (
    <div className="mb-3">
      <select
        className="form-select"
        value={action ?? ""}
        onChange={(e) =>
          onActionChange(e.target.value || undefined)
        }
      >
        <option value="">All Actions</option>
        <option value="login">Login</option>
        <option value="logout">Logout</option>
        <option value="role_assigned">Role Assigned</option>
        <option value="permission_changed">Permission Changed</option>
      </select>
    </div>
  );
}
