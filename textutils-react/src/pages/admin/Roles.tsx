import { useEffect, useState } from "react";
import {
  getRoles,
  deleteRole,
  createRole,
  updateRole,
} from "../../services/roleService";
import { handleApiError, handleApiSuccess } from "../../utils/toastHelper";
import RolePermissionModal from "../../components/RolePermissionModal";
import Modal from "../../components/common/Modal";
import { usePermission } from "../../auth/hooks/usePermission";
import { PERMISSIONS } from "../../constants/permissions";
import { useAppModal } from "../../hooks/useAppModal";

export default function Roles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [roleName, setRoleName] = useState("");
  const [permissionRoleId, setPermissionRoleId] =
    useState<number | null>(null);

  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  /* ================= FETCH ================= */
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

  /* ================= SAVE (ADD / EDIT) ================= */
  const saveRole = async () => {
    if (!roleName.trim()) {
      handleApiError(null, "Role name is required");
      closeModal();
      return;
    }

    try {
      const res =
        modalType === "role-edit"
          ? await updateRole(modalData.id, { name: roleName })
          : await createRole({ name: roleName });

      handleApiSuccess(
        res,
        modalType === "role-edit" ? "Role updated" : "Role created"
      );

      fetchRoles();
    } catch (e) {
      handleApiError(e);
    } finally {
      closeModal(); // ✅ ALWAYS CLOSE
      setRoleName("");
    }
  };

  /* ================= GUARD ================= */
  if (!can(PERMISSIONS.ROLE_MANAGE)) {
    return <p className="text-danger mt-4">Unauthorized</p>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Roles</h3>
        <button
          className="btn btn-primary"
          onClick={() => openModal("role-add")}
        >
          + Add Role
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th style={{ width: 260 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>

              {/* 🔥 ACTIONS LAST */}
              <td>
                <button
                  className="btn btn-sm btn-secondary me-1"
                  onClick={() => setPermissionRoleId(r.id)}
                >
                  Permissions
                </button>

                <button
                  className="btn btn-sm btn-warning me-1"
                  onClick={() => {
                    setRoleName(r.name);
                    openModal("role-edit", r);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={async () => {
                    try {
                      const res = await deleteRole(r.id);
                      handleApiSuccess(res, "Role deleted");
                      fetchRoles();
                    } catch (e) {
                      handleApiError(e);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {!roles.length && (
            <tr>
              <td colSpan={2} className="text-center">
                No roles found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= ADD / EDIT MODAL ================= */}
      {(modalType === "role-add" || modalType === "role-edit") && (
        <Modal
          title={modalType === "role-edit" ? "Edit Role" : "Add Role"}
          onClose={closeModal}
          onSave={saveRole}
          saveDisabled={false}
          button_name={modalType === "role-edit" ? "Update" : "Save"}
        >
          <input
            className="form-control"
            placeholder="Role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </Modal>
      )}

      {/* ================= PERMISSION MODAL ================= */}
      {permissionRoleId && (
        <RolePermissionModal
          roleId={permissionRoleId}
          onClose={() => setPermissionRoleId(null)}
        />
      )}
    </div>
  );
}
