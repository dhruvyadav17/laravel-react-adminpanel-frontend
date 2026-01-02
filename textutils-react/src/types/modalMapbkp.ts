import type { User, Role } from "./models";

/**
 * 🔥 Single source of truth for ALL modals
 * Modal name → required data mapping
 */
export type ModalMap = {
  /* ================= USER ================= */

  // Add / Create user
  "user-form": null;

  // Assign roles to user
  "user-role": User;

  // 🔥 Assign permissions to user (NEW)
  "user-permission": {
    id: number;
    name: string;
  };

  /* ================= ROLE ================= */

  // Add role
  "role-add": null;

  // Edit role
  "role-edit": Role;

  /* ================= PERMISSION ================= */

  // Add / Edit permission
  "permission": {
    id?: number;
    name?: string;
  };

  /* ================= GLOBAL ================= */

  // Global confirm delete modal
  "confirm-delete": {
    message: string;
    onConfirm: () => Promise<void>;
  };
};
