import { useEffect, useState } from "react";
import {
  getRolePermissions,
  assignRolePermissions,
} from "../services/roleService";
import { handleApiError, handleApiSuccess } from "../utils/toastHelper";

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
      onClose();
    } catch (e) {
      handleApiError(e);
    }
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Assign Permissions</h5>
          </div>

          <div className="modal-body">
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
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
