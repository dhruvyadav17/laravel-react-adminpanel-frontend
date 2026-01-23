import { PERMISSIONS } from "../constants/permissions";
import type { Permission } from "../types/models";
import type { ReturnTypeUseAuth } from "../types/auth";

export function getPermissionRowActions(
  permission: Permission,
  auth: ReturnTypeUseAuth,
  handlers: {
    onEdit: () => void;
    onDelete: () => void;
  }
) {
  return [
    {
      label: "Edit",
      show: auth.can(PERMISSIONS.PERMISSION.MANAGE),
      onClick: handlers.onEdit,
    },
    {
      label: "Delete",
      variant: "danger" as const,
      show: auth.can(PERMISSIONS.PERMISSION.MANAGE),
      onClick: handlers.onDelete,
    },
  ];
}
