import { useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
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
import type { AssignMode } from "../../../types/modal";

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
  const [selected, setSelected] = useState<string[]>([]);

  /* ================= MODE ================= */

  const isUser = "email" in entity;
  const isRole = !("email" in entity);

  const isUserRole = mode === "user-role";
  const isUserPermission = mode === "user-permission";
  const isRolePermission = mode === "role-permission";

  /* ================= FETCH ================= */

  // USER → ROLES
  const { data: roles = [] } = useGetRolesQuery(undefined, {
    skip: !isUserRole,
  });

  // ALL PERMISSIONS (for checkbox list)
  const { data: permissions = [] } = useGetPermissionsQuery(undefined, {
    skip: isUserRole,
  });

  // USER → PERMISSIONS (assigned)
  const { data: userPermData } = useGetUserPermissionsQuery(
    isUserPermission ? (entity as User).id : 0,
    { skip: !isUserPermission }
  );

  // ROLE → PERMISSIONS (🔥 MOST IMPORTANT FIX)
  const { data: rolePermData, isFetching } =
    useGetRolePermissionsQuery(
      isRolePermission ? (entity as Role).id : 0,
      { skip: !isRolePermission }
    );

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
    if (isUserRole) {
      await execute(
        () =>
          assignUserRoles({
            id: (entity as User).id,
            roles: selected,
          }).unwrap(),
        "Roles assigned successfully"
      );
    }

    if (isUserPermission) {
      await execute(
        () =>
          assignUserPermissions({
            id: (entity as User).id,
            permissions: selected,
          }).unwrap(),
        "Permissions assigned successfully"
      );
    }

    if (isRolePermission) {
      await execute(
        () =>
          assignRolePermissions({
            id: (entity as Role).id,
            permissions: selected,
          }).unwrap(),
        "Permissions assigned successfully"
      );
    }

    onClose();
  };

  /* ================= LIST ================= */

  const list = isUserRole
    ? roles.map((r) => r.name)
    : permissions.map((p) => p.name);

  /* ================= VIEW ================= */

  return (
    <Modal
      title={`Assign ${
        isUserRole ? "Roles" : "Permissions"
      } – ${"name" in entity ? entity.name : ""}`}
      onClose={onClose}
      onSave={save}
      saveDisabled={saving || isFetching}
      saveText={saving ? "Saving..." : "Assign"}
      size="lg"
    >
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {list.map((item) => (
            <div key={item} className="col-md-4 mb-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selected.includes(item)}
                  onChange={() => toggle(item)}
                  disabled={saving || item === "super-admin"}
                />
                <label className="form-check-label">
                  {item}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
