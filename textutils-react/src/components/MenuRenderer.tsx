import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { SidebarGroup } from "../types/sidebar";

type Props = {
  group: SidebarGroup;
};

export default function MenuRenderer({ group }: Props) {
  const location = useLocation();
  const items = group.children ?? [];

  if (!items.length) return null;

  // route-based active check (AdminLTE style)
  const isRouteActive = items.some(
    item => item.path && location.pathname.startsWith(item.path)
  );

  const [open, setOpen] = useState(isRouteActive);

  // auto-open when route changes
  useEffect(() => {
    setOpen(isRouteActive);
  }, [isRouteActive]);

  return (
    <li className={`nav-item ${open ? "menu-open" : ""}`}>
      {/* ===== PARENT ===== */}
      <a
        href="#"
        className={`nav-link ${open ? "active" : ""}`}
        onClick={e => {
          e.preventDefault();
          setOpen(v => !v);
        }}
      >
        <i className={`nav-icon ${group.icon}`} />
        <p>
          {group.label}
          <i className="right fas fa-angle-left" />
        </p>
      </a>

      {/* ===== SUB MENU ===== */}
      <ul className="nav nav-treeview">
        {items.map(item => (
          <li key={item.label} className="nav-item">
            <NavLink
              to={item.path!}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>{item.label}</p>
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
}
