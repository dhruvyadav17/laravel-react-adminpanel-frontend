import type { User, Role } from "./models";

export type ModalMap = {
  /* ================= USER ================= */

  "user-form": null;

  "user-role": User;

  "user-permission": {
    id: number;
    name: string;
  };

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
    confirmLabel?: string; 
  };
};
