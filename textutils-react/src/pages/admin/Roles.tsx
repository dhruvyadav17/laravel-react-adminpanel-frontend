import { useState } from "react";
import Modal from "../../components/common/Modal";
import RolePermissionModal from "../../components/RolePermissionModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { PERMISSIONS } from "../../constants/permissions";
import { usePermission } from "../../auth/hooks/usePermission";
import { useAppModal } from "../../hooks/useAppModal";
import { useBackendForm } from "../../hooks/useBackendForm";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../store/api";
import { handleApiError, handleApiSuccess } from "../../utils/toastHelper";

export default function Roles() {
  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data = [], isLoading } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const {
    values,
    errors,
    loading,
    setLoading,
    setField,
    handleError,
    reset,
  } = useBackendForm({ name: "" });

  if (!can(PERMISSIONS.ROLE_MANAGE)) {
    return <p className="text-danger">Unauthorized</p>;
  }

  const save = async () => {
    try {
      setLoading(true);

      const res = modalData?.id
        ? await updateRole({
            id: modalData.id,
            name: values.name,
          }).unwrap()
        : await createRole(values).unwrap();

      handleApiSuccess(res);
      closeModal();
      reset();
    } catch (e) {
      handleError(e);
      handleApiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Roles</h3>

        <button
          className="btn btn-primary"
          onClick={() => {
            reset();
            openModal("role-add");
          }}
        >
          + Add Role
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th width="260">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r: any) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary me-1"
                    onClick={() =>
                      openModal("permission", r)
                    }
                  >
                    Permissions
                  </button>

                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => {
                      setField("name", r.name);
                      openModal("role-edit", r);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeleteId(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!data.length && (
              <tr>
                <td colSpan={2} className="text-center">
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {(modalType === "role-add" || modalType === "role-edit") && (
        <Modal
          title={
            modalType === "role-edit"
              ? "Edit Role"
              : "Add Role"
          }
          onClose={closeModal}
          onSave={save}
          saveDisabled={loading}
        >
          <input
            className={`form-control ${
              errors.name ? "is-invalid" : ""
            }`}
            value={values.name}
            onChange={(e) =>
              setField("name", e.target.value)
            }
          />
          {errors.name && (
            <div className="invalid-feedback">
              {errors.name[0]}
            </div>
          )}
        </Modal>
      )}

      {modalType === "permission" && modalData && (
        <RolePermissionModal
          roleId={modalData.id}
          onClose={closeModal}
        />
      )}

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this role?"
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            try {
              await deleteRole(deleteId).unwrap();
              handleApiSuccess(null, "Role deleted");
            } catch (e) {
              handleApiError(e);
            } finally {
              setDeleteId(null);
            }
          }}
        />
      )}
    </div>
  );
}
