import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import type { ModalMap } from "../types/modal";

type ModalContextType = {
  modalType: keyof ModalMap | null;
  modalData: ModalMap[keyof ModalMap] | null;
  openModal: <T extends keyof ModalMap>(
    type: T,
    data: ModalMap[T]
  ) => void;
  closeModal: () => void;
};

const AppModalContext =
  createContext<ModalContextType | null>(null);

export function AppModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [modalType, setModalType] =
    useState<keyof ModalMap | null>(null);

  const [modalData, setModalData] =
    useState<ModalMap[keyof ModalMap] | null>(null);

  const openModal = <T extends keyof ModalMap>(
    type: T,
    data: ModalMap[T]
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

export function useAppModal() {
  const ctx = useContext(AppModalContext);
  if (!ctx) {
    throw new Error(
      "useAppModal must be used inside AppModalProvider"
    );
  }
  return ctx;
}
