import { useAuth } from "../../auth/hooks/useAuth";

export default function UserRoles() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mt-4">
        <p>No user data found</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>My Roles</h3>

      <ul className="list-group mt-3">
        {user.roles?.length ? (
          user.roles.map((role: string) => (
            <li key={role} className="list-group-item">
              {role}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">
            No roles assigned
          </li>
        )}
      </ul>
    </div>
  );
}
