import { useAuth } from "../../../auth/hooks/useAuth";

import {
  Card,
  CardHeader,
  CardBody,
} from "../../../components/ui/Card";

export default function AdminProfilePage() {
  const {
    user,
    roles,
    permissions,
    isSuperAdmin,
  } = useAuth();

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <Card>
          <CardHeader title="Admin Profile" />

          <CardBody>
            <p>
              <strong>Name:</strong>{" "}
              {user?.name || "—"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {user?.email || "—"}
            </p>

            <p>
              <strong>Roles:</strong>{" "}
              {roles.length
                ? roles.join(", ")
                : "—"}
            </p>

            <p>
              <strong>Account Type:</strong>{" "}
              {isSuperAdmin
                ? "Super Admin"
                : "Admin"}
            </p>

            <hr />

            <h5 className="mb-2">Permissions</h5>

            {permissions.length ? (
              <ul className="list-group list-group-flush">
                {permissions.map((p) => (
                  <li
                    key={p}
                    className="list-group-item px-0"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">
                No permissions assigned
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
