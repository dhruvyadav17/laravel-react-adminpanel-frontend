//import { useState } from "react";

import Modal from "../../components/common/Modal";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";

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
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

export default function Permissions() {
  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } = useAppModal<any>();

  /* ================= DATA ================= */
  const { data: permissions = [], isLoading } = useGetPermissionsQuery();

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  /* ================= FORM ================= */
  const { values, errors, loading, setLoading, setField, handleError, reset } =
    useBackendForm({ name: "" });

  /* ================= GUARD ================= */
  if (!can(PERMISSIONS.PERMISSION.MANAGE)) {
    return <p className="text-danger mt-4">Unauthorized</p>;
  }

  /* ================= SAVE (ADD / EDIT) ================= */
  const save = async () => {
    try {
      setLoading(true);

      const res = modalData?.id
        ? await updatePermission({
            id: modalData.id,
            name: values.name,
          }).unwrap()
        : await createPermission(values).unwrap();

      handleApiSuccess(
        res,
        modalData?.id ? "Permission updated" : "Permission created"
      );

      closeModal();
      reset();
    } catch (e) {
      handleError(e); // backend field errors
      handleApiError(e); // toast
    } finally {
      setLoading(false);
    }
  };
  const confirmDelete = useConfirmDelete();
  return (
    <div className="container mt-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Permissions</h3>

        <Button
          label="+ Add Permission"
          onClick={() => {
            reset();
            openModal("permission");
          }}
        />
      </div>

      {/* ================= TABLE ================= */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th style={{ width: 180 }} className="text-end">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {permissions.map((p: any) => (
              <tr key={p.id}>
                <td>{p.name}</td>

                <td className="text-end">
                  <RowActions
                    actions={[
                      {
                        label: "Edit",
                        variant: "warning",
                        onClick: () => {
                          setField("name", p.name);
                          openModal("permission", p);
                        },
                      },
                      {
                        label: "Delete",
                        variant: "danger",
                        onClick: () =>
                          confirmDelete(
                            "Are you sure you want to delete this permission?",
                            async () => {
                              await deletePermission(p.id).unwrap();
                              handleApiSuccess(null, "Permission deleted");
                            }
                          ),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}

            {!permissions.length && (
              <tr>
                <td colSpan={2} className="text-center">
                  No permissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Permission name"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            disabled={loading}
          />

          {errors.name && (
            <div className="invalid-feedback">{errors.name[0]}</div>
          )}
        </Modal>
      )}
    </div>
  );
}
