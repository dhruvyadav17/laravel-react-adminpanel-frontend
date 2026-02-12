import { memo, useMemo } from "react";

import AdminTablePage from "../../components/page/AdminTablePage";
import RowActions from "../../components/table/RowActions";
import EntityCrudModal from "../../components/modals/EntityCrudModal";

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
import { PERMISSIONS } from "../../../constants/rbac";
import { ICONS } from "../../../constants/ui";

function PermissionsPage() {
  const confirmAction = useConfirmAction();

  const { modalType, modalData, openModal, closeModal } =
    useAppModal();

  const { can } = useAuth();

  /* ================= QUERY ================= */

  const {
    data: permissions = [],
    isLoading,
    isError,
    refetch,
  } = useGetPermissionsQuery();

  const [createPermission] =
    useCreatePermissionMutation();
  const [updatePermission] =
    useUpdatePermissionMutation();
  const [deletePermission] =
    useDeletePermissionMutation();

  const form = useCrudForm({
    initialValues: { name: "" },
    create: createPermission,
    update: updatePermission,
    remove: deletePermission,
    onSuccess: closeModal,
  });

  /* ================= DELETE ================= */

  const handleDelete = (permission: Permission) =>
    confirmAction({
      message:
        "Are you sure you want to delete this permission?",
      confirmLabel: "Delete Permission",
      onConfirm: async () => {
        await form.remove(permission.id);
      },
    });

  /* ================= ROW ACTIONS ================= */

  const rowActions =
    useTableActions<Permission>({
      canEdit: can(
        PERMISSIONS.PERMISSION.MANAGE
      ),
      canDelete: can(
        PERMISSIONS.PERMISSION.MANAGE
      ),

      onEdit: (permission) => {
        form.setField(
          "name",
          permission.name
        );
        openModal(
          "permission",
          permission
        );
      },

      onDelete: handleDelete,
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
        title="Permissions"
        permission={
          PERMISSIONS.PERMISSION.MANAGE
        }
        actionLabel="Add Permission"
        actionIcon={ICONS.ADD}
        onAction={() => {
          form.reset();
          openModal(
            "permission",
            null
          );
        }}
        loading={isLoading}
        error={isError}
        onRetry={refetch}
        empty={
          !isLoading &&
          !isError &&
          permissions.length === 0
        }
        emptyText="No permissions found"
        columns={columns}
      >
        {!isLoading &&
          !isError &&
          permissions.map(
            (permission) => (
              <tr key={permission.id}>
                <td>
                  {permission.name}
                </td>
                <td className="text-end">
                  <RowActions
                    actions={rowActions(
                      permission
                    )}
                  />
                </td>
              </tr>
            )
          )}
      </AdminTablePage>

      {/* ================= CRUD MODAL ================= */}

      {modalType ===
        "permission" &&(
          <EntityCrudModal
            entityName="Permission"
            modalData={modalData}
            form={form}
            onClose={closeModal}
          />
        )}
    </>
  );
}

export default memo(PermissionsPage);
