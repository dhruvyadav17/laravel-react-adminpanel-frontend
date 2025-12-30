import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuth } from "../auth/hooks/useAuth";
import { usePermission } from "../auth/hooks/usePermission";
import { ADMIN_MENU, USER_MENU } from "../config/menu";
import { logoutThunk } from "../store/authSlice";
import { logoutService } from "../services/authService";

export default function Header() {
  const { isAdmin } = useAuth();
  const can = usePermission();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menu = isAdmin ? ADMIN_MENU : USER_MENU;

  const handleLogout = () => {
    // 1️⃣ clear frontend auth immediately
    dispatch(logoutThunk());

    // 2️⃣ redirect immediately (NO double click)
    navigate(isAdmin ? "/admin/login" : "/login", {
      replace: true,
    });

    // 3️⃣ backend logout (fire & forget)
    logoutService().catch(() => {});
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Admin Panel
        </Link>

        <div className="navbar-nav me-auto">
          {menu.map(
            (m) =>
              (!m.permission || can(m.permission)) && (
                <Link key={m.path} to={m.path} className="nav-link">
                  {m.label}
                </Link>
              )
          )}
        </div>

        {/* 🔥 LOGOUT BUTTON */}
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
