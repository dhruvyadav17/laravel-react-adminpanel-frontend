import { useNavigate } from "react-router-dom";
import { logoutService } from "../services/authService";
import { logout } from "../auth/auth";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch (e) {
      // token already expired → ignore
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
      Logout
    </button>
  );
}
