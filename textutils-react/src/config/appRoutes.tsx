// src/config/appRoutes.ts

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Roles from "../pages/admin/Roles";
import PermissionsPage from "../pages/admin/PermissionsPage";
import Profile from "../pages/user/Profile";
import UserRoles from "../pages/user/UserRoles";

import { PERMISSIONS } from "../constants/permissions";
import { RouteGroup, ROUTE_GROUPS } from "../constants/routeGroups";

export type AppRoute = {
  label?: string;
  path: string;
  element: JSX.Element;
  permission?: string;
  admin?: boolean;
  showInMenu?: boolean;
  group?: RouteGroup;
};

/* ================= ADMIN ROUTES ================= */
export const adminAppRoutes: AppRoute[] = [
  {
    label: "Dashboard",
    path: "dashboard",
    element: <Dashboard />,
    admin: true,
    showInMenu: true,
    group: ROUTE_GROUPS.SETTINGS,
  },
  {
    label: "Profile",
    path: "profile",
    element: <Profile />,
    admin: true,
    showInMenu: true,
    group: ROUTE_GROUPS.SETTINGS,
  },
  {
    label: "Users",
    path: "users",
    element: <Users />,
    admin: true,
    permission: PERMISSIONS.USER.VIEW,
    showInMenu: true,
    group: ROUTE_GROUPS.USER_MANAGEMENT, // 🔥 FIX
  },
  {
    label: "Roles",
    path: "roles",
    element: <Roles />,
    admin: true,
    permission: PERMISSIONS.ROLE.MANAGE,
    showInMenu: true,
    group: ROUTE_GROUPS.USER_MANAGEMENT, // 🔥 FIX
  },
  {
    label: "Permissions",
    path: "permissions",
    element: <PermissionsPage />,
    admin: true,
    permission: PERMISSIONS.PERMISSION.MANAGE,
    showInMenu: true,
    group: ROUTE_GROUPS.USER_MANAGEMENT, // 🔥 FIX
  },
];

/* ================= USER ROUTES ================= */
export const userAppRoutes: AppRoute[] = [
  {
    label: "Profile",
    path: "profile",
    element: <Profile />,
    showInMenu: true,
  },
  {
    label: "My Roles",
    path: "roles",
    element: <UserRoles />,
    showInMenu: true,
  },
];
