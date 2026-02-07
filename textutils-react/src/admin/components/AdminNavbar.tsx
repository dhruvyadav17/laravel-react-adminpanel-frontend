import { NavLink } from "react-router-dom";
import { useLogout } from "../../auth/hooks/useLogout";

type Props = {
  onToggleSidebar: () => void;
};

export default function AdminNavbar({ onToggleSidebar }: Props) {
  const logout = useLogout();

  return (
    <nav className="navbar navbar-expand bg-body w-100">
      {/* ================= LEFT ================= */}
      <ul className="navbar-nav align-items-center">
        {/* SIDEBAR TOGGLE (REACT CONTROLLED) */}
        <li className="nav-item">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars" />
          </button>
        </li>

        <li className="nav-item d-none d-md-inline-block">
          <NavLink to="/admin" className="nav-link fw-semibold">
            Home
          </NavLink>
        </li>

        <li className="nav-item d-none d-md-inline-block">
          <span className="nav-link text-muted">Contact</span>
        </li>
      </ul>

      {/* ================= RIGHT ================= */}
      <ul className="navbar-nav ms-auto align-items-center">
        {/* SEARCH ICON */}
        <li className="nav-item">
          <span className="nav-link">
            <i className="fas fa-search" />
          </span>
        </li>

        {/* NOTIFICATIONS */}
        <li className="nav-item dropdown">
          <a
            href="#"
            className="nav-link"
            data-bs-toggle="dropdown"
            role="button"
            aria-expanded="false"
          >
            <i className="far fa-bell" />
            <span className="badge bg-warning ms-1">3</span>
          </a>

          <div className="dropdown-menu dropdown-menu-end dropdown-menu-lg">
            <span className="dropdown-item dropdown-header">
              3 Notifications
            </span>

            <div className="dropdown-divider" />

            <span className="dropdown-item">
              <i className="fas fa-envelope me-2" />
              New message
            </span>

            <div className="dropdown-divider" />

            <span className="dropdown-item">
              <i className="fas fa-users me-2" />
              New user registered
            </span>
          </div>
        </li>

        {/* PROFILE */}
        <li className="nav-item dropdown ms-2">
          <a
            href="#"
            className="nav-link"
            data-bs-toggle="dropdown"
            role="button"
            aria-expanded="false"
          >
            <i className="fas fa-user-circle fs-5" />
          </a>

          <div className="dropdown-menu dropdown-menu-end">
            <NavLink to="/admin/profile" className="dropdown-item">
              <i className="fas fa-user me-2" />
              Profile
            </NavLink>

            <div className="dropdown-divider" />

            <button
              type="button"
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
