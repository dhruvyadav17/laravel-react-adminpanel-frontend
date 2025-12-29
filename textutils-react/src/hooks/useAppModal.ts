import { useState } from "react";

//port type ModalType = "permission" | "role" | "role-edit" | null;
import { ModalType } from "../types/modal";
export function useAppModal<T = any>() {
  const [type, setType] = useState<ModalType>(null);
  const [data, setData] = useState<T | null>(null);

  const openModal = (modalType: ModalType, payload?: T) => {
    setType(modalType);
    setData(payload || null);
  };

  const closeModal = () => {
    setType(null);
    setData(null);
  };

  return {
    modalType: type,
    modalData: data,
    openModal,
    closeModal,
  };
}
