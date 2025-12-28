import { getUser } from "../../auth/auth";

export default function UserRoles() {
  const user = getUser();

  return (
    <div className="container mt-4">
      <h3>My Roles</h3>
      <ul className="list-group mt-3">
        {user?.roles?.map((r: string) => (
          <li key={r} className="list-group-item">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
