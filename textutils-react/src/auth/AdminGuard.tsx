import { Navigate, Outlet } from "react-router-dom";
import { isAuth, isAdmin } from "./auth";

export default function AdminGuard() {
  if (!isAuth()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
