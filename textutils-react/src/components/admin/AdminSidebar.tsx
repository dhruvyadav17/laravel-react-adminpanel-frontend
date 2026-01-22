import MenuRenderer from "../MenuRenderer";
import { useGetSidebarQuery } from "../../features/sidebar/sidebar.api";
import { useLogout } from "../../auth/hooks/useLogout";
import { SidebarGroup } from "../types/sidebar";

export default function AdminSidebar() {
  const logout = useLogout();
  const { data } = useGetSidebarQuery();

  const groups: SidebarGroup[] = data ?? [];

  const handleAction = (action: string) => {
    if (action === "logout") {
      logout("/admin/login");
    }
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <div className="sidebar">
        <nav>
          <ul className="nav nav-pills nav-sidebar flex-column">
            {groups.map((group) => (
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
