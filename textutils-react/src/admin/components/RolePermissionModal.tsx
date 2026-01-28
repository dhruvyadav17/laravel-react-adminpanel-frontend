import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} from "../store/api";
import { execute } from "../utils/execute";
import type { Role } from "../types/models";

type Props = {
  role: Role;
  onClose: () => void;
};

export default function RolePermissionModal({
  role,
  onClose,
}: Props) {
  // 🔒 SUPER ADMIN LOCK
  if (role.name === "super-admin") {
    return (
      <Modal title="Assign Permissions" onClose={onClose}>
        <p className="text-danger mb-0">
          Super admin permissions cannot be modified.
        </p>
      </Modal>
    );
  }

  const [selected, setSelected] = useState<string[]>([]);

  const { data, isLoading } =
    useGetRolePermissionsQuery(role.id);

  const [assignRolePermissions, { isLoading: saving }] =
    useAssignRolePermissionsMutation();

  useEffect(() => {
    setSelected(data?.assigned ?? []);
  }, [data?.assigned]);

  const toggle = (permission: string) => {
    setSelected((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const save = async () => {
    await execute(
      () =>
        assignRolePermissions({
          id: role.id,
          permissions: selected,
        }).unwrap(),
      "Permissions assigned successfully"
    );
    onClose();
  };

  return (
    <Modal
      title={`Assign Permissions – ${role.name}`}
      onClose={onClose}
      onSave={save}
      saveDisabled={saving}
      saveText={saving ? "Saving..." : "Assign"}
      size="lg"
    >
      {isLoading && <p>Loading permissions...</p>}

      {!isLoading && data?.permissions && (
        <div className="row">
          {data.permissions.map((p: any) => (
            <div key={p.id} className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selected.includes(p.name)}
                  onChange={() => toggle(p.name)}
                  disabled={saving}
                />
                <label className="form-check-label">
                  {p.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
