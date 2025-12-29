//import { useState } from "react";
import Modal from "../../components/common/Modal";
import RolePermissionModal from "../../components/RolePermissionModal";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";
import { useConfirm } from "../../hooks/useConfirm";

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

  const { confirm, ConfirmUI } = useConfirm();

  /* ================= DATA ================= */
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  /* ================= FORM ================= */
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
  if (!can(PERMISSIONS.ROLE_MANAGE)) {
    return <p className="text-danger mt-4">Unauthorized</p>;
  }

  /* ================= SAVE (ADD / EDIT) ================= */
  const save = async () => {
    try {
      setLoading(true);

      const res = modalData?.id
        ? await updateRole({
            id: modalData.id,
            name: values.name,
          }).unwrap()
        : await createRole(values).unwrap();

      handleApiSuccess(
        res,
        modalData?.id ? "Role updated" : "Role created"
      );

      closeModal();
      reset();
    } catch (e) {
      handleError(e);     // backend field errors
      handleApiError(e);  // toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Roles</h3>

        <Button
          label="+ Add Role"
          onClick={() => {
            reset();
            openModal("role-add");
          }}
        />
      </div>

      {/* ================= LIST ================= */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th style={{ width: 260 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((r: any) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  <RowActions
                    actions={[
                      {
                        label: "Permissions",
                        variant: "secondary",
                        onClick: () =>
                          openModal("permission", r),
                      },
                      {
                        label: "Edit",
                        variant: "warning",
                        onClick: () => {
                          setField("name", r.name);
                          openModal("role-edit", r);
                        },
                      },
                      {
                        label: "Delete",
                        variant: "danger",
                        onClick: () =>
                          confirm(async () => {
                            try {
                              await deleteRole(r.id).unwrap();
                              handleApiSuccess(
                                null,
                                "Role deleted"
                              );
                            } catch (e) {
                              handleApiError(e);
                            }
                          }),
                      },
                    ]}
                  />
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
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
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
          button_name={
            modalType === "role-edit"
              ? "Update"
              : "Save"
          }
        >
          <input
            className={`form-control ${
              errors.name ? "is-invalid" : ""
            }`}
            placeholder="Role name"
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

      {/* ================= ASSIGN PERMISSIONS ================= */}
      {modalType === "permission" && modalData && (
        <RolePermissionModal
          roleId={modalData.id}
          onClose={closeModal}
        />
      )}

      {/* ================= CONFIRM MODAL ================= */}
      {ConfirmUI}
    </div>
  );
}
