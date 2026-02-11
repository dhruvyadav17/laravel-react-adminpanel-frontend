import { memo } from "react";

import FormModal from "../../../components/common/FormModal";
import FormInput from "../../../components/common/FormInput";

import AdminPage from "../../components/page/AdminPage";
import AdminTable from "../../components/table/AdminTable";
import RowActions from "../../components/table/RowActions";
import { useTableActions } from "../../hooks/useTableActions";

import { Card, CardHeader, CardBody } from "../../../components/ui/Card";

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

  const { data: permissions = [], isLoading } = useGetPermissionsQuery();

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const { can } = useAuth();

  /* ================= MODAL FORM ================= */

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
    },
  );

  /* ================= DELETE ================= */

  const handleDelete = (permission: Permission) =>
    confirmAction({
      message: "Are you sure you want to delete this permission?",
      confirmLabel: "Delete Permission",
      onConfirm: async () => {
        await execute(() => deletePermission(permission.id).unwrap(), {
          variant: "danger",
          defaultMessage: "Permission deleted successfully",
        });
      },
    });

  /* ================= TABLE ACTIONS ================= */

  const getRowActions = useTableActions<Permission>({
    canEdit: can(PERMISSIONS.PERMISSION.MANAGE),
    canDelete: can(PERMISSIONS.PERMISSION.MANAGE),

    onEdit: (permission) => {
      form.setField("name", permission.name);
      openModal("permission", permission);
    },

    onDelete: handleDelete,
  });

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
      <Card>
        <CardHeader title="Permissions List" />
        <CardBody className="p-0" loading={isLoading}>
          <AdminTable<Permission>
            loading={isLoading}
            data={permissions}
            colSpan={2}
            columns={
              <tr>
                <th>Name</th>
                <th className="text-end">Actions</th>
              </tr>
            }
            renderRow={(permission) => (
              <tr key={permission.id}>
                <td>{permission.name}</td>
                <td className="text-end">
                  <RowActions actions={getRowActions(permission)} />
                </td>
              </tr>
            )}
          />
        </CardBody>
      </Card>

      {/* ================= MODAL ================= */}

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
