import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { logoutThunk } from "../store/authSlice";
import { useAuth } from "../auth/hooks/useAuth";
import { usePermission } from "../auth/hooks/usePermission";
import { PERMISSIONS } from "../constants/permissions";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAdmin } = useAuth();
  const can = usePermission();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate(isAdmin ? "/admin/login" : "/login", {
      replace: true,
    });
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        isAdmin ? "navbar-dark bg-dark" : "navbar-light bg-primary"
      }`}
    >
      <div className="container">
        {/* BRAND */}
        <NavLink
          className="navbar-brand"
          to={isAdmin ? "/admin/dashboard" : "/profile"}
        >
          {isAdmin ? "Admin Panel" : "User Panel"}
        </NavLink>

        {/* MENU (NO COLLAPSE ISSUE) */}
        <ul className="navbar-nav ms-auto align-items-center">
          {/* USER MENU */}
          {!isAdmin && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/roles">
                  My Roles
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/permissions">
                  My Permissions
                </NavLink>
              </li>
            </>
          )}

          {/* ADMIN MENU */}
          {isAdmin && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/dashboard">
                  Dashboard
                </NavLink>
              </li>

              {can(PERMISSIONS.USER_VIEW) && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/users">
                    Users
                  </NavLink>
                </li>
              )}

              {can(PERMISSIONS.ROLE_MANAGE) && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/roles">
                    Roles
                  </NavLink>
                </li>
              )}

              {can(PERMISSIONS.PERMISSION_MANAGE) && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/admin/permissions"
                  >
                    Permissions
                  </NavLink>
                </li>
              )}
            </>
          )}

          {/* LOGOUT */}
          <li className="nav-item ms-3">
            <button
              className="btn btn-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
