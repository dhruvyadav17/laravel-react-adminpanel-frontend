import { useEffect, useState } from "react";
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useAssignRoleToUserMutation,
  useAssignPermissionToUserMutation,
  useAssignPermissionToRoleMutation,
} from "../../../store/api";

type Mode =
  | "user-role"
  | "user-permission"
  | "role-permission";

type Entity = {
  id: number;
  roles?: string[];
  permissions?: string[];
};

export function useAssignLogic(mode: Mode, entity: Entity) {
  const isUserRole = mode === "user-role";
  const isUserPermission = mode === "user-permission";
  const isRolePermission = mode === "role-permission";

  const { data: roles = [] } = useGetRolesQuery(undefined, {
    skip: !isUserRole,
  });

  const { data: permissions = [] } = useGetPermissionsQuery(undefined, {
    skip: !isUserPermission && !isRolePermission,
  });

  const [assignUserRoles] = useAssignRoleToUserMutation();
  const [assignUserPermissions] =
    useAssignPermissionToUserMutation();
  const [assignRolePermissions] =
    useAssignPermissionToRoleMutation();

  const items = isUserRole ? roles : permissions;

  const initialSelected =
    isUserRole
      ? entity.roles ?? []
      : entity.permissions ?? [];

  const [selected, setSelected] =
    useState<string[]>(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [entity.id]);

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const submit = async () => {
    if (isUserRole) {
      return assignUserRoles({
        userId: entity.id,
        roles: selected,
      }).unwrap();
    }

    if (isUserPermission) {
      return assignUserPermissions({
        userId: entity.id,
        permissions: selected,
      }).unwrap();
    }

    if (isRolePermission) {
      return assignRolePermissions({
        roleId: entity.id,
        permissions: selected,
      }).unwrap();
    }
  };

  const title =
    mode === "user-role"
      ? "Assign Roles"
      : mode === "user-permission"
      ? "Assign Permissions"
      : "Assign Permissions";

  return {
    items,
    selected,
    toggle,
    submit,
    title,
  };
}
