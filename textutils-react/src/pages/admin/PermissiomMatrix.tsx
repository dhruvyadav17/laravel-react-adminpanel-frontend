import { useEffect, useState } from "react";
import { getRoles } from "../../services/roleService";
import { getPermissions } from "../../services/permissionService";

export default function PermissionMatrix() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getRoles(), getPermissions()]).then(
      ([rolesRes, permRes]) => {
        setRoles(rolesRes.data.data);
        setPermissions(permRes.data.data);
      }
    );
  }, []);

  return (
    <div className="container mt-4">
      <h3>Permission Matrix</h3>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Permission ↓ / Role →</th>
            {roles.map((r) => (
              <th key={r.id}>{r.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              {roles.map((r) => (
                <td key={r.id} className="text-center">
                  <input type="checkbox" disabled />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-muted">
        (Next step: checkbox → live assign/unassign)
      </p>
    </div>
  );
}
