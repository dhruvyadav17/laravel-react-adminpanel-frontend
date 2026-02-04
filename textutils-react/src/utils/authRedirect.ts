import type { User } from "../types/models";

/**
 * Resolve post-login redirect
 * ------------------------------------
 * RULES:
 * - Admin login page → /admin/dashboard
 * - Normal login:
 *    - Admin → /admin/dashboard
 *    - User  → /profile
 */
export function resolveLoginRedirect(
  user: User | null,
  fromAdminLogin: boolean
): string {
  if (!user) return "/login";

  /**
   * 🛡 Normalize roles
   * - backend safe
   * - impersonation safe
   */
  const roles: string[] = Array.isArray(user.roles)
    ? user.roles
    : [];

  const isAdmin =
    roles.includes("super-admin") ||
    roles.includes("admin");

  /* 🔥 ADMIN LOGIN PAGE ALWAYS → ADMIN */
  if (fromAdminLogin) {
    return isAdmin
      ? "/admin/dashboard"
      : "/profile";
  }

  /* 🔥 NORMAL LOGIN */
  return isAdmin
    ? "/admin/dashboard"
    : "/profile";
}
