import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

export default function AuthLayout() {
  const { isAuth, isAdmin } = useAuth();

  if (isAuth && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuth) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <Outlet />
    </div>
  );
}
