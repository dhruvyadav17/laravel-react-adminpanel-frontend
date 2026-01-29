import { memo } from "react";
import Modal from "./common/Modal";
import { useConfirmDelete } from "../hooks/useConfirmDelete";

import {
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,
} from "../store/api";

import { execute } from "../utils/execute";
import type { User } from "../types/models";

type Props = {
  user: User;
  onClose: () => void;
};

function UserPermissionModal({ user, onClose }: Props) {
  const confirmDelete = useConfirmDelete();

  const { data, isLoading } = useGetUserPermissionsQuery(user.id);

  const [assignPermissions, { isLoading: saving }] =
    useAssignUserPermissionsMutation();

  const assigned = data?.assigned ?? [];
  const permissions = data?.permissions ?? [];

  const togglePermission = async (permission: string) => {
    const updated = assigned.includes(permission)
      ? assigned.filter((p) => p !== permission)
      : [...assigned, permission];

    await execute(
      () =>
        assignPermissions({
          id: user.id,
          permissions: updated,
        }).unwrap(),
      "Permissions updated"
    );
  };

  const handleReset = () =>
    confirmDelete(
      "Are you sure you want to remove all permissions?",
      async () => {
        await execute(
          () =>
            assignPermissions({
              id: user.id,
              permissions: [],
            }).unwrap(),
          "Permissions cleared"
        );
      }
    );

  return (
    <Modal
      title={`Permissions – ${user.name}`}
      onClose={onClose}
      saveDisabled
    >
      {isLoading ? (
        <p className="text-muted">Loading permissions…</p>
      ) : (
        <>
          <div className="mb-3">
            {permissions.map((permission) => (
              <div
                key={permission.name}
                className="form-check mb-2"
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={permission.name}
                  checked={assigned.includes(permission.name)}
                  disabled={saving}
                  onChange={() =>
                    togglePermission(permission.name)
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor={permission.name}
                >
                  {permission.name}
                </label>
              </div>
            ))}
          </div>

          {assigned.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              disabled={saving}
              onClick={handleReset}
            >
              Remove All Permissions
            </button>
          )}
        </>
      )}
    </Modal>
  );
}

export default memo(UserPermissionModal);
