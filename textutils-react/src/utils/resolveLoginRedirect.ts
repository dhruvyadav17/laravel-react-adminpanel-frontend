import type { User } from "../types/models";

/**
 * resolveLoginRedirect
 * --------------------------------
 * Central login redirect logic
 */
export function resolveLoginRedirect(user: User | null) {
  if (!user) return "/login";

  const roles = user.roles ?? [];

  if (roles.includes("super-admin") || roles.includes("admin")) {
    return "/admin/dashboard";
  }

  return "/profile";
}
