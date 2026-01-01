import { useState } from "react";
import type { ModalMap } from "../types/modal";

export function useAppModal() {
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

  return {
    modalType,
    modalData,
    openModal,
    closeModal,
  };
}
