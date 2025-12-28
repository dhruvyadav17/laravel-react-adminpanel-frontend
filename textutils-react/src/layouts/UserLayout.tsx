import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function UserLayout() {
  return (
    <>
      <Header />
      <div className="container mt-3">
        <Outlet />
      </div>
    </>
  );
}
