import { createContext, useContext, useState } from "react";
import type { ModalMap } from "../admin/types/modal";

type ModalType = keyof ModalMap;

type ModalContextValue = {
  modalType: ModalType | null;
  modalData: ModalMap[ModalType] | null;
  openModal: <K extends ModalType>(
    type: K,
    data: ModalMap[K]
  ) => void;
  closeModal: () => void;
};

const AppModalContext = createContext<ModalContextValue | null>(
  null
);

export function AppModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalType, setModalType] =
    useState<ModalType | null>(null);
  const [modalData, setModalData] =
    useState<ModalMap[ModalType] | null>(null);

  const openModal = <K extends ModalType>(
    type: K,
    data: ModalMap[K]
  ) => {
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  return (
    <AppModalContext.Provider
      value={{ modalType, modalData, openModal, closeModal }}
    >
      {children}
    </AppModalContext.Provider>
  );
}

export function useAppModal() {
  const ctx = useContext(AppModalContext);
  if (!ctx) {
    throw new Error(
      "useAppModal must be used inside AppModalProvider"
    );
  }
  return ctx;
}
