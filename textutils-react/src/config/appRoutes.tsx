// src/config/appRoutes.tsx

import { lazy } from "react";
import Profile from "../pages/user/Profile";
import UserRoles from "../pages/user/UserRoles";
import { PERMISSIONS } from "../constants/permissions";

// 🔹 Lazy loaded admin pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Users = lazy(() => import("../pages/admin/Users"));
const Roles = lazy(() => import("../pages/admin/Roles"));
const PermissionsPage = lazy(
  () => import("../pages/admin/PermissionsPage")
);

export type AppRoute = {
  path: string;
  element: JSX.Element;
  permission?: string;
  admin?: boolean;
};

/* ================= ADMIN ROUTES ================= */
export const adminAppRoutes: AppRoute[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
    admin: true,
  },
  {
    path: "profile",
    element: <Profile />,
    admin: true,
  },
  {
    path: "users",
    element: <Users />,
    admin: true,
    permission: PERMISSIONS.USER.VIEW,
  },
  {
    path: "roles",
    element: <Roles />,
    admin: true,
    permission: PERMISSIONS.ROLE.MANAGE,
  },
  {
    path: "permissions",
    element: <PermissionsPage />,
    admin: true,
    permission: PERMISSIONS.PERMISSION.MANAGE,
  },
];

/* ================= USER ROUTES ================= */
export const userAppRoutes: AppRoute[] = [
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "roles",
    element: <UserRoles />,
  },
];
