import { memo } from "react";

import Modal from "../../../components/common/Modal";
import FormInput from "../../../components/common/FormInput";
import RowActions from "../../../components/common/RowActions";
import DataTable from "../../../components/common/DataTable";
import { useTableActions } from "../../../components/common/useTableActions";

import Card from "../shared/ui/Card";
import CardHeader from "../shared/ui/CardHeader";
import CardBody from "../shared/ui/CardBody";

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
import { ICONS } from "../../../constants/icons";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import PageActions from "../../../components/common/PageActions";
import { getModalTitle } from "../../../utils/modalTitle";

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
    },
  );

  /* ================= DELETE ================= */

  const handleDelete = (permission: Permission) =>
    confirmAction({
      message: "Are you sure you want to delete this permission?",
      confirmLabel: "Delete Permission",
      onConfirm: async () => {
        await deletePermission(permission.id).unwrap();
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
    <section className="content pt-3">
      <div className="container-fluid">
        <PageActions
          title="Permissions"
          permission={PERMISSIONS.PERMISSION.MANAGE}
          buttonLabel="+ Add Permission"
          onClick={() => {
            form.reset();
            openModal("permission");
          }}
        />
        <Card>
          <CardHeader title="Permissions List" />
          <CardBody className="p-0">
            <DataTable
              isLoading={isLoading}
              colSpan={2}
              hasData={permissions.length > 0}
              columns={
                <tr>
                  <th>Name</th>
                  <th className="text-end">Actions</th>
                </tr>
              }
            >
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td>{permission.name}</td>
                  <td className="text-end">
                    <RowActions actions={getRowActions(permission)} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {/* ================= ADD / EDIT MODAL ================= */}
        {modalType === "permission" && (
          <Modal
            title={getModalTitle("Permission", modalData)}
            onClose={closeModal}
            onSave={form.submit}
            saveDisabled={form.loading}
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
          </Modal>
        )}
      </div>
    </section>
  );
}

export default memo(PermissionsPage);
