import { Navigate } from "react-router-dom";
import LoginForm from "../../auth/LoginForm";
import { useAuth } from "../../auth/hooks/useAuth";

type Props = {
  admin?: boolean; // 🔥 admin or user login
};

export default function Login({ admin = false }: Props) {
  const { isAuth, isAdmin } = useAuth();

  /* ================= REDIRECT LOGIC ================= */
  if (isAuth) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  /* ================= VIEW ================= */
  return (
    <LoginForm
      title={admin ? "Admin Login" : "User Login"}
      redirectAdmin={admin}
    />
  );
}
