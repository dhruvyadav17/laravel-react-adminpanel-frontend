import type { User } from "../types/models";

/**
 * resolveLoginRedirect
 * -----------------------------------
 * SINGLE source of truth for login redirect
 */
export function resolveLoginRedirect(
  user: User | null,
  fromAdminLogin = false
): string {
  const roles = user?.roles ?? [];

  const isAdmin =
    roles.includes("super-admin") ||
    roles.includes("admin") ||
    roles.includes("manager");

  if (fromAdminLogin) {
    return "/admin/dashboard";
  }

  return isAdmin ? "/admin/dashboard" : "/profile";
}
