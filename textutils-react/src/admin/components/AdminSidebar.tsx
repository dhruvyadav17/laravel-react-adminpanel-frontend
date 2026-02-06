import MenuRenderer from "../../components/MenuRenderer";
import { useGetSidebarQuery } from "../../store/api";
import { useLogout } from "../../auth/hooks/useLogout";
import type { SidebarGroup } from "../../types/sidebar";

export default function AdminSidebar() {
  const logout = useLogout();
  const { data: groups = [] } = useGetSidebarQuery();

  const onAction = (action?: string) => {
    if (action === "logout") logout("/admin/login");
  };

  return (
    <>
      {/* BRAND */}
      <a href="/admin/dashboard" className="brand-link">
        <span className="brand-text fw-semibold">
          Admin Panel
        </span>
      </a>

      {/* MENU */}
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-sidebar flex-column"
            role="menu"
          >
            {groups.map((group: SidebarGroup) => (
              <MenuRenderer
                key={group.label}
                group={group}
                onAction={onAction}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
