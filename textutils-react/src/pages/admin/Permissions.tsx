import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { PERMISSIONS } from "../../constants/permissions";
import { usePermission } from "../../auth/hooks/usePermission";
import { useAppModal } from "../../hooks/useAppModal";
import { useBackendForm } from "../../hooks/useBackendForm";
import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../store/api";
import { handleApiError, handleApiSuccess } from "../../utils/toastHelper";
import { useState } from "react";

export default function Permissions() {
  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data = [], isLoading } = useGetPermissionsQuery();

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const {
    values,
    errors,
    loading,
    setLoading,
    setField,
    handleError,
    reset,
  } = useBackendForm({ name: "" });

  /* ================= GUARD ================= */
  if (!can(PERMISSIONS.PERMISSION_MANAGE)) {
    return <p className="text-danger">Unauthorized</p>;
  }

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      setLoading(true);

      const res = modalData?.id
        ? await updatePermission({
            id: modalData.id,
            name: values.name,
          }).unwrap()
        : await createPermission(values).unwrap();

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
        <h3>Permissions</h3>

        <button
          className="btn btn-primary"
          onClick={() => {
            reset();
            openModal("permission");
          }}
        >
          + Add Permission
        </button>
      </div>

      {/* ================= LIST ================= */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-group">
          {data.map((p: any) => (
            <li
              key={p.id}
              className="list-group-item d-flex justify-content-between"
            >
              {p.name}

              <div>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setField("name", p.name);
                    openModal("permission", p);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger ms-1"
                  onClick={() => setDeleteId(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalType === "permission" && (
        <Modal
          title="Permission"
          onClose={closeModal}
          onSave={save}
          saveDisabled={loading}
          button_name={modalData?.id ? "Update" : "Save"}
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

      {/* ================= DELETE CONFIRM ================= */}
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this permission?"
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            try {
              await deletePermission(deleteId).unwrap();
              handleApiSuccess(null, "Permission deleted");
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
