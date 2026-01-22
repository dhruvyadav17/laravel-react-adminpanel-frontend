import { useSelector } from "react-redux";
import { RootState } from "../../store";

/**
 * useAuth
 * -------------------------------------------------
 * Single source of truth for:
 * - user
 * - roles
 * - permissions
 * - role & permission helpers
 *
 * ❗ RULE:
 * - Never access permissions array directly in UI
 * - Always use can() / canAny()
 */
export function useAuth() {
  /* ================= STORE ================= */

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const permissions = useSelector(
    (state: RootState) => state.auth.permissions
  );

  const roles: string[] = user?.roles ?? [];

  /* ================= BASIC FLAGS ================= */

  const isAuth = Boolean(user);

  const isSuperAdmin = roles.includes("super-admin");

  const isAdmin =
    isSuperAdmin || roles.includes("admin");

  /* ================= ROLE HELPERS ================= */

  /**
   * Check single role
   */
  const hasRole = (role: string): boolean =>
    isSuperAdmin || roles.includes(role);

  /**
   * Check multiple roles (OR condition)
   */
  const hasAnyRole = (
    checkRoles: string[]
  ): boolean =>
    isSuperAdmin ||
    checkRoles.some((r) => roles.includes(r));

  /* ================= PERMISSION HELPERS ================= */

  /**
   * Check single permission
   */
  const can = (permission: string): boolean =>
    isSuperAdmin ||
    permissions.includes(permission);

  /**
   * Check multiple permissions (OR condition)
   */
  const canAny = (
    checkPermissions: string[]
  ): boolean =>
    isSuperAdmin ||
    checkPermissions.some((p) =>
      permissions.includes(p)
    );

  /* ================= RETURN API ================= */

  return {
    /* raw state (read-only) */
    user,
    roles,
    permissions,

    /* auth flags */
    isAuth,
    isAdmin,
    isSuperAdmin,

    /* role helpers */
    hasRole,
    hasAnyRole,

    /* permission helpers */
    can,
    canAny,
  };
}
