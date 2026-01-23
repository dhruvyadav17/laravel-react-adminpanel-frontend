import { Navigate } from "react-router-dom";
import LoginForm from "../../auth/LoginForm";
import { useAuth } from "../../auth/hooks/useAuth";

type Props = {
  admin?: boolean;
};

export default function Login({ admin = false }: Props) {
  const { isAuth, isAdmin } = useAuth();

  /* 🔁 Already logged in */
  if (isAuth) {
    return (
      <Navigate
        to={isAdmin ? "/admin/dashboard" : "/profile"}
        replace
      />
    );
  }

  return (
    <LoginForm
      title={admin ? "Admin Login" : "User Login"}
      redirectAdmin={admin}
    />
  );
}
