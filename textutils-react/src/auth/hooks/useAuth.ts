import { useSelector } from "react-redux";
import { RootState } from "../../store";

/**
 * Central Auth Hook
 * Single source of truth for:
 * - user
 * - roles
 * - permissions
 * - auth helpers
 */
export function useAuth() {
  const user = useSelector((s: RootState) => s.auth.user);
  const permissions = useSelector(
    (s: RootState) => s.auth.permissions
  );

  const roles: string[] = user?.roles ?? [];

  /* ================= BASIC FLAGS ================= */

  const isAuth = Boolean(user);
  const isSuperAdmin = roles.includes("super-admin");
  const isAdmin =
    isSuperAdmin || roles.includes("admin");

  /* ================= ROLE HELPERS ================= */

  const hasRole = (role: string) =>
    isSuperAdmin || roles.includes(role);

  const hasAnyRole = (checkRoles: string[]) =>
    isSuperAdmin ||
    checkRoles.some((r) => roles.includes(r));

  /* ================= PERMISSION HELPERS ================= */

  const can = (permission: string) =>
    isSuperAdmin || permissions.includes(permission);

  const canAny = (checkPermissions: string[]) =>
    isSuperAdmin ||
    checkPermissions.some((p) =>
      permissions.includes(p)
    );

  return {
    /* state */
    user,
    roles,
    permissions,

    /* auth flags */
    isAuth,
    isAdmin,
    isSuperAdmin,

    /* helpers */
    hasRole,
    hasAnyRole,
    can,
    canAny,
  };
}
