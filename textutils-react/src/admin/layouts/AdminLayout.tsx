import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import ModalHost from "../../components/common/ModalHost";

export default function AdminLayout() {
  return (
    <div className="wrapper">
      {/* ================= HEADER ================= */}
      <AdminNavbar />

      {/* ================= SIDEBAR ================= */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
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
