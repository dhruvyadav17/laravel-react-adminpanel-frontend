import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} from "../store/api";
import { handleApiError, handleApiSuccess } from "../utils/toastHelper";
import { execute } from "../utils/execute";

type Props = {
  roleId: number;
  onClose: () => void;
};

type Permission = {
  id: number;
  name: string;
};

type RolePermissionResponse = {
  permissions: Permission[];
  assigned: string[];
};

export default function RolePermissionModal({ roleId, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  /* ================= FETCH ================= */
  const { data, isLoading, isError } = useGetRolePermissionsQuery(roleId, {
    skip: !roleId,
  }) as {
    data?: RolePermissionResponse;
    isLoading: boolean;
    isError: boolean;
  };

  /* ================= MUTATION ================= */
  const [assignRolePermissions, { isLoading: saving }] =
    useAssignRolePermissionsMutation();

  /* ================= SYNC ASSIGNED ================= */
  useEffect(() => {
    if (data?.assigned) {
      setSelected(data.assigned);
    }
  }, [data?.assigned]);

  const toggle = (permission: string) => {
    setSelected((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  /* ================= SAVE ================= */
  const save = async () => {
    await execute(
      () =>
        assignRolePermissions({
          id: roleId,
          permissions: selected,
        }).unwrap(),
      "Permissions assigned successfully"
    );

    onClose();
  };

  return (
    <Modal
      title="Assign Permissions"
      onClose={onClose}
      onSave={save}
      saveDisabled={saving}
      button_name={saving ? "Saving..." : "Assign"}
    >
      {/* ================= STATES ================= */}
      {isLoading && <p>Loading permissions...</p>}

      {isError && <p className="text-danger">Failed to load permissions</p>}

      {!isLoading && !isError && data?.permissions?.length === 0 && (
        <p className="text-muted">No permissions available</p>
      )}

      {/* ================= LIST ================= */}
      {!isLoading &&
        data?.permissions?.map((p) => (
          <div key={p.id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`perm-${p.id}`}
              checked={selected.includes(p.name)}
              onChange={() => toggle(p.name)}
              disabled={saving}
            />
            <label className="form-check-label" htmlFor={`perm-${p.id}`}>
              {p.name}
            </label>
          </div>
        ))}
    </Modal>
  );
}
