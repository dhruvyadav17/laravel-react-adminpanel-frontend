import { NavLink } from "react-router-dom";

import { useLogout } from "../../auth/hooks/useLogout";

export default function AdminNavbar() {
  const logout = useLogout();

  const toggleSidebar = () => {
    document.body.classList.toggle("sidebar-collapse");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* LEFT */}
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

      {/* RIGHT */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          {/* 🔥 IMPORTANT: button instead of <a href="#"> */}
          <button
            className="nav-link btn btn-link"
            data-toggle="dropdown"
            type="button"
          >
            <i className="fas fa-user-circle" />
          </button>

          <div className="dropdown-menu dropdown-menu-right">
            {/* ✅ PROFILE WORKS */}
            <NavLink
              to="/admin/profile"
              className="dropdown-item"
            >
              <i className="fas fa-user mr-2" />
              Profile
            </NavLink>

            <div className="dropdown-divider" />

            {/* ✅ LOGOUT WORKS */}
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
