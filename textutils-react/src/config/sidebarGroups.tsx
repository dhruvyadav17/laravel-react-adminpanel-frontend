// src/config/sidebarGroups.tsx

import { SidebarGroup } from "../types/sidebar";
import { adminAppRoutes } from "./appRoutes";
import { ROUTE_GROUPS } from "../constants/routeGroups";

/**
 * Sidebar Groups
 * -------------------------------------------------
 * - Derived from adminAppRoutes (single source)
 * - Grouped via ROUTE_GROUPS
 * - Permission-aware (handled in MenuRenderer)
 * - AdminLTE 3 friendly
 */

export const sidebarGroups: SidebarGroup[] = [
  /* ================= USER MANAGEMENT ================= */
  {
    label: "User Management",
    icon: "fas fa-users",
    showInMenu: true,
    children: adminAppRoutes
      .filter(
        (r) =>
          r.showInMenu &&
          r.group === ROUTE_GROUPS.USER_MANAGEMENT
      )
      .map((r) => ({
        label: r.label!,            // safe because showInMenu
        path: `/admin/${r.path}`,   // Admin base path
        permission: r.permission,
      })),
  },

  /* ================= SETTINGS ================= */
  {
    label: "Settings",
    icon: "fas fa-cogs",
    showInMenu: true,
    children: [
      ...adminAppRoutes
        .filter(
          (r) =>
            r.showInMenu &&
            r.group === ROUTE_GROUPS.SETTINGS
        )
        .map((r) => ({
          label: r.label!,
          path: `/admin/${r.path}`,
          permission: r.permission,
        })),

      // ----- ACTION ITEM (no route) -----
      {
        label: "Logout",
        action: "logout",
      },
    ],
  },
];
