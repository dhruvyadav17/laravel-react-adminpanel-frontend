import { Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Login from "../pages/auth/Login";
import AdminLogin from "../pages/admin/AdminLogin";

import Profile from "../pages/user/Profile";
import AdminProfile from "../pages/admin/Profile";

import UserGuard from "../auth/UserGuard";
import AdminGuard from "../auth/AdminGuard";
import Roles from "../pages/admin/Roles";
import Users from "../pages/admin/Users";
// import Dashboard from "../pages/admin/Dashboard";
import Permissions from "../pages/admin/Permissions";
import UserRoles from "../pages/user/UserRoles";
import UserPermissions from "../pages/user/UserPermissions";
export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* USER */}
    <Route element={<UserGuard />}>
      <Route element={<UserLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/roles" element={<UserRoles />} />
        <Route path="/permissions" element={<UserPermissions />} />
      </Route>
    </Route>

      {/* ADMIN */}
      <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="profile" />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permissions" element={<Permissions />} />
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="users" element={<Users />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
