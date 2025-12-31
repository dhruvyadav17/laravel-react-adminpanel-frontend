import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuth } from "../auth/hooks/useAuth";
import { adminAppRoutes, userAppRoutes } from "../config/appRoutes";
import { logoutThunk } from "../store/authSlice";
import { logoutService } from "../services/authService";
import MenuRenderer from "./MenuRenderer";

export default function Header() {
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const routes = isAdmin ? adminAppRoutes : userAppRoutes;

  const menuItems = routes.filter(
    (r) => r.showInMenu && r.label
  );

  const handleLogout = () => {
    dispatch(logoutThunk());

    navigate(isAdmin ? "/admin/login" : "/login", {
      replace: true,
    });

    logoutService().catch(() => {});
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Admin Panel
        </Link>

        <div className="navbar-nav me-auto">
          <MenuRenderer items={menuItems} />
        </div>

        <div className="navbar-nav">
          <button
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
