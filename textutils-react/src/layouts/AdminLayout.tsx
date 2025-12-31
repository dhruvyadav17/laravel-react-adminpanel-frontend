// src/layouts/AdminLayout.tsx

import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAppModal } from "../context/AppModalContext";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";

/**
 * AdminLayout
 * -----------------------------------------
 * - Renders admin header
 * - Hosts admin pages
 * - Owns global admin modals (confirm delete)
 */
export default function AdminLayout() {
  const { modalType, modalData, closeModal } =
    useAppModal<any>();

  return (
    <>
      <Header />

      <main className="container mt-3">
        <Outlet />
      </main>

      {/* 🔥 GLOBAL CONFIRM DELETE (ADMIN ONLY) */}
      {modalType === "confirm-delete" && modalData && (
        <ConfirmDeleteModal
          message={modalData.message}
          onConfirm={modalData.onConfirm}
          onClose={closeModal}
        />
      )}
    </>
  );
}
