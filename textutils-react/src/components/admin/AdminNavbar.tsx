import { NavLink } from "react-router-dom";

import { useLogout } from "../../auth/hooks/useLogout";
import { useAuth } from "../../auth/hooks/useAuth";
import { stopImpersonation } from "../../utils/impersonation";

export default function AdminNavbar() {
  const logout = useLogout();
  const { isImpersonating } = useAuth();

  const toggleSidebar = () => {
    document.body.classList.toggle("sidebar-collapse");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* ================= LEFT ================= */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            className="nav-link btn btn-link"
            onClick={toggleSidebar}
            type="button"
          >
            <i className="fas fa-bars" />
          </button>
        </li>
      </ul>

      {/* ================= RIGHT ================= */}
      <ul className="navbar-nav ml-auto align-items-center">
        {/* 🔥 IMPERSONATION EXIT */}
        {isImpersonating && (
          <li className="nav-item mr-3">
            <button
              className="btn btn-danger btn-sm"
              onClick={stopImpersonation}
            >
              Exit Impersonation
            </button>
          </li>
        )}

        {/* 👤 USER MENU */}
        <li className="nav-item dropdown">
          <button
            className="nav-link btn btn-link"
            data-toggle="dropdown"
            type="button"
          >
            <i className="fas fa-user-circle" />
          </button>

          <div className="dropdown-menu dropdown-menu-right">
            <NavLink
              to="/admin/profile"
              className="dropdown-item"
            >
              <i className="fas fa-user mr-2" />
              Profile
            </NavLink>

            <div className="dropdown-divider" />

            <button
              className="dropdown-item text-danger"
              onClick={() => logout()}
            >
              <i className="fas fa-sign-out-alt mr-2" />
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
}
