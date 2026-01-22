import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarGroup } from "../types/sidebar";

type Props = {
  group: SidebarGroup;
  onAction?: (action: string) => void;
};

export default function MenuRenderer({
  group,
  onAction,
}: Props) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const items = group.children ?? [];

  /* ================= AUTO OPEN ACTIVE GROUP ================= */

  useEffect(() => {
    const shouldOpen = items.some(
      (item) =>
        item.path &&
        location.pathname.startsWith(item.path)
    );

    if (shouldOpen) setOpen(true);
  }, [location.pathname, items]);

  if (!items.length) return null;

  /* ================= RENDER ================= */

  return (
    <li className={`nav-item ${open ? "menu-open" : ""}`}>
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

      <ul
        className="nav nav-treeview"
        style={{ display: open ? "block" : "none" }}
      >
        {items.map((item) => (
          <li key={item.label} className="nav-item">
            {item.action ? (
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
              <NavLink
                to={item.path!}
                className="nav-link"
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
