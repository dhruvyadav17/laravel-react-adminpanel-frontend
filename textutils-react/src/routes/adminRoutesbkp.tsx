import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Roles from "../pages/admin/Roles";
import Permissions from "../pages/admin/Permissions";
import Profile from "../pages/user/Profile";
import { PERMISSIONS } from "../constants/permissions";

export const adminRoutes = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "profile", element: <Profile /> },

  {
    path: "users",
    element: <Users />,
    permission: PERMISSIONS.USER.VIEW,
  },
  {
    path: "roles",
    element: <Roles />,
    permission: PERMISSIONS.ROLE.MANAGE,
  },
  {
    path: "permissions",
    element: <Permissions />,
    permission: PERMISSIONS.PERMISSION.MANAGE,
  },
];
