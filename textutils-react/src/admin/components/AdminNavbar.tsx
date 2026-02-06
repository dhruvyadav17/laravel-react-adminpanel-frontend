import { NavLink } from "react-router-dom";
import { useLogout } from "../../auth/hooks/useLogout";

export default function AdminNavbar() {
  const logout = useLogout();

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* LEFT */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            className="nav-link btn btn-link"
            type="button"
            data-lte-toggle="sidebar"   // 🔥 FIX
          >
            <i className="fas fa-bars" />
          </button>
        </li>
      </ul>

      {/* RIGHT */}
      <ul className="navbar-nav ms-auto align-items-center">
        <li className="nav-item dropdown">
          <button
            className="nav-link btn btn-link"
            data-bs-toggle="dropdown"
            type="button"
          >
            <i className="fas fa-user-circle" />
          </button>

          <div className="dropdown-menu dropdown-menu-end">
            <NavLink to="/admin/profile" className="dropdown-item">
              <i className="fas fa-user me-2" />
              Profile
            </NavLink>

            <div className="dropdown-divider" />

            <button
              className="dropdown-item text-danger"
              onClick={() => logout("/admin/login")}
            >
              <i className="fas fa-sign-out-alt me-2" />
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
}
