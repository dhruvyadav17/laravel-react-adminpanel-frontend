import { Navigate } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import { useAuth } from "../../auth/hooks/useAuth";

export default function AdminLogin() {
  const { isAuth, isAdmin } = useAuth();

  if (isAuth && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuth && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return <LoginForm title="Admin Login" />;
}
