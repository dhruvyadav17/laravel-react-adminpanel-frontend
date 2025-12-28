import { Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useAuth } from "../../auth/hooks/useAuth";

export default function Login() {
  const { isAuth, isAdmin } = useAuth();

  if (isAuth) {
    return (
      <Navigate
        to={isAdmin ? "/admin/dashboard" : "/profile"}
        replace
      />
    );
  }

  return <LoginForm title="User Login" />;
}
