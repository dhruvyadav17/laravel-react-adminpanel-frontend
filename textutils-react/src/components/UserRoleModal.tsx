import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  useGetRolesQuery,
  useAssignUserRolesMutation,
} from "../store/api";
import { execute } from "../utils/execute";
import type { User } from "../types/models";

type Props = {
  user: User;
  onClose: () => void;
  onSaved: () => void;
};

export default function UserRoleModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const { data: roles = [] } = useGetRolesQuery();
  const [assignUserRoles, { isLoading }] =
    useAssignUserRolesMutation();

  /* 🔁 RESET ON OPEN (CRITICAL FIX) */
  useEffect(() => {
    setSelected(user.roles ?? []);
  }, [user.id, user.roles]);

  const toggle = (role: string) => {
    setSelected((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const save = async () => {
    if (selected.includes("super-admin")) return;

    await execute(
      () =>
        assignUserRoles({
          id: user.id,
          roles: selected,
        }).unwrap(),
      "Roles assigned successfully"
    );

    onSaved(); // 🔥 refresh users list
    onClose();
  };

  return (
    <Modal
      title={`Assign Roles – ${user.name}`}
      onClose={onClose}
      onSave={save}
      saveDisabled={isLoading}
      saveText={isLoading ? "Saving..." : "Assign"}
      size="lg"
    >
      <div className="row">
        {roles.map((r: any) => (
          <div key={r.id} className="col-md-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selected.includes(r.name)}
                onChange={() => toggle(r.name)}
                disabled={isLoading || r.name === "super-admin"}
              />
              <label className="form-check-label">
                {r.name}
              </label>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
