import { PERMISSIONS } from "../constants/permissions";
import type { Role } from "../types/models";
import type { ReturnTypeUseAuth } from "../types/auth";

export function getRoleRowActions(
  role: Role,
  auth: ReturnTypeUseAuth,
  handlers: {
    onEdit: () => void;
    onDelete: () => void;
    onAssignPermission: () => void;
  }
) {
  if (role.name === "super-admin") return [];

  return [
    {
      label: "Assign Permissions",
      show: auth.can(PERMISSIONS.ROLE.MANAGE),
      onClick: handlers.onAssignPermission,
    },
    {
      label: "Edit",
      show: auth.can(PERMISSIONS.ROLE.MANAGE),
      onClick: handlers.onEdit,
    },
    {
      label: "Delete",
      variant: "danger" as const,
      show: auth.can(PERMISSIONS.ROLE.MANAGE),
      onClick: handlers.onDelete,
    },
  ];
}
