import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Roles from "../pages/admin/Roles";
import Permissions from "../pages/admin/Permissions";
import Profile from "../pages/user/Profile";
import UserRoles from "../pages/user/UserRoles";
import { PERMISSIONS } from "../constants/permissions";

export type AppRoute = {
  label?: string;            // menu label (optional)
  path: string;
  element: JSX.Element;
  permission?: string;       // permission guard
  admin?: boolean;           // admin-only
  showInMenu?: boolean;      // menu visibility
};

/* ================= ADMIN ROUTES ================= */
export const adminAppRoutes: AppRoute[] = [
  {
    label: "Dashboard",
    path: "dashboard",
    element: <Dashboard />,
    admin: true,
    showInMenu: true,
  },
  {
    label: "Profile",
    path: "profile",
    element: <Profile />,
    admin: true,
    showInMenu: true,
  },
  {
    label: "Users",
    path: "users",
    element: <Users />,
    admin: true,
    permission: PERMISSIONS.USER.VIEW,
    showInMenu: true,
  },
  {
    label: "Roles",
    path: "roles",
    element: <Roles />,
    admin: true,
    permission: PERMISSIONS.ROLE.MANAGE,
    showInMenu: true,
  },
  {
    label: "Permissions",
    path: "permissions",
    element: <Permissions />,
    admin: true,
    permission: PERMISSIONS.PERMISSION.MANAGE,
    showInMenu: true,
  },
];

/* ================= USER ROUTES ================= */
export const userAppRoutes: AppRoute[] = [
  {
    label: "Profile",
    path: "/profile",
    element: <Profile />,
    showInMenu: true,
  },
  {
    label: "My Roles",
    path: "/roles",
    element: <UserRoles />,
    showInMenu: true,
  },
];
