import { useAuth } from "../../auth/hooks/useAuth";
export default function UserPermissions() {
const { permissions } = useAuth();

  return (
    <div className="container mt-4">
      <h3>My Permissions</h3>
      <ul className="list-group mt-3">
        {permissions.map((p: string) => (
          <li key={p} className="list-group-item">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
