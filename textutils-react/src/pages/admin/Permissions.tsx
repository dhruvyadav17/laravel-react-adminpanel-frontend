import Modal from "../../components/common/Modal";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";

import { PERMISSIONS } from "../../constants/permissions";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAppModal } from "../../hooks/useAppModal";
import { useBackendForm } from "../../hooks/useBackendForm";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { Permission } from "../../types/models";

/* ================= COMPONENT ================= */

export default function Permissions() {
  const { can } = useAuth();
  const confirmDelete = useConfirmDelete();

  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Permission>();

  /* ================= DATA ================= */

  const { data: permissions = [], isLoading } =
    useGetPermissionsQuery();

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

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

  if (!can(PERMISSIONS.PERMISSION.MANAGE)) {
    return <p className="text-danger mt-4">Unauthorized</p>;
  }

  /* ================= HANDLERS ================= */

  const save = async () => {
    try {
      setLoading(true);

      await execute(
        () =>
          modalData?.id
            ? updatePermission({
                id: modalData.id,
                name: values.name,
              }).unwrap()
            : createPermission(values).unwrap(),
        modalData?.id
          ? "Permission updated"
          : "Permission created"
      );

      closeModal();
      reset();
    } catch (e) {
      handleError(e); // 🔥 Laravel 422 only
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (permission: Permission) =>
    confirmDelete(
      "Are you sure you want to delete this permission?",
      async () => {
        await execute(
          () => deletePermission(permission.id).unwrap(),
          "Permission deleted"
        );
      }
    );

  const getRowActions = (permission: Permission) => [
    {
      label: "Edit",
      variant: "warning" as const,
      onClick: () => {
        setField("name", permission.name);
        openModal("permission", permission);
      },
    },
    {
      label: "Delete",
      variant: "danger" as const,
      onClick: () => handleDelete(permission),
    },
  ];

  /* ================= VIEW ================= */

  return (
    <div className="container mt-4">
      <PageHeader
        title="Permissions"
        action={
          <Button
            label="+ Add Permission"
            onClick={() => {
              reset();
              openModal("permission");
            }}
          />
        }
      />

      <DataTable
        isLoading={isLoading}
        colSpan={2}
        columns={
          <tr>
            <th>Name</th>
            <th
              style={{ width: 180 }}
              className="text-end"
            >
              Actions
            </th>
          </tr>
        }
      >
        {permissions.map((permission) => (
          <tr key={permission.id}>
            <td>{permission.name}</td>
            <td className="text-end">
              <RowActions
                actions={getRowActions(permission)}
              />
            </td>
          </tr>
        ))}
      </DataTable>

      {/* ================= ADD / EDIT ================= */}

      {modalType === "permission" && (
        <Modal
          title="Permission"
          onClose={closeModal}
          onSave={save}
          saveDisabled={loading}
          button_name={
            modalData?.id ? "Update" : "Save"
          }
        >
          <input
            className={`form-control ${
              errors.name ? "is-invalid" : ""
            }`}
            placeholder="Permission name"
            value={values.name}
            onChange={(e) =>
              setField("name", e.target.value)
            }
            disabled={loading}
          />

          {errors.name && (
            <div className="invalid-feedback">
              {errors.name[0]}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
