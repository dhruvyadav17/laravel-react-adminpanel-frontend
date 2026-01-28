import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

type Props = {
  permission: string;
};

export default function PermissionGuard({ permission }: Props) {
  const { isAuth, can } = useAuth();

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!can(permission)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
