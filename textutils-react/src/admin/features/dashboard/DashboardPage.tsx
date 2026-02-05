import { useAuth } from "../../../auth/hooks/useAuth";
import { useGetDashboardStatsQuery } from "../../../store/api";
import InfoBox from "../shared/ui/InfoBox";
import { ICONS } from "../../../constants/icons";
import PageHeader from "../../../components/common/PageHeader";

export default function Dashboard() {
  const { user, permissions } = useAuth();
  const { data: stats } = useGetDashboardStatsQuery();

  return (
    <>
      {/* PAGE HEADER */}
      <PageHeader title="Admin Dashboard" />

      {/* INFO BOXES */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-6">
            <InfoBox
              title="Total Users"
              value={stats?.total_users ?? 0}
              icon={ICONS.USER}
              color="primary"
            />
          </div>

          <div className="col-lg-3 col-6">
            <InfoBox
              title="Permissions"
              value={permissions.length}
              icon={ICONS.PERMISSION}
              color="success"
            />
          </div>

          <div className="col-lg-3 col-6">
            <InfoBox
              title="Roles"
              value={user?.roles.length || 0}
              icon={ICONS.ROLE}
              color="warning"
            />
          </div>
        </div>
      </div>
    </>
  );
}
