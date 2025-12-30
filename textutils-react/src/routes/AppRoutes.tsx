import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH PAGES (NO HEADER) */
import Login from "../pages/auth/Login";
import AdminLogin from "../pages/admin/AdminLogin";

/* LAYOUTS */
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

/* GUARDS */
import UserGuard from "../auth/guards/UserGuard";
import AdminGuard from "../auth/guards/AdminGuard";
import PermissionRoute from "../auth/guards/PermissionRoute";

/* USER PAGES */
import Profile from "../pages/user/Profile";
import UserRoles from "../pages/user/UserRoles";
//import UserPermissions from "../pages/user/UserPermissions";

/* ADMIN PAGES */
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Roles from "../pages/admin/Roles";
import Permissions from "../pages/admin/Permissions";

/* CONSTANTS */
import { PERMISSIONS } from "../constants/permissions";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ========== AUTH (NO HEADER) ========== */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ========== USER (HEADER ENABLED) ========== */}
      <Route element={<UserGuard />}>
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/roles" element={<UserRoles />} />
          {/* <Route path="/permissions" element={<UserPermissions />} /> */}
        </Route>
      </Route>

      {/* ========== ADMIN (HEADER ENABLED) ========== */}
      <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />

          <Route
            element={
              <PermissionRoute permission={PERMISSIONS.USER.VIEW} />
            }
          >
            <Route path="users" element={<Users />} />
          </Route>

          <Route
            element={
              <PermissionRoute permission={PERMISSIONS.ROLE.MANAGE} />
            }
          >
            <Route path="roles" element={<Roles />} />
          </Route>

          <Route
            element={
              <PermissionRoute permission={PERMISSIONS.PERMISSION.MANAGE} />
            }
          >
            <Route path="permissions" element={<Permissions />} />
          </Route>
        </Route>
      </Route>

      {/* ========== FALLBACK ========== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
