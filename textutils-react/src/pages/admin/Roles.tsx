import Modal from "../../components/common/Modal";
import RolePermissionModal from "../../components/RolePermissionModal";
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
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { Role } from "../../types/models";

/* ================= COMPONENT ================= */

export default function Roles() {
  const { can } = useAuth();
  const confirmDelete = useConfirmDelete();

  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Role>();

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

  if (!can(PERMISSIONS.ROLE.MANAGE)) {
    return <p className="text-danger mt-4">Unauthorized</p>;
  }

  /* ================= HANDLERS ================= */

  const save = async () => {
    try {
      setLoading(true);

      await execute(
        () =>
          modalData?.id
            ? updateRole({
                id: modalData.id,
                name: values.name,
              }).unwrap()
            : createRole(values).unwrap(),
        modalData?.id ? "Role updated" : "Role created"
      );

      closeModal();
      reset();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (role: Role) =>
    confirmDelete(
      "Are you sure you want to delete this role?",
      async () => {
        await execute(
          () => deleteRole(role.id).unwrap(),
          "Role deleted"
        );
      }
    );

  const getRowActions = (role: Role) => [
    {
      label: "Permissions",
      variant: "secondary" as const,
      onClick: () => openModal("permission", role),
    },
    {
      label: "Edit",
      variant: "warning" as const,
      onClick: () => {
        setField("name", role.name);
        openModal("role-edit", role);
      },
    },
    {
      label: "Delete",
      variant: "danger" as const,
      onClick: () => handleDelete(role),
    },
  ];

  /* ================= VIEW ================= */

  return (
    <div className="container mt-4">
      <PageHeader
        title="Roles"
        action={
          <Button
            label="+ Add Role"
            onClick={() => {
              reset();
              openModal("role-add");
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
            <th style={{ width: 260 }}>Actions</th>
          </tr>
        }
      >
        {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.name}</td>
            <td>
              <RowActions actions={getRowActions(role)} />
            </td>
          </tr>
        ))}
      </DataTable>

      {/* ================= ADD / EDIT ================= */}

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
            modalType === "role-edit" ? "Update" : "Save"
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
    </div>
  );
}
