import { useEffect, useState } from "react";
import { getRoles, deleteRole, toggleRole } from "../../services/roleService";
import { handleApiError, handleApiSuccess } from "../../utils/toastHelper";
import RolePermissionModal from "../../components/RolePermissionModal";
import { createRole } from "../../services/roleService";
import { updateRole } from "../../services/roleService";

export default function Roles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionRoleId, setPermissionRoleId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState<any>(null);
  const [roleName, setRoleName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const openPermissionModal = (roleId: number) => {
    setPermissionRoleId(roleId);
    setShowPermissionModal(true);
  };
  const openEdit = (role: any) => {
    setEditRole(role);
    setRoleName(role.name);
    setShowEditModal(true);
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data);
    } catch (e) {
      handleApiError(e);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const removeRole = async (id: number) => {
    try {
      const res = await deleteRole(id);
      handleApiSuccess(res);
      fetchRoles();
    } catch (e) {
      handleApiError(e);
    }
  };

  const toggle = async (id: number) => {
    try {
      const res = await toggleRole(id);
      handleApiSuccess(res);
      fetchRoles();
    } catch (e) {
      handleApiError(e);
    }
  };
  const saveEdit = async () => {
    if (!editRole) return;

    try {
      const res = await updateRole(editRole.id, {
        name: roleName,
      });

      handleApiSuccess(res);
      setShowEditModal(false);
      fetchRoles();
    } catch (err) {
      handleApiError(err);
    }
  };
  const saveRole = async () => {
    if (!roleName.trim()) return;

    try {
      const res = await createRole({ name: roleName });
      handleApiSuccess(res);

      setShowAddModal(false);
      setRoleName("");
      fetchRoles(); // reload list
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Roles</h3>
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowAddModal(true)}
        >
          + Add Role
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th>Status</th>
            <th width="260">Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.permissions_count}</td>
              <td>
                {r.is_active ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-danger">Disabled</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-1"
                  onClick={() => toggle(r.id)}
                >
                  Enable / Disable
                </button>

                <button
                  className="btn btn-sm btn-warning me-1"
                  onClick={() => openEdit(r)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-secondary me-1"
                  onClick={() => openPermissionModal(r.id)}
                >
                  Assign Permission
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeRole(r.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPermissionModal && permissionRoleId && (
        <RolePermissionModal
          roleId={permissionRoleId}
          onClose={() => {
            setShowPermissionModal(false);
            setPermissionRoleId(null);
          }}
        />
      )}
      {showEditModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Role</h5>
              </div>

              <div className="modal-body">
                <input
                  className="form-control"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveEdit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Role</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control"
                  placeholder="Role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveRole}>
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
