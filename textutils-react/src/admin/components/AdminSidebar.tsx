import MenuRenderer from "../../components/MenuRenderer";
import { useGetSidebarQuery } from "../../store/api";
import type { SidebarGroup } from "../../types/sidebar";

export default function AdminSidebar() {
  const { data: groups = [] } = useGetSidebarQuery();

  return (
    <div className="sidebar-wrapper">
      {/* BRAND */}
      <div className="sidebar-brand px-3 py-2 fw-semibold">
        <a href="/admin" className="text-reset text-decoration-none">
          <b>Admin</b>LTE 4
        </a>
      </div>

      {/* MENU */}
      <nav className="mt-2">
        <ul className="nav sidebar-menu flex-column">
          {groups.map((group: SidebarGroup) => (
            <MenuRenderer
              key={group.label}
              group={group}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
