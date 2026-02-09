import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { SidebarGroup } from "../types/sidebar";
import { useLogout } from "../auth/hooks/useLogout";

type Props = {
  group: SidebarGroup;
};

export default function MenuRenderer({ group }: Props) {
  const location = useLocation();
  const logout = useLogout();

  const items = group.children ?? [];
  if (!items.length) return null;

  const isActive = items.some(
    i => i.path && location.pathname.startsWith(i.path)
  );

  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);

  return (
    <li className={`nav-item ${open ? "menu-open" : ""}`}>
      <a
        href="#"
        className={`nav-link ${isActive ? "active" : ""}`}
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

      <ul className="nav nav-treeview">
        {items.map(item => {
          if (item.action === "logout") {
            return (
              <li key={item.label} className="nav-item">
                <a
                  href="#"
                  className="nav-link text-danger"
                  onClick={e => {
                    e.preventDefault();
                    logout("/admin/login");
                  }}
                >
                  <i className="fas fa-sign-out-alt nav-icon" />
                  <p>{item.label}</p>
                </a>
              </li>
            );
          }

          return (
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
          );
        })}
      </ul>
    </li>
  );
}
