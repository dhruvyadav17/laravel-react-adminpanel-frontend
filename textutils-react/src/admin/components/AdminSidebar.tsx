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
      {/* ===== BRAND ===== */}
      <a href="/admin/dashboard" className="brand-link">
        <span className="brand-text fw-semibold">
          Admin Panel
        </span>
      </a>

      {/* ===== SIDEBAR MENU ===== */}
      <div className="sidebar">
        <nav>
          <ul
            className="nav nav-sidebar flex-column"
            role="menu"
            data-widget="treeview"
            data-accordion="false"
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
