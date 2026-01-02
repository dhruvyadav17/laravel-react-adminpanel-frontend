import { useAuth } from "../../auth/hooks/useAuth";
import { useGetUsersQuery } from "../../store/api";
import StatCard from "../../ui/StatCard";

export default function Dashboard() {
  const { user, permissions } = useAuth();
  const { data: users = [] } = useGetUsersQuery();

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <h3 className="mb-3">Admin Dashboard</h3>

        {/* ================= STAT CARDS ================= */}
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-3">
            <StatCard
              title="Total Users"
              value={users.length}
              icon="fas fa-users"
              color="primary"
            />
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <StatCard
              title="Total Permissions"
              value={permissions.length}
              icon="fas fa-key"
              color="success"
            />
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <StatCard
              title="Your Roles"
              value={user?.roles?.length || 0}
              icon="fas fa-user-shield"
              color="warning"
            />
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <StatCard
              title="Logged In As"
              value={user?.email || "-"}
              icon="fas fa-user"
              color="dark"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
