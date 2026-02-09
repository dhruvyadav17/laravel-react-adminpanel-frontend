import MenuRenderer from "../../components/MenuRenderer";
import { useGetSidebarQuery } from "../../store/api";

export default function AdminSidebar() {
  const { data: groups = [] } = useGetSidebarQuery();

  return (
    <div className="sidebar">
      {/* BRAND */}
      <a href="/admin/dashboard" className="brand-link">
        <span className="brand-text">
          <b>Admin</b>LTE 4
        </span>
      </a>

      {/* MENU */}
      <nav className="mt-2">
        <ul
          className="nav nav-pills nav-sidebar flex-column"
          data-lte-toggle="treeview"
          role="menu"
        >
          {groups.map(group => (
            <MenuRenderer key={group.label} group={group} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
