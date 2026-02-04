import { useAuth } from "../../../auth/hooks/useAuth";
import { useGetDashboardStatsQuery } from "../../../store/api";
import InfoBox from "../../../ui/InfoBox";
import { ICONS } from "../../../constants/icons";

export default function Dashboard() {
  const { user, permissions } = useAuth();
  const { data: stats } = useGetDashboardStatsQuery();

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <h3 className="mb-3">Admin Dashboard</h3>

        <div className="row">
          <div className="col-md-3 col-sm-6">
            <InfoBox
              title="Total Users"
              value={stats?.total_users ?? 0}
              icon={ICONS.USER}
              color="primary"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <InfoBox
              title="Permissions"
              value={permissions.length}
              icon={ICONS.PERMISSION}
              color="success"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <InfoBox
              title="Roles"
              value={user?.roles.length || 0}
              icon={ICONS.ROLE}
              color="warning"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
