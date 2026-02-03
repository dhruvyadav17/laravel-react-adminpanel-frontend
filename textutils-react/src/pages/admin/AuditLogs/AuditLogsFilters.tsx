interface Props {
  action?: string;
  onActionChange: (value?: string) => void;
}

export default function AuditLogsFilters({
  action,
  onActionChange,
}: Props) {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex gap-3">
        <select
          className="form-select w-auto"
          value={action ?? ""}
          onChange={e =>
            onActionChange(
              e.target.value || undefined
            )
          }
        >
          <option value="">All Actions</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="user-roles-updated">User Roles</option>
          <option value="user-permissions-updated">User Permissions</option>
          <option value="role-permissions-updated">Role Permissions</option>
        </select>
      </div>
    </div>
  );
}
