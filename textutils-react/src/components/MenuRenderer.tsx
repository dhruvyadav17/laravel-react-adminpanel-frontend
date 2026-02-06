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

  // 🔍 check if any child route is active
  const isRouteActive = items.some(
    (item) =>
      item.path &&
      location.pathname.startsWith(item.path)
  );

  const [open, setOpen] = useState(isRouteActive);

  // 🔄 auto open on route change
  useEffect(() => {
    setOpen(isRouteActive);
  }, [isRouteActive]);

  return (
    <li className={`nav-item ${open ? "menu-open" : ""}`}>
      {/* ===== PARENT ===== */}
      <button
        type="button"
        className={`nav-link ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        style={{ background: "none", border: "none", width: "100%" }}
      >
        <i className={`nav-icon ${group.icon}`} />
        <p>
          {group.label}
          <i
            className={`right fas fa-angle-left ${
              open ? "rotate-90" : ""
            }`}
          />
        </p>
      </button>

      {/* ===== SUB MENU ===== */}
      <ul
        className="nav nav-treeview"
        style={{ display: open ? "block" : "none" }}
      >
        {items.map((item) => (
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
