import { NavLink, useLocation } from "react-router-dom";
import type { SidebarGroup } from "../types/sidebar";

type Props = {
  group: SidebarGroup;
  onAction?: (action: string) => void;
};

export default function MenuRenderer({ group, onAction }: Props) {
  const location = useLocation();
  const items = group.children ?? [];

  if (!items.length) return null;

  const isGroupActive = items.some(
    (item) =>
      item.path &&
      location.pathname.startsWith(item.path)
  );

  return (
    <li className={`nav-item ${isGroupActive ? "menu-open" : ""}`}>
      <a
        href="#"
        className={`nav-link ${isGroupActive ? "active" : ""}`}
      >
        <i className={`nav-icon ${group.icon}`} />
        <p>
          {group.label}
          <i className="right fa-solid fa-angle-left" />
        </p>
      </a>

      <ul className="nav nav-treeview">
        {items.map((item) => {
          const active =
            item.path &&
            location.pathname.startsWith(item.path);

          return (
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
                  <i className="fa-solid fa-right-from-bracket nav-icon" />
                  <p>{item.label}</p>
                </a>
              ) : (
                <NavLink
                  to={item.path!}
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  <i className="fa-regular fa-circle nav-icon" />
                  <p>{item.label}</p>
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}
