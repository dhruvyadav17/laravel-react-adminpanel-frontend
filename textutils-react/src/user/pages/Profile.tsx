import { useAuth } from "../../auth/hooks/useAuth";
import { useLogout } from "../../auth/hooks/useLogout";
import Card from "../../ui/Card";
import CardHeader from "../../ui/CardHeader";
import CardBody from "../../ui/CardBody";
import Button from "../../components/common/Button";

export default function Profile() {
  const { user } = useAuth();
  const logout = useLogout();

  if (!user) {
    return (
      <div className="container mt-4 text-muted">
        No profile data found
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card>
        <CardHeader
          title="My Profile"
          action={
            <Button
              label="Logout"
              variant="danger"
              icon="fas fa-sign-out-alt"
              onClick={() => logout("/login")}
            />
          }
        />

        <CardBody>
          <div className="row">
            <div className="col-md-6 mb-2">
              <strong>Name:</strong>
              <div>{user.name}</div>
            </div>

            <div className="col-md-6 mb-2">
              <strong>Email:</strong>
              <div>{user.email}</div>
            </div>

            <div className="col-12 mt-3">
              <strong>Roles:</strong>
              <div>
                {user.roles.length
                  ? user.roles.join(", ")
                  : "—"}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
