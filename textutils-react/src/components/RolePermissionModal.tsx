import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} from "../store/api";
import { execute } from "../utils/execute";

type Props = {
  roleId: number;
  onClose: () => void;
};

export default function RolePermissionModal({
  roleId,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const {
    data,
    isLoading,
    isError,
  } = useGetRolePermissionsQuery(roleId, {
    skip: !roleId,
    refetchOnMountOrArgChange: true,
  });

  const [assignRolePermissions, { isLoading: saving }] =
    useAssignRolePermissionsMutation();

  /* ================= SYNC ================= */

  useEffect(() => {
    setSelected(data?.assigned ?? []);
  }, [data?.assigned]);

  /* ================= HANDLERS ================= */

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
          id: roleId,
          permissions: selected,
        }).unwrap(),
      "Permissions assigned successfully"
    );

    onClose();
  };

  /* ================= VIEW ================= */

  return (
    <Modal
      title="Assign Permissions"
      onClose={onClose}
      onSave={save}
      saveDisabled={saving}
      button_name={saving ? "Saving..." : "Assign"}
      dialogClassName="modal-md"
    >
      {isLoading && <p>Loading permissions...</p>}

      {isError && (
        <p className="text-danger">Failed to load permissions</p>
      )}

      {!isLoading && data?.permissions?.length === 0 && (
        <p className="text-muted">No permissions available</p>
      )}

      {!isLoading && data?.permissions && (
        <div className="container-fluid px-3">
          <div className="row g-2">
            {data.permissions.map((p: any) => (
              <div
                key={p.id}
                className="col-12 col-sm-6 col-md-4"
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
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
        </div>
      )}
    </Modal>
  );
}
