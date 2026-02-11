import { memo, useMemo } from "react";

import AdminPage from "../../components/page/AdminPage";
import AdminCard from "../../components/ui/AdminCard";
import DataTable from "../../components/table/DataTable";
import RowActions from "../../components/table/RowActions";

import CrudModal from "../../../components/common/CrudModal";
import FormInput from "../../../components/common/FormInput";

import { useAppModal } from "../../../context/AppModalContext";
import { useCrudForm } from "../../../hooks/useCrudForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { useTableActions } from "../../hooks/useTableActions";

import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../../store/api";

import type { Permission } from "../../../types/models";
import { PERMISSIONS, ADMIN_ROLES } from "../../../constants/rbac";

import { getModalTitle } from "../../../utils/modalTitle";

function PermissionsPage() {
  const confirmAction = useConfirmAction();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Permission>();

  const { can } = useAuth();
  const { data: permissions = [], isLoading } =
    useGetPermissionsQuery();

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const form = useCrudForm({
    initialValues: { name: "" },
    create: createPermission,
    update: updatePermission,
    remove: deletePermission,
    onSuccess: closeModal,
  });

  const handleDelete = (permission: Permission) =>
    confirmAction({
      message: "Are you sure you want to delete this permission?",
      confirmLabel: "Delete Permission",
      onConfirm: async () => {
        await form.remove(permission.id);
      },
    });

  const rowActions = useTableActions<Permission>({
    canEdit: can(PERMISSIONS.PERMISSION.MANAGE),
    canDelete: can(PERMISSIONS.PERMISSION.MANAGE),
    onEdit: (permission) => {
      form.setField("name", permission.name);
      openModal("permission", permission);
    },
    onDelete: handleDelete,
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
    modalData?.id
      ? form.update(modalData.id)
      : form.create();
  };

  return (
    <AdminPage
      title="Permissions"
      permission={PERMISSIONS.PERMISSION.MANAGE}
      actionLabel="Add Permission"
      onAction={() => {
        form.reset();
        openModal("permission");
      }}
    >
      <AdminCard
        title="Permissions List"
        loading={isLoading}
        empty={!isLoading && permissions.length === 0}
        emptyText="No permissions found"
      >
        <DataTable columns={columns} colSpan={2}>
          {!isLoading &&
            permissions.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.name}</td>
                <td className="text-end">
                  <RowActions actions={rowActions(permission)} />
                </td>
              </tr>
            ))}
        </DataTable>
      </AdminCard>

      {modalType === "permission" && (
        <CrudModal
          title={getModalTitle("Permission", modalData)}
          loading={form.loading}
          onSave={handleSubmit}
          onClose={closeModal}
        >
          <FormInput
            label="Permission Name"
            value={form.values.name}
            error={form.errors.name?.[0]}
            onChange={(v) => form.setField("name", v)}
            disabled={form.loading}
            required
          />
        </CrudModal>
      )}
    </AdminPage>
  );
}

export default memo(PermissionsPage);
