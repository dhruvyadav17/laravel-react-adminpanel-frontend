import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
  admin?: boolean;
  permission?: string;
};

export default function Guard({ admin, permission }: Props) {
  const { isAuth, isAdmin, can } = useAuth();

  /* 🔒 AUTH */
  if (!isAuth) {
    return <Navigate to={admin ? "/admin/login" : "/login"} replace />;
  }

  /* 🛡 ADMIN */
  if (admin && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  /* 🔐 PERMISSION */
  if (permission && !can(permission)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
