import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,
} from "../store/api";
import { execute } from "../utils/execute";

type Props = {
  user: {
    id: number;
    name: string;
  };
  onClose: () => void;
};

export default function UserPermissionModal({
  user,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const { data, isLoading, isError } =
    useGetUserPermissionsQuery(user.id, {
      skip: !user.id,
      refetchOnMountOrArgChange: true,
    });

  const [assignPermissions, { isLoading: saving }] =
    useAssignUserPermissionsMutation();

  /* 🔁 RESET ON OPEN */
  useEffect(() => {
    setSelected(data?.assigned ?? []);
  }, [user.id, data?.assigned]);

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
        assignPermissions({
          id: user.id,
          permissions: selected,
        }).unwrap(),
      "Permissions updated"
    );
    onClose();
  };

  return (
    <Modal
      title={`Assign Permissions – ${user.name}`}
      onClose={onClose}
      onSave={save}
      saveDisabled={saving}
      saveText={saving ? "Saving..." : "Save"}
      size="lg"
    >
      {isLoading && <p>Loading permissions...</p>}
      {isError && (
        <p className="text-danger">
          Failed to load permissions
        </p>
      )}

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
