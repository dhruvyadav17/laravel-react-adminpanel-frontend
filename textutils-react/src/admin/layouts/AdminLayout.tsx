import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import ModalHost from "../../components/common/ModalHost";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("sidebar-collapse", collapsed);

    return () => {
      document.body.classList.remove("sidebar-collapse");
    };
  }, [collapsed]);

  return (
    <div className="app-wrapper layout-fixed">
      {/* HEADER */}
      <nav className="app-header navbar navbar-expand bg-body border-bottom">
        <AdminNavbar onToggle={() => setCollapsed(v => !v)} />
      </nav>

      {/* SIDEBAR */}
      <aside className="app-sidebar shadow">
        <AdminSidebar />
      </aside>

      {/* MAIN */}
      <main className="app-main">
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>

      <ModalHost />
    </div>
  );
}
