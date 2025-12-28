import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AdminLayout() {
  return (
    <>
      <Header />
      <div className="container mt-3">
        <Outlet />
      </div>
    </>
  );
}
