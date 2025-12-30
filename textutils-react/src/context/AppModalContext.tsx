import { createContext, useContext, useState } from "react";
import type { ModalMap } from "../types/modalMap";

/* ================= TYPES ================= */

type ModalType = keyof ModalMap | null;

type AppModalContextType = {
  modalType: ModalType;
  modalData: ModalMap[keyof ModalMap] | null;

  openModal: <K extends keyof ModalMap>(
    type: K,
    data?: ModalMap[K]
  ) => void;

  closeModal: () => void;
};

/* ================= CONTEXT ================= */

const AppModalContext = createContext<AppModalContextType | null>(null);

/* ================= PROVIDER ================= */

export function AppModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] =
    useState<ModalMap[keyof ModalMap] | null>(null);

  const openModal = <K extends keyof ModalMap>(
    type: K,
    data?: ModalMap[K]
  ) => {
    setModalType(type);
    setModalData(data ?? null);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  return (
    <AppModalContext.Provider
      value={{
        modalType,
        modalData,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AppModalContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAppModal() {
  const ctx = useContext(AppModalContext);

  if (!ctx) {
    throw new Error(
      "useAppModal must be used inside AppModalProvider"
    );
  }

  return ctx;
}
