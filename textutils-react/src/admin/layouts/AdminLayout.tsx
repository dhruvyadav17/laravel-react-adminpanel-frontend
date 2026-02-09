import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import ModalHost from "../../components/common/ModalHost";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // 🔥 BODY CLASS CONTROL (REQUIRED)
 useEffect(() => {
  document.body.classList.toggle("sidebar-collapse", collapsed);
}, [collapsed]);

  return (
    <div className="app-wrapper layout-fixed">
      {/* HEADER */}
      <nav className="app-header navbar navbar-expand bg-body">
        <AdminNavbar onToggle={() => setCollapsed(v => !v)} />
      </nav>

      {/* SIDEBAR */}
      <aside className="app-sidebar bg-body-secondary shadow">
        <AdminSidebar />
      </aside>

      {/* MAIN */}
      <main className="app-main">
        <div className="content p-3">
          <Outlet />
        </div>
      </main>

      <ModalHost />
    </div>
  );
}
