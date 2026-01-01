import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import ModalHost from "../components/common/ModalHost";

export default function AdminLayout() {
  return (
    <div className="wrapper">
      {/* TOP NAVBAR */}
      <AdminNavbar />

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="content-wrapper">
        <Outlet />
      </div>

      {/* 🔥 ALL GLOBAL MODALS (DELETE CONFIRM ETC.) */}
      <ModalHost />

      {/* FOOTER */}
      <footer className="main-footer text-center">
        <strong>AdminLTE React</strong>
      </footer>
    </div>
  );
}
