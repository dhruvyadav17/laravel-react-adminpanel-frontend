import { useEffect, useState } from "react";

import FormModal from "../../../components/common/FormModal";
import CheckboxGrid from "../../../components/common/CheckboxGrid";
import { execute } from "../../../utils/execute";

import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useGetUserPermissionsQuery,
  useGetRolePermissionsQuery,
  useAssignUserRolesMutation,
  useAssignUserPermissionsMutation,
  useAssignRolePermissionsMutation,
} from "../../../store/api";

import type { User, Role } from "../../../types/models";
import type { AssignMode } from "../../types/modal";

type Props = {
  mode: AssignMode;
  entity: User | Role;
  onClose: () => void;
};

export default function AssignModal({
  mode,
  entity,
  onClose,
}: Props) {
  /* ================= GUARD ================= */
  if (!mode || !entity) return null;

  const [selected, setSelected] = useState<string[]>([]);

  /* ================= MODE CHECKS ================= */

  const isUser = "email" in entity;

  const isUserRole = mode === "user-role";
  const isUserPermission = mode === "user-permission";
  const isRolePermission = mode === "role-permission";

  /* ================= IDS ================= */

  const userId =
    (isUserRole || isUserPermission) && isUser
      ? (entity as User).id
      : undefined;

  const roleId =
    isRolePermission && !isUser
      ? (entity as Role).id
      : undefined;

  /* ================= FETCH ================= */

  const { data: roles = [] } = useGetRolesQuery(undefined, {
    skip: !isUserRole,
  });

  const { data: permissions = [] } =
    useGetPermissionsQuery(undefined, {
      skip: isUserRole,
    });

  const { data: userPermData } =
    useGetUserPermissionsQuery(userId!, {
      skip: !isUserPermission || !userId,
    });

  const {
    data: rolePermData,
    isFetching,
  } = useGetRolePermissionsQuery(roleId!, {
    skip: !isRolePermission || !roleId,
  });

  /* ================= MUTATIONS ================= */

  const [assignUserRoles, { isLoading: savingRoles }] =
    useAssignUserRolesMutation();

  const [assignUserPermissions, { isLoading: savingUserPerm }] =
    useAssignUserPermissionsMutation();

  const [assignRolePermissions, { isLoading: savingRolePerm }] =
    useAssignRolePermissionsMutation();

  const saving =
    savingRoles || savingUserPerm || savingRolePerm;

  /* ================= INIT SELECTED ================= */

  useEffect(() => {
    if (isUserRole && isUser) {
      setSelected((entity as User).roles ?? []);
    }

    if (isUserPermission) {
      setSelected(userPermData?.assigned ?? []);
    }

    if (isRolePermission) {
      setSelected(rolePermData?.assigned ?? []);
    }
  }, [mode, entity, userPermData, rolePermData]);

  /* ================= TOGGLE ================= */

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  /* ================= SAVE ================= */

  const save = async () => {
    if (isUserRole && userId) {
      await execute(() =>
        assignUserRoles({
          id: userId,
          roles: selected,
        }).unwrap()
      );
    }

    if (isUserPermission && userId) {
      await execute(
        () =>
          assignUserPermissions({
            id: userId,
            permissions: selected,
          }).unwrap(),
        { defaultMessage: "Permissions assigned successfully" }
      );
    }

    if (isRolePermission && roleId) {
      await execute(
        () =>
          assignRolePermissions({
            id: roleId,
            permissions: selected,
          }).unwrap(),
        { defaultMessage: "Permissions assigned successfully" }
      );
    }

    onClose();
  };

  /* ================= LIST ================= */

  const list = isUserRole
    ? roles.map((r) => r.name)
    : permissions.map((p) => p.name);

  /* ================= TITLE ================= */

  const title = `Assign ${
    isUserRole ? "Roles" : "Permissions"
  } – ${entity.name}`;

  /* ================= VIEW ================= */

  return (
    <FormModal
      title={title}
      loading={saving || isFetching}
      onSave={save}
      onClose={onClose}
      saveText="Assign"
    >
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <CheckboxGrid
          items={list}
          selected={selected}
          onToggle={toggle}
          disabled={(item) =>
            saving || item === "super-admin"
          }
        />
      )}
    </FormModal>
  );
}
