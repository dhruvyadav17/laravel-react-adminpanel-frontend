import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import ModalHost from "../../components/common/ModalHost";
import { useEffect } from "react";
export default function AdminLayout() {
    useEffect(() => {
    // 🧹 AdminLTE 4 safety cleanup
    document.body.classList.remove("sidebar-open");
  }, []);
  return (
    <div className="wrapper">
      {/* ================= HEADER ================= */}
      <AdminNavbar />

      {/* ================= SIDEBAR ================= */}
      <aside className="main-sidebar sidebar-dark-primary">
        <AdminSidebar />
      </aside>

      {/* ================= CONTENT ================= */}
      <div className="content-wrapper">
        <Outlet />
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="main-footer text-center">
        <strong>Admin Panel</strong>
      </footer>

      {/* ================= GLOBAL MODALS ================= */}
      <ModalHost />
    </div>
  );
}
