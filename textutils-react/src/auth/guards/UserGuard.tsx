import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserGuard() {
  const { isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/login" replace />;

  return <Outlet />;
}
