import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import ModalHost from "../components/common/ModalHost";

export default function AdminLayout() {
  return (
    <div className="wrapper">
      <AdminNavbar />
      <AdminSidebar />

      <div className="content-wrapper">
        <Outlet />
      </div>

      <ModalHost />

      <footer className="main-footer text-center">
        <strong>Admin Panel</strong>
      </footer>
    </div>
  );
}
