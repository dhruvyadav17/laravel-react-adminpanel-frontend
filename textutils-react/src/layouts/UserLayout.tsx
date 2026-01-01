// src/layouts/UserLayout.tsx

import { Outlet } from "react-router-dom";

/**
 * UserLayout
 * -------------------------------------------------
 * - Layout for non-admin (user) pages
 * - No AdminLTE sidebar / navbar
 * - Clean, Bootstrap-4 compatible
 *
 * Future:
 * - UserNavbar can be added here
 */

export default function UserLayout() {
  return (
    <div className="container-fluid mt-3">
      <Outlet />
    </div>
  );
}
