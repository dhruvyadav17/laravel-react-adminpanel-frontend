import { useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
import { execute } from "../../../utils/execute";

import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useGetUserPermissionsQuery,
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

  /* ================= CONFIG ================= */

  const isUser = "email" in entity;
  const isRole = "name" in entity && !("email" in entity);

  const isUserRole = mode === "user-role";
  const isUserPermission = mode === "user-permission";
  const isRolePermission = mode === "role-permission";

  /* ================= FETCH ================= */

  const { data: roles = [] } = useGetRolesQuery(undefined, {
    skip: !isUserRole,
  });

  const { data: permissions = [] } = useGetPermissionsQuery(undefined, {
    skip: !isUserPermission && !isRolePermission,
  });

  const { data: userPermData } = useGetUserPermissionsQuery(
    isUserPermission ? (entity as User).id : 0,
    { skip: !isUserPermission }
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

  /* ================= INIT ================= */

  useEffect(() => {
    if (isUserRole && isUser) {
      setSelected((entity as User).roles ?? []);
    }

    if (isUserPermission) {
      setSelected(userPermData?.assigned ?? []);
    }

    if (isRolePermission && "permissions" in entity) {
      setSelected((entity as any).permissions ?? []);
    }
  }, [mode, entity, userPermData]);

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

  const list =
    isUserRole
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
      saveDisabled={saving}
      saveText={saving ? "Saving..." : "Assign"}
      size="lg"
    >
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
    </Modal>
  );
}
