import { memo, useMemo } from "react";

import AdminPage from "../../components/page/AdminPage";
import AdminCard from "../../components/ui/AdminCard";
import DataTable from "../../components/table/DataTable";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";

import CrudModal from "../../../components/common/CrudModal";
import FormInput from "../../../components/common/FormInput";

import { useAppModal } from "../../../context/AppModalContext";
import { useCrudForm } from "../../../hooks/useCrudForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTableActions } from "../../hooks/useTableActions";
import { useConfirmAction } from "../../../hooks/useConfirmAction";

import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../../store/api";

import type { Role } from "../../../types/models";
import { PERMISSIONS } from "../../../constants/rbac";
import { ICONS } from "../../../constants/ui";
import { getModalTitle } from "../../../utils/modalTitle";

function RolesPage() {
  const confirmAction = useConfirmAction();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Role>();

  const { can } = useAuth();
  const { data: roles = [], isLoading } = useGetRolesQuery();

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const form = useCrudForm({
    initialValues: { name: "" },
    create: createRole,
    update: updateRole,
    remove: deleteRole,
    onSuccess: closeModal,
  });

  const handleDelete = (role: Role) =>
    confirmAction({
      message: "Are you sure you want to delete this role?",
      confirmLabel: "Delete Role",
      onConfirm: async () => {
        await form.remove(role.id);
      },
    });

  const rowActions = useTableActions<Role>({
    canEdit: can(PERMISSIONS.ROLE.MANAGE),
    canDelete: can(PERMISSIONS.ROLE.MANAGE),
    onEdit: (role) => {
      form.setField("name", role.name);
      openModal("role-edit", role);
    },
    onDelete: handleDelete,
    extraActions: [
      {
        key: "permissions",
        icon: ICONS.PERMISSION,
        title: "Assign Permissions",
        show: can(PERMISSIONS.ROLE.MANAGE),
        onClick: (role) =>
          openModal("assign", {
            mode: "role-permission",
            entity: role,
          }),
      },
    ],
  });

  const columns = useMemo(
    () => (
      <tr>
        <th>Name</th>
        <th className="text-end">Actions</th>
      </tr>
    ),
    []
  );

  const handleSubmit = () => {
    modalType === "role-edit" && modalData?.id
      ? form.update(modalData.id)
      : form.create();
  };

  return (
    <AdminPage
      title="Roles"
      permission={PERMISSIONS.ROLE.MANAGE}
      actionLabel="Add Role"
      actionIcon={ICONS.ADD}
      onAction={() => {
        form.reset();
        openModal("role-add");
      }}
    >
      <AdminCard
        title="Roles List"
        loading={isLoading}
        empty={!isLoading && roles.length === 0}
        emptyText="No roles found"
      >
        <DataTable
          columns={columns}
          colSpan={2}
          isLoading={isLoading}
          isEmpty={!isLoading && roles.length === 0}
        >
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td className="text-end">
                <RowActions actions={rowActions(role)} />
              </td>
            </tr>
          ))}
        </DataTable>
      </AdminCard>

      {(modalType === "role-add" || modalType === "role-edit") && (
        <CrudModal
          title={getModalTitle("Role", modalData)}
          loading={form.loading}
          onSave={handleSubmit}
          onClose={closeModal}
        >
          <FormInput
            label="Role Name"
            value={form.values.name}
            error={form.errors.name?.[0]}
            onChange={(v) => form.setField("name", v)}
            disabled={form.loading}
            required
          />
        </CrudModal>
      )}

      {modalType === "assign" &&
        modalData &&
        (modalData as any)?.mode &&
        (modalData as any)?.entity && (
          <AssignModal
            mode={(modalData as any).mode}
            entity={(modalData as any).entity}
            onClose={closeModal}
          />
        )}
    </AdminPage>
  );
}

export default memo(RolesPage);
