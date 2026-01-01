import { NavLink } from "react-router-dom";

import { sidebarGroups } from "../../config/sidebarGroups";
import MenuRenderer from "./../MenuRenderer";
import { useLogout } from "../../auth/hooks/useLogout";

export default function AdminSidebar() {
  const logout = useLogout();

  // 🔥 CENTRAL ACTION HANDLER (logout etc.)
  const handleAction = (action: string) => {
    if (action === "logout") {
      logout("/admin/login");
    }
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* BRAND */}
      <NavLink to="/admin/dashboard" className="brand-link">
        <span className="brand-text font-weight-bold ml-2">
          Admin Panel
        </span>
      </NavLink>

      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column">
            {sidebarGroups.map((group) => (
              <MenuRenderer
                key={group.label}
                group={group}
                onAction={handleAction}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
