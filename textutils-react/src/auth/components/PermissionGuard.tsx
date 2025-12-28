import { usePermission } from "../hooks/usePermission";

export default function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: JSX.Element;
}) {
  const can = usePermission();

  return can(permission) ? children : null;
}
