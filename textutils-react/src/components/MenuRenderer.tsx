import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { SidebarGroup } from "../types/sidebar";
import { usePermission } from "../auth/hooks/usePermission";

type Props = {
  group: SidebarGroup;
  onAction?: (action: string) => void;
};

export default function MenuRenderer({ group, onAction }: Props) {
  const can = usePermission();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  /* ================= PERMISSION FILTER ================= */
  const visibleItems = group.children.filter(
    (item) => !item.permission || can(item.permission)
  );

  /* ================= AUTO OPEN TREE ================= */
  useEffect(() => {
    const shouldOpen = visibleItems.some(
      (item) =>
        item.path &&
        location.pathname.startsWith(item.path)
    );
    if (shouldOpen) setOpen(true);
  }, [location.pathname, visibleItems]);

  if (!visibleItems.length) return null;

  return (
    <li className={`nav-item ${open ? "menu-open" : ""}`}>
      {/* GROUP HEADER */}
      <a
        href="#"
        className={`nav-link ${open ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        <i className={`nav-icon ${group.icon}`} />
        <p>
          {group.label}
          <i className="right fas fa-angle-left" />
        </p>
      </a>

      {/* GROUP ITEMS */}
      <ul
        className="nav nav-treeview"
        style={{ display: open ? "block" : "none" }}
      >
        {visibleItems.map((item) => (
          <li key={item.label} className="nav-item">
            {item.action ? (
              /* ACTION ITEM (e.g. logout) */
              <a
                href="#"
                className="nav-link text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  onAction?.(item.action);
                }}
              >
                <i className="fas fa-sign-out-alt nav-icon" />
                <p>{item.label}</p>
              </a>
            ) : (
              /* NORMAL LINK */
              <NavLink
                to={item.path!}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>{item.label}</p>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}
