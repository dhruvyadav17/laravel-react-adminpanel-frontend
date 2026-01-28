import { Card } from "../../../components/common/Card";
import { useAuth } from "../../../auth/hooks/useAuth";

export default function AdminProfilePage() {
  const { user, permissions } = useAuth();

  if (!user) return null;

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Admin Profile</h1>

      {/* BASIC INFO */}
      <Card title="Basic Information">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Email Verified:</strong>{" "}
          {user.email_verified ? "Yes" : "No"}
        </p>
      </Card>

      {/* ROLES */}
      <Card title="Roles">
        {user.roles?.length ? (
          <ul>
            {user.roles.map((role: string) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        ) : (
          <p>No roles assigned</p>
        )}
      </Card>

      {/* PERMISSIONS */}
      <Card title="Permissions">
        {permissions.length ? (
          <div className="d-flex flex-wrap gap-2">
            {permissions.map((perm: string) => (
              <span
                key={perm}
                className="badge bg-secondary"
              >
                {perm}
              </span>
            ))}
          </div>
        ) : (
          <p>No permissions</p>
        )}
      </Card>
    </div>
  );
}
