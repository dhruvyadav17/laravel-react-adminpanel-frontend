import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logoutThunk } from "../store/authSlice";
export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, permissions } = useSelector(
    (state: RootState) => state.auth
  );

  const isAdmin =
    user?.roles?.includes("admin") ||
    user?.roles?.includes("super-admin");

  const hasPermission = (perm: string) =>
    permissions.includes(perm) || isAdmin;

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate(isAdmin ? "/admin/login" : "/login", {
      replace: true,
    });
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        isAdmin
          ? "navbar-dark bg-dark"
          : "navbar-light bg-primary"
      }`}
    >
      <div className="container">
        {/* BRAND */}
        <NavLink
          className="navbar-brand"
          to={isAdmin ? "/admin/profile" : "/profile"}
        >
          {isAdmin ? "Admin Panel" : "User Panel"}
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* ================= USER MODE ================= */}
            {!isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    My Profile
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

            {/* ================= ADMIN MODE ================= */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/admin/profile"
                  >
                    Admin Profile
                  </NavLink>
                </li>

                {hasPermission("user-view") && (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/admin/users"
                    >
                      Users
                    </NavLink>
                  </li>
                )}

                {hasPermission("role-manage") && (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/admin/roles"
                    >
                      Roles
                    </NavLink>
                  </li>
                )}

                {hasPermission("role-manage") && (
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
      </div>
    </nav>
  );
}
