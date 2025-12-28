import { Navigate } from "react-router-dom";
import { isAuth, isAdmin } from "../../auth/auth";
import LoginForm from "../auth/LoginForm";

export default function AdminLogin() {
  if (isAuth() && isAdmin()) {
    return <Navigate to="/admin/profile" replace />;
  }

  if (isAuth() && !isAdmin()) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <LoginForm
      title="Admin Login"
      mode="admin"
    />
  );
}
