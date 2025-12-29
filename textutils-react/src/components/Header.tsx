import { Link } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { usePermission } from "../auth/hooks/usePermission";
import { ADMIN_MENU, USER_MENU } from "../config/menu";

export default function Header() {
  const { isAdmin } = useAuth();
  const can = usePermission();

  const menu = isAdmin ? ADMIN_MENU : USER_MENU;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Admin Panel
        </Link>

        <div className="navbar-nav">
          {menu.map(
            (m) =>
              (!m.permission || can(m.permission)) && (
                <Link
                  key={m.path}
                  to={m.path}
                  className="nav-link"
                >
                  {m.label}
                </Link>
              )
          )}
        </div>
      </div>
    </nav>
  );
}
