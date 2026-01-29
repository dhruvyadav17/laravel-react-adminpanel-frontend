import { RouteObject, Navigate } from "react-router-dom";
import AdminGuard from "../../guards/AdminGuard";
import PermissionGuard from "../../guards/PermissionGuard";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../features/dashboard/Dashboard";
import Users from "../features/users/UsersPage";
import Roles from "../features/roles/RolesPage";
import PermissionsPage from "../features/permissions/PermissionsPage";
import AdminProfilePage from "../pages/Profile/AdminProfilePage";

import { PERMISSIONS } from "../../constants/permissions";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <AdminProfilePage /> },

          {
            element: (
              <PermissionGuard permission={PERMISSIONS.USER.VIEW} />
            ),
            children: [{ path: "users", element: <Users /> }],
          },

          {
            element: (
              <PermissionGuard permission={PERMISSIONS.ROLE.MANAGE} />
            ),
            children: [{ path: "roles", element: <Roles /> }],
          },

          {
            element: (
              <PermissionGuard
                permission={PERMISSIONS.PERMISSION.MANAGE}
              />
            ),
            children: [{ path: "permissions", element: <PermissionsPage /> }],
          },
        ],
      },
    ],
  },
];
