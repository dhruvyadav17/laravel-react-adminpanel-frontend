import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";

export default function PermissionRoute({ permission }: { permission: string }) {
  const can = usePermission();

  if (!can(permission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
