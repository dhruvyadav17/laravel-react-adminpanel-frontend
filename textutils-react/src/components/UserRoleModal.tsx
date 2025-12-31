import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  useGetRolesQuery,
  useAssignUserRolesMutation,
} from "../store/api";
import { execute } from "../utils/execute";

type Props = {
  user: {
    id: number;
    name: string;
    roles: string[];
  };
  onClose: () => void;
  onSaved: () => void;
};

export default function UserRoleModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const {
    data: roles = [],
    isLoading,
    isError,
  } = useGetRolesQuery(undefined, {
    refetchOnMountOrArgChange: true, // 🔥 FIX
  });

  const [assignUserRoles, { isLoading: saving }] =
    useAssignUserRolesMutation();

  useEffect(() => {
    setSelected(user.roles || []);
  }, [user.id, user.roles]);

  const toggle = (role: string) => {
    setSelected((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const save = async () => {
    await execute(
      () =>
        assignUserRoles({
          id: user.id,
          roles: selected,
        }).unwrap(),
      "Roles assigned successfully"
    );
    onSaved();
    onClose();
  };

  return (
    <Modal
      title={`Assign Roles – ${user.name}`}
      onClose={onClose}
      onSave={save}
      saveDisabled={saving}
      button_name={saving ? "Saving..." : "Assign"}
      dialogClassName="modal-lg"
    >
      {isLoading && <p>Loading roles...</p>}
      {isError && (
        <p className="text-danger">Failed to load roles</p>
      )}

      {!isLoading && !roles.length && (
        <p className="text-muted">No roles available</p>
      )}

      {!isLoading && roles.length > 0 && (
        <div className="container-fluid px-3">
          <div className="row g-2">
            {roles.map((r: any) => (
              <div
                key={r.id}
                className="col-12 col-sm-6 col-md-4"
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selected.includes(r.name)}
                    onChange={() => toggle(r.name)}
                    disabled={saving}
                  />
                  <label className="form-check-label">
                    {r.name}
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
