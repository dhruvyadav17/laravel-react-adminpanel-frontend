import { memo, useMemo } from "react";

import AdminTablePage from "../../components/page/AdminTablePage";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";
import FormModal from "../../../components/common/FormModal";

import { useAppModal } from "../../../context/AppModalContext";
import { useCrudForm } from "../../../hooks/useCrudForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { useRowActions } from "../../hooks/useRowActions";

import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../../store/api";

import type { Role } from "../../../types/models";
import { PERMISSIONS } from "../../../constants/rbac";
import { ICONS } from "../../../constants/ui";

function RolesPage() {
  const confirmAction = useConfirmAction();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal();
  const { can } = useAuth();

  /* ================= QUERY ================= */

  const {
    data: roles = [],
    isLoading,
    isError,
    refetch,
  } = useGetRolesQuery();

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  /* ================= FORM ================= */

  const roleInitialValues = { name: "" };

  const form = useCrudForm({
    initialValues: roleInitialValues,
    create: createRole,
    update: updateRole,
    remove: deleteRole,
    onSuccess: closeModal,
  });

  /* ================= DELETE ================= */

  const handleDelete = (role: Role) =>
    confirmAction({
      message:
        "Are you sure you want to delete this role?",
      confirmLabel: "Delete Role",
      onConfirm: async () => {
        await form.remove(role.id);
      },
    });

  /* ================= RESTORE ================= */
  // ⚠ Replace when restore API exists

  const handleRestore = async (role: Role) => {
    await form.remove(role.id);
  };

  /* ================= ROW ACTIONS ================= */

  const getRowActions = (role: Role) =>
    useRowActions<Role>({
      row: role,
      isDeleted: !!role.deleted_at,

      edit: {
        enabled: can(PERMISSIONS.ROLE.MANAGE),
        onClick: (r) =>
          openModal("role-form", r),
      },

      delete: {
        enabled: can(PERMISSIONS.ROLE.MANAGE),
        onClick: handleDelete,
      },

      restore: {
        enabled: !!role.deleted_at,
        onClick: handleRestore,
      },

      extra: [
        {
          key: "permissions",
          icon: ICONS.PERMISSION,
          title: "Assign Permissions",
          show: can(
            PERMISSIONS.ROLE.MANAGE
          ),
          onClick: (r) =>
            openModal("assign", {
              mode: "role-permission",
              entity: r,
            }),
        },
      ],
    });

  /* ================= TABLE COLUMNS ================= */

  const columns = useMemo(
    () => (
      <tr>
        <th>Name</th>
        <th className="text-end">
          Actions
        </th>
      </tr>
    ),
    []
  );

  return (
    <>
      <AdminTablePage
        title="Roles"
        permission={PERMISSIONS.ROLE.MANAGE}
        actionLabel="Add Role"
        actionIcon={ICONS.ADD}
        onAction={() =>
          openModal("role-form", null)
        }
        loading={isLoading}
        error={isError}
        onRetry={refetch}
        empty={
          !isLoading &&
          !isError &&
          roles.length === 0
        }
        emptyText="No roles found"
        columns={columns}
      >
        {!isLoading &&
          !isError &&
          roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td className="text-end">
                <RowActions
                  actions={getRowActions(role)}
                />
              </td>
            </tr>
          ))}
      </AdminTablePage>

      {/* ================= FORM MODAL ================= */}

      {modalType === "role-form" && (
        <FormModal
          title={
            modalData
              ? "Edit Role"
              : "Add Role"
          }
          entity={modalData}
          initialValues={roleInitialValues}
          form={form}
          onClose={closeModal}
          fields={[
            {
              name: "name",
              label: "Role Name",
              required: true,
            },
          ]}
        />
      )}

      {/* ================= ASSIGN MODAL ================= */}

      {modalType === "assign" &&
        modalData &&
        "mode" in modalData &&
        "entity" in modalData && (
          <AssignModal
            mode={modalData.mode}
            entity={modalData.entity}
            onClose={closeModal}
          />
        )}
    </>
  );
}

export default memo(RolesPage);
