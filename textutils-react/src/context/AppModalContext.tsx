import { createContext, useContext, useState } from "react";
import { ModalType } from "../types/modal";

type AppModalContextType<T = any> = {
  modalType: ModalType;
  modalData: T | null;
  openModal: (type: ModalType, data?: T) => void;
  closeModal: () => void;
};

const AppModalContext = createContext<AppModalContextType | null>(null);

export function AppModalProvider({ children }: { children: React.ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, data?: any) => {
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

export function useAppModal<T = any>() {
  const ctx = useContext(AppModalContext);
  if (!ctx) {
    throw new Error("useAppModal must be used inside AppModalProvider");
  }
  return ctx as AppModalContextType<T>;
}
