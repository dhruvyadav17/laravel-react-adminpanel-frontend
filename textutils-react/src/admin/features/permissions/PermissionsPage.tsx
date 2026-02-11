import { memo, useMemo } from "react";

import FormModal from "../../../components/common/FormModal";
import FormInput from "../../../components/common/FormInput";

import AdminPage from "../../components/page/AdminPage";
import CrudTableCard from "../../components/crud/CrudTableCard";
import RowActions from "../../components/table/RowActions";
import { useTableActions } from "../../hooks/useTableActions";

import { useAppModal } from "../../../context/AppModalContext";
import { useModalForm } from "../../../hooks/useModalForm";
import { useAuth } from "../../../auth/hooks/useAuth";

import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../../store/api";

import type { Permission } from "../../../types/models";
import { PERMISSIONS } from "../../../constants/permissions";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { getModalTitle } from "../../../utils/modalTitle";
import { execute } from "../../../utils/execute";

function PermissionsPage() {
  const confirmAction = useConfirmAction();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Permission>();

  const { data: permissions = [], isLoading } =
    useGetPermissionsQuery();

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const { can } = useAuth();

  /* ================= FORM ================= */

  const form = useModalForm(
    { name: "" },
    {
      onSubmit: (values) =>
        modalData?.id
          ? updatePermission({
              id: modalData.id,
              name: values.name,
            }).unwrap()
          : createPermission(values).unwrap(),

      onSuccess: closeModal,

      successMessage: modalData?.id
        ? "Permission updated successfully"
        : "Permission created successfully",
    }
  );

  /* ================= DELETE ================= */

  const handleDelete = (permission: Permission) =>
    confirmAction({
      message: "Are you sure you want to delete this permission?",
      confirmLabel: "Delete Permission",
      onConfirm: async () => {
        await execute(
          () => deletePermission(permission.id).unwrap(),
          {
            variant: "danger",
            defaultMessage: "Permission deleted successfully",
          }
        );
      },
    });

  /* ================= TABLE ACTIONS ================= */

  const rowActions = useTableActions<Permission>({
    canEdit: can(PERMISSIONS.PERMISSION.MANAGE),
    canDelete: can(PERMISSIONS.PERMISSION.MANAGE),

    onEdit: (permission) => {
      form.setField("name", permission.name);
      openModal("permission", permission);
    },

    onDelete: handleDelete,
  });

  /* ================= TABLE HEADER ================= */

  const columns = useMemo(
    () => (
      <tr>
        <th>Name</th>
        <th className="text-end">Actions</th>
      </tr>
    ),
    []
  );

  /* ================= VIEW ================= */

  return (
    <AdminPage
      title="Permissions"
      permission={PERMISSIONS.PERMISSION.MANAGE}
      actionLabel="+ Add Permission"
      onAction={() => {
        form.reset();
        openModal("permission");
      }}
    >
      <CrudTableCard<Permission>
        title="Permissions List"
        loading={isLoading}
        data={permissions}
        emptyText="No permissions found"
        colSpan={2}
        columns={columns}
        renderRow={(permission) => (
          <tr key={permission.id}>
            <td>{permission.name}</td>
            <td className="text-end">
              <RowActions actions={rowActions(permission)} />
            </td>
          </tr>
        )}
      />

      {modalType === "permission" && (
        <FormModal
          title={getModalTitle("Permission", modalData)}
          loading={form.loading}
          onSave={form.submit}
          onClose={closeModal}
          saveText={modalData?.id ? "Update" : "Save"}
        >
          <FormInput
            label="Permission Name"
            value={form.values.name}
            error={form.errors.name?.[0]}
            onChange={(v) => form.setField("name", v)}
            disabled={form.loading}
            required
          />
        </FormModal>
      )}
    </AdminPage>
  );
}

export default memo(PermissionsPage);
