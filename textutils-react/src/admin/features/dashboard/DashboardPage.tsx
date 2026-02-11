import { useMemo } from "react";

import { useAuth } from "../../../auth/hooks/useAuth";
import { useGetDashboardStatsQuery } from "../../../store/api";

// import PageHeader from "../../components/page/PageHeader";
import InfoBox from "../../components/ui/InfoBox";

// import { Card, CardBody } from "../../../components/ui/Card";
import { ICONS } from "../../../constants/ui";
import AdminPage from "../../components/page/AdminPage";

export default function DashboardPage() {
  const { user, permissions } = useAuth();
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  const widgets = useMemo(
    () => [
      {
        title: "Total Users",
        value: stats?.total_users ?? 0,
        icon: ICONS.USER,
        color: "primary",
      },
      {
        title: "Permissions",
        value: permissions.length,
        icon: ICONS.PERMISSION,
        color: "success",
      },
      {
        title: "Roles",
        value: user?.roles.length || 0,
        icon: ICONS.ROLE,
        color: "warning",
      },
    ],
    [stats, permissions.length, user?.roles?.length]
  );

  return (
    <AdminPage title="Admin Dashboard">
        <div className="row g-3">
          {widgets.map((widget) => (
            <div
              key={widget.title}
              className="col-lg-3 col-6"
            >
              {/* <Card>
                <CardBody loading={isLoading}> */}
                  <InfoBox {...widget} />
                {/* </CardBody>
              </Card> */}
            </div>
          ))}
        </div>
    </AdminPage>
  );
}
