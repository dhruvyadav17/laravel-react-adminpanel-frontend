// src/layouts/UserLayout.tsx

import { Outlet } from "react-router-dom";
import Header from "../components/Header";

/**
 * UserLayout
 * -----------------------------------------
 * - Renders user header
 * - Hosts user pages
 */
export default function UserLayout() {
  return (
    <>
      <Header />

      <main className="container mt-3">
        <Outlet />
      </main>
    </>
  );
}
