import { useAuth } from "../../auth/hooks/useAuth";

export default function Dashboard() {
  const { user, permissions } = useAuth();

  return (
    <div className="container mt-4">
      <h3>Admin Dashboard</h3>

      <div className="row mt-3">
        <div className="col-md-4">
          <div className="card text-bg-primary">
            <div className="card-body">
              <h5>Total Permissions</h5>
              <h3>{permissions.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success">
            <div className="card-body">
              <h5>Your Roles</h5>
              <h3>{user?.roles?.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-dark">
            <div className="card-body">
              <h5>Logged In As</h5>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
