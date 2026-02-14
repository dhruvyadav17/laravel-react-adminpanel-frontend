import { memo, useMemo } from "react";

import AdminTablePage from "../../components/page/AdminTablePage";
import RowActions from "../../components/table/RowActions";
import FormModal from "../../../components/common/FormModal";

import { useAppModal } from "../../../context/AppModalContext";
import { useCrudForm } from "../../../hooks/useCrudForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { useRowActions } from "../../hooks/useRowActions";

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

  /* ================= FORM ================= */

  const permissionInitialValues = {
    name: "",
  };

  const form = useCrudForm({
    initialValues: permissionInitialValues,
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

  const getRowActions = (permission: Permission) =>
    useRowActions<Permission>({
      row: permission,

      edit: {
        enabled: can(
          PERMISSIONS.PERMISSION.MANAGE
        ),
        onClick: (p) =>
          openModal("permission-form", p),
      },

      delete: {
        enabled: can(
          PERMISSIONS.PERMISSION.MANAGE
        ),
        onClick: handleDelete,
      },
    });

  /* ================= TABLE COLUMNS ================= */

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
    <>
      <AdminTablePage
        title="Permissions"
        permission={PERMISSIONS.PERMISSION.MANAGE}
        actionLabel="Add Permission"
        actionIcon={ICONS.ADD}
        onAction={() =>
          openModal("permission-form", null)
        }
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
                <td>{permission.name}</td>
                <td className="text-end">
                  <RowActions
                    actions={getRowActions(
                      permission
                    )}
                  />
                </td>
              </tr>
            )
          )}
      </AdminTablePage>

      {/* ================= FORM MODAL ================= */}

      {modalType === "permission-form" && (
        <FormModal
          title={
            modalData
              ? "Edit Permission"
              : "Add Permission"
          }
          entity={modalData}
          initialValues={
            permissionInitialValues
          }
          form={form}
          onClose={closeModal}
          fields={[
            {
              name: "name",
              label: "Permission Name",
              required: true,
            },
          ]}
        />
      )}
    </>
  );
}

export default memo(PermissionsPage);
