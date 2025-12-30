// src/types/modalMap.ts
import type { User, Role } from "./models";

/**
 * 🔥 Single source of truth for ALL modals
 * Modal name → required data mapping
 */
export type ModalMap = {
  /* ================= USER ================= */
  "user-form": null;

  "user-role": User;

  /* ================= ROLE ================= */
  "role-add": null;

  "role-edit": Role;

  /* ================= PERMISSION ================= */
  "permission": {
    id?: number;
    name?: string;
  };

  /* ================= GLOBAL ================= */
  "confirm-delete": {
    message: string;
    onConfirm: () => Promise<void>;
  };
};
