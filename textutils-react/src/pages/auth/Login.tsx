import { Navigate } from "react-router-dom";
import { isAuth } from "../../auth/auth";
import LoginForm from "./LoginForm";

export default function Login() {
  if (isAuth()) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <LoginForm
      title="User Login"
      mode="user"
    />
  );
}
