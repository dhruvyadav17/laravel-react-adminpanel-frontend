import { NavLink } from "react-router-dom";
import { useLogout } from "../../auth/hooks/useLogout";

export default function AdminNavbar() {
  const logout = useLogout();

  const toggleSidebar = () => {
    const body = document.body;

    // 📱 Mobile
    if (window.innerWidth < 992) {
      body.classList.toggle("sidebar-open");
      body.classList.remove("sidebar-collapse");
    }
    // 🖥 Desktop
    else {
      body.classList.toggle("sidebar-collapse");
      body.classList.remove("sidebar-open");
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* ================= LEFT ================= */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            type="button"
            className="nav-link sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars" />
          </button>
        </li>

        <li className="nav-item d-none d-sm-inline-block">
          <NavLink to="/admin" className="nav-link">
            Home
          </NavLink>
        </li>

        <li className="nav-item d-none d-sm-inline-block">
          <a href="#" className="nav-link">
            Contact
          </a>
        </li>
      </ul>

      {/* ================= RIGHT ================= */}
      <ul className="navbar-nav ms-auto">
        {/* Search */}
        <li className="nav-item">
          <a href="#" className="nav-link">
            <i className="fas fa-search" />
          </a>
        </li>

        {/* Notifications */}
        <li className="nav-item dropdown">
          <a
            href="#"
            className="nav-link"
            data-bs-toggle="dropdown"
            role="button"
            aria-expanded="false"
          >
            <i className="far fa-bell" />
            <span className="badge bg-warning navbar-badge">3</span>
          </a>

          <div className="dropdown-menu dropdown-menu-end dropdown-menu-lg">
            <span className="dropdown-item dropdown-header">
              3 Notifications
            </span>

            <div className="dropdown-divider" />

            <a href="#" className="dropdown-item">
              <i className="fas fa-envelope me-2" /> New message
            </a>

            <div className="dropdown-divider" />

            <a href="#" className="dropdown-item">
              <i className="fas fa-users me-2" /> New user registered
            </a>
          </div>
        </li>

        {/* Profile */}
        <li className="nav-item dropdown">
          <a
            href="#"
            className="nav-link profile-btn"
            data-bs-toggle="dropdown"
            role="button"
            aria-expanded="false"
          >
            <i className="fas fa-user-circle fa-lg" />
          </a>

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
