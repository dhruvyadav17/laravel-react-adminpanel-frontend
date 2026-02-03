export type PermissionItem = {
  id: number;
  name: string;
};

export type GroupedPermissions = Record<string, PermissionItem[]>;
