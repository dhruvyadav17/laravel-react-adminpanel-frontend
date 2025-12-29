import { useEffect, useState } from "react";
import {
  getRolePermissions,
  assignRolePermissions,
} from "../services/roleService";
import { handleApiError, handleApiSuccess } from "../utils/toastHelper";
import Modal from "./common/Modal";

export default function RolePermissionModal({ roleId, onClose }: any) {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getRolePermissions(roleId)
      .then((res) => {
        setPermissions(res.data.data.permissions);
        setSelected(res.data.data.assigned);
      })
      .catch(handleApiError);
  }, [roleId]);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const save = async () => {
    try {
      const res = await assignRolePermissions(roleId, selected);
      handleApiSuccess(res);
    } catch (e) {
      handleApiError(e);
    } finally {
      // ✅ ALWAYS CLOSE (SUCCESS / ERROR)
      onClose();
    }
  };

  return (
    <Modal title="Assign Permissions" onClose={onClose} onSave={save} 
    saveDisabled={false} button_name="Assign Permissions">
      {permissions.map((p) => (
        <div key={p.id}>
          <input
            type="checkbox"
            checked={selected.includes(p.name)}
            onChange={() => toggle(p.name)}
          />{" "}
          {p.name}
        </div>
      ))}
    </Modal>
  );
}
