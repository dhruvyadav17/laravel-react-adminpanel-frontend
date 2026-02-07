import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import ModalHost from "../../components/common/ModalHost";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-wrapper layout-fixed ${ !sidebarOpen ? "sidebar-collapse" : ""}`}>
      {/* HEADER */}
      <nav className="app-header navbar navbar-expand bg-body">
        <AdminNavbar
          onToggleSidebar={() =>
            setSidebarOpen((prev) => !prev)
          }
        />
      </nav>

      {/* SIDEBAR */}
      <aside className="app-sidebar bg-body-secondary shadow">
        <AdminSidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main className="app-main">
        <div className="app-content px-3 pt-3">
          <Outlet />
        </div>
      </main>

      <ModalHost />
    </div>
  );
}
