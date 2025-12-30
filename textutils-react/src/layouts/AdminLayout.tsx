import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAppModal } from "../context/AppModalContext";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";

export default function AdminLayout() {
  const { modalType, modalData, closeModal } =
    useAppModal<any>();

  return (
    <>
      <Header />

      <div className="container mt-3">
        <Outlet />
      </div>

      {/* 🔥 GLOBAL CONFIRM DELETE */}
      {modalType === "confirm-delete" &&
        modalData && (
          <ConfirmDeleteModal
            message={modalData.message}
            onConfirm={modalData.onConfirm}
            onClose={closeModal}
          />
        )}
    </>
  );
}
