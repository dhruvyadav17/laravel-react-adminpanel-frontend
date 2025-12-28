import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "./auth";

export default function UserGuard() {
  if (!isAuth()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
