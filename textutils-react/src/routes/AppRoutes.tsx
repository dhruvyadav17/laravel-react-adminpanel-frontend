import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Unauthorized from "../pages/errors/Unauthorized";
import NotFound from "../pages/errors/NotFound";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import Guard from "../auth/guards/Guard";

import { adminAppRoutes, userAppRoutes } from "../config/appRoutes";

import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login admin />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* USER */}
      <Route element={<Guard />}>
        <Route element={<UserLayout />}>
          {userAppRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>
      </Route>

      {/* ADMIN */}
      <Route element={<Guard admin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {adminAppRoutes.map((r) => (
            <Route
              key={r.path}
              element={
                r.permission ? <Guard permission={r.permission} /> : <Guard />
              }
            >
              <Route path={r.path} element={r.element} />
            </Route>
          ))}
        </Route>
      </Route>

      {/* ERRORS */}
      <Route path="/admin/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
