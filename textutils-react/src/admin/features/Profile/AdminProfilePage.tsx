import { useAuth } from "../../../auth/hooks/useAuth";

export default function AdminProfilePage() {
  const { user, roles, permissions, isSuperAdmin } = useAuth();

  return (
    <div className="card">
      <div className="card-header">
        <h3>Admin Profile</h3>
      </div>

      <div className="card-body">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Roles:</strong> {roles.join(", ")}
        </p>

        <p>
          <strong>Account Type:</strong>{" "}
          {isSuperAdmin ? "Super Admin" : "Admin"}
        </p>

        <hr />

        <h5>Permissions</h5>
        <ul className="list-group list-group-flush">
          {permissions.map((p) => (
            <li key={p} className="list-group-item">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
