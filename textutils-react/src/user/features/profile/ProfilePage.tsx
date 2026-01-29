import { useAuth } from "../../../auth/hooks/useAuth";

export default function ProfilePage() {
  const { user, roles } = useAuth();

  return (
    <div className="card">
      <div className="card-header">
        <h3>User Profile</h3>
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
      </div>
    </div>
  );
}
