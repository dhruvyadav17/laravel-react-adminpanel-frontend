import MenuRenderer from "../../components/MenuRenderer";
import { useGetSidebarQuery } from "../../store/api";
import { useLogout } from "../../auth/hooks/useLogout";
import { SidebarGroup } from "../../types/sidebar";

export default function AdminSidebar() {
  const logout = useLogout();

  // 🔥 SAFE: always array
  const { data: groups = [] } = useGetSidebarQuery();

  const handleAction = (action?: string) => {
    if (action === "logout") {
      logout("/admin/login");
    }
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <div className="sidebar">
        <nav>
          <ul className="nav nav-pills nav-sidebar flex-column">
            {groups.map((group: SidebarGroup) => (
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
