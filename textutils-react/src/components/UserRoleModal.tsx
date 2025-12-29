import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  assignUserRoles,
} from "../services/userService";
import {
  getRoles,
} from "../services/roleService";

import {
  handleApiSuccess,
  handleApiError,
} from "../utils/toastHelper";

export default function UserRoleModal({
  user,
  onClose,
  onSaved,
}: any) {
  const [roles, setRoles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(
    user.roles || []
  );

  useEffect(() => {
    getRoles().then((res) => {
      setRoles(res.data.data.map((r: any) => r.name));
    });
  }, []);

  const toggle = (role: string) => {
    setSelected((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

const save = async () => {
    if (!selected.length) {
      handleApiError(
        null,
        "Please select at least one role"
      );
      return;
    }

    try {
        console.log("Assigning roles:", selected);
      const res = await assignUserRoles(
        user.id,
        selected
      );

      // ✅ SUCCESS TOAST
      handleApiSuccess(
        res,
        "Role assigned to user successfully"
      );

      onSaved();
    } catch (err: any) {
      // ❌ ERROR TOAST
      handleApiError(err);
    }finally {
      onClose();
    }
  };

  return (
    <Modal
      title={`Assign Roles – ${user.name}`}
      onClose={onClose}
      onSave={save}
      saveDisabled={false}
      button_name="Assign Roles"
    >
      {roles.map((r) => (
        <div key={r} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={selected.includes(r)}
            onChange={() => toggle(r)}
          />
          <label className="form-check-label">
            {r}
          </label>
        </div>
      ))}
    </Modal>
  );
}
