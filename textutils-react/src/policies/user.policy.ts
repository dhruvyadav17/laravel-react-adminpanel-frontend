import { PERMISSIONS } from "../constants/permissions";
import type { User } from "../types/models";
import type { ReturnTypeUseAuth } from "../types/auth";

export function getUserRowActions(
  user: User,
  auth: ReturnTypeUseAuth,
  handlers: {
    onAssignRole: () => void;
    onAssignPermission: () => void;
    onArchive: () => void;
    onRestore: () => void;
  }
) {
  if (user.roles.includes("super-admin")) return [];

  if (user.deleted_at) {
    return [
      {
        label: "Restore",
        variant: "success" as const,
        onClick: handlers.onRestore,
      },
    ];
  }

  return [
    {
      label: "Assign Role",
      show: auth.can(PERMISSIONS.USER.ASSIGN_ROLE),
      onClick: handlers.onAssignRole,
    },
    {
      label: "Assign Permissions",
      show: auth.can(PERMISSIONS.USER.ASSIGN_PERMISSION),
      onClick: handlers.onAssignPermission,
    },
    {
      label: "Archive",
      variant: "danger" as const,
      show: auth.can(PERMISSIONS.USER.DELETE),
      onClick: handlers.onArchive,
    },
  ];
}
