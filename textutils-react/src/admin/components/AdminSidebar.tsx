import MenuRenderer from "../../components/MenuRenderer";
import { useGetSidebarQuery } from "../../store/api";

export default function AdminSidebar() {
  const { data: groups = [] } = useGetSidebarQuery();

  return (
    <div className="sidebar">
      <a href="/admin/dashboard" className="brand-link">
        <span className="brand-text fw-semibold">
          <b>Admin</b>LTE 4
        </span>
      </a>

      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
          {groups.map(group => (
            <MenuRenderer key={group.label} group={group} />
          ))}
        </ul>
      </nav>
    </div>
  );
}

