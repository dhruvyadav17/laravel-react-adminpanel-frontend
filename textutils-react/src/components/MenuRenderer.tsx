import { Link } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

type MenuItem = {
  label: string;
  path: string;
  permission?: string;
};

type Props = {
  items: MenuItem[];
};

/**
 * MenuRenderer
 * -----------------------------------------
 * Renders menu items with permission checks
 * Reusable for header, sidebar, mobile menu
 */
export default function MenuRenderer({ items }: Props) {
  const { can } = useAuth();

  return (
    <>
      {items
        .filter(
          (item) =>
            !item.permission || can(item.permission)
        )
        .map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="nav-link"
          >
            {item.label}
          </Link>
        ))}
    </>
  );
}
