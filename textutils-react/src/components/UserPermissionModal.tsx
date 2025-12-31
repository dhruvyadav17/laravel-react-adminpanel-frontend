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

  const {
    data,
    isLoading,
    isError,
  } = useGetUserPermissionsQuery(user.id, {
    skip: !user.id,
    refetchOnMountOrArgChange: true, // 🔥 KEY FIX
  });

  const [assignPermissions, { isLoading: saving }] =
    useAssignUserPermissionsMutation();

  /* 🔁 reset on user change */
  useEffect(() => {
    if (data?.assigned) {
      setSelected(data.assigned);
    } else {
      setSelected([]);
    }
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
      button_name={saving ? "Saving..." : "Save"}
      dialogClassName="modal-lg"
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
