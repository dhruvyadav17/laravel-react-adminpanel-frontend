import MenuRenderer from "../../components/MenuRenderer";
import { useGetSidebarQuery } from "../../store/api";
import type { SidebarGroup } from "../../types/sidebar";

export default function AdminSidebar() {
  const { data: groups = [] } = useGetSidebarQuery();

  return (
    <>
      {/* ================= BRAND ================= */}
      <a href="/admin" className="brand-link">
        <span className="brand-text fw-light">
          <b>Admin</b>LTE 4
        </span>
      </a>

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            role="menu"
            data-lte-toggle="treeview"
            data-accordion="false"
          >
            {groups.map((group: SidebarGroup) => (
              <MenuRenderer
                key={group.label}
                group={group}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
