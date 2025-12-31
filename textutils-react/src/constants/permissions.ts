export const PERMISSIONS = {
  USER: {
    VIEW: "user-view",
    CREATE: "user-create",
    DELETE: "user-delete",
    ASSIGN_ROLE: "user-assign-role",
    
  },
  ROLE: {
    MANAGE: "role-manage",
  },
  PERMISSION: {
    MANAGE: "permission-manage",
  },
} as const;
//user-permission
export type Permission =
  | (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[any]];
