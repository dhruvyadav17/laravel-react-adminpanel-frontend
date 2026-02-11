import { useAuth } from "../../../auth/hooks/useAuth";

import AdminPage from "../../components/page/AdminPage";
import AdminCard from "../../components/ui/AdminCard";

export default function AdminProfilePage() {
  const { user, roles, permissions, isSuperAdmin } = useAuth();

  return (
    <AdminPage title="Admin Profile">
      <AdminCard>
        <p>
          <strong>Name:</strong> {user?.name || "—"}
        </p>

        <p>
          <strong>Email:</strong> {user?.email || "—"}
        </p>

        <p>
          <strong>Roles:</strong> {roles.length ? roles.join(", ") : "—"}
        </p>

        <p>
          <strong>Account Type:</strong>{" "}
          {isSuperAdmin ? "Super Admin" : "Admin"}
        </p>

        <hr />

        <h5 className="mb-2">Permissions</h5>

        {permissions.length ? (
          <ul className="list-group list-group-flush">
            {permissions.map((p) => (
              <li key={p} className="list-group-item px-0">
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-0">No permissions assigned</p>
        )}
      </AdminCard>
    </AdminPage>
  );
}
