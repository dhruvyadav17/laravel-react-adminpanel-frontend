import { memo, useMemo } from "react";

import AdminPage from "../../components/page/AdminPage";
import AdminCard from "../../components/ui/AdminCard";
import DataTable from "../../components/table/DataTable";
import TableEmptyRow from "../../components/table/TableEmptyRow";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";

import CrudModal from "../../../components/common/CrudModal";
import FormInput from "../../../components/common/FormInput";

import { useAppModal } from "../../../context/AppModalContext";
import { useModalForm } from "../../../hooks/useModalForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTableActions } from "../../hooks/useTableActions";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { useCrudHandlers } from "../../../hooks/useCrudHandlers";

import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../../store/api";

import type { Role } from "../../../types/models";
import { PERMISSIONS } from "../../../constants/permissions";
import { ICONS } from "../../../constants/icons";
import { getModalTitle } from "../../../utils/modalTitle";
import { execute } from "../../../utils/execute";

function RolesPage() {
  const confirmAction = useConfirmAction();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Role>();

  const { can } = useAuth();
  const { data: roles = [], isLoading } = useGetRolesQuery();

  const [createMutation] = useCreateRoleMutation();
  const [updateMutation] = useUpdateRoleMutation();
  const [deleteMutation] = useDeleteRoleMutation();

  const { create, update, remove } = useCrudHandlers({
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  });

  const form = useModalForm(
    { name: "" },
    {
onSubmit: (values) =>
  modalType === "role-edit" && modalData?.id
    ? update(modalData.id, values)
    : create(values),
      onSuccess: closeModal,
    }
  );

  const handleDelete = (role: Role) =>
    confirmAction({
      message: "Are you sure you want to delete this role?",
      confirmLabel: "Delete Role",
      onConfirm: async () => {
        await execute(() => remove(role.id), {
          variant: "danger",
          defaultMessage: "Role deleted successfully",
        });
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
        <DataTable columns={columns} colSpan={2}>
          {!isLoading &&
            roles.map((role) => (
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
          onSave={form.submit}
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
