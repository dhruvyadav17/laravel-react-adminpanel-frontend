import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import ModalHost from "../../components/common/ModalHost";

export default function AdminLayout() {
  return (
    <div className="wrapper">
      {/* ================= TOP NAVBAR ================= */}
      <AdminNavbar />

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="main-sidebar sidebar-dark-primary">
        <AdminSidebar />
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="content-wrapper">
        <section className="content pt-3">
          <Outlet />
        </section>
      </div>

      {/* ================= GLOBAL MODALS ================= */}
      <ModalHost />

      {/* ================= FOOTER ================= */}
      <footer className="main-footer text-center">
        <strong>Admin Panel</strong>
      </footer>
    </div>
  );
}
