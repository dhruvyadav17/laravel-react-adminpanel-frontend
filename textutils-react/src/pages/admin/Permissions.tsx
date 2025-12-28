import { useEffect, useState } from "react";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  togglePermission,
} from "../../services/permissionService";
import {
  handleApiError,
  handleApiSuccess,
} from "../../utils/toastHelper";

export default function Permissions() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editPermission, setEditPermission] = useState<any>(null);
  const [name, setName] = useState("");

  const fetchPermissions = async () => {
    try {
      const res = await getPermissions();
      
      setPermissions(res.data.data);
      console.log(res.data);
    } catch (e) {
      handleApiError(e);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const openAdd = () => {
    setEditPermission(null);
    setName("");
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditPermission(p);
    setName(p.name);
    setShowModal(true);
  };

  const save = async () => {
    try {
      const res = editPermission
        ? await updatePermission(editPermission.id, { name })
        : await createPermission({ name });

      handleApiSuccess(res);
      setShowModal(false);
      fetchPermissions();
    } catch (e) {
      handleApiError(e);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this permission?")) return;

    try {
      const res = await deletePermission(id);
      handleApiSuccess(res);
      fetchPermissions();
    } catch (e) {
      handleApiError(e);
    }
  };

  const toggle = async (id: number) => {
    try {
      const res = await togglePermission(id);
      handleApiSuccess(res);
      fetchPermissions();
    } catch (e) {
      handleApiError(e);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Permissions</h3>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Permission
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th width="220">Action</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>
                {p.is_active ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-danger">Inactive</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-1"
                  onClick={() => toggle(p.id)}
                >
                  Enable / Disable
                </button>
                <button
                  className="btn btn-sm btn-warning me-1"
                  onClick={() => openEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  {editPermission ? "Edit Permission" : "Add Permission"}
                </h5>
              </div>

              <div className="modal-body">
                <input
                  className="form-control"
                  placeholder="Permission name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={save}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
