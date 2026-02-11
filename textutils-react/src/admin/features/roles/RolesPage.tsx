import { memo } from "react";

import FormInput from "../../../components/common/FormInput";
import FormModal from "../../../components/common/FormModal";

import { useModalForm } from "../../../hooks/useModalForm";
import { useAppModal } from "../../../context/AppModalContext";
import { useAuth } from "../../../auth/hooks/useAuth";

import AdminPage from "../../components/page/AdminPage";
import AdminTable from "../../components/table/AdminTable";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";

import { Card, CardHeader, CardBody } from "../../../components/ui/Card";

import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../../store/api";

import type { Role } from "../../../types/models";
import { PERMISSIONS } from "../../../constants/permissions";
import { ICONS } from "../../../constants/icons";

import { useTableActions } from "../../hooks/useTableActions";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { getModalTitle } from "../../../utils/modalTitle";
import { execute } from "../../../utils/execute";

function RolesPage() {
  const confirmAction = useConfirmAction();
  const { modalType, modalData, openModal, closeModal } = useAppModal<any>();

  const { data: roles = [], isLoading } = useGetRolesQuery();

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const { can } = useAuth();

  /* ================= FORM ================= */

  const form = useModalForm(
    { name: "" },
    {
      onSubmit: (values) =>
        modalType === "role-edit"
          ? updateRole({
              id: modalData.id,
              name: values.name,
            }).unwrap()
          : createRole(values).unwrap(),

      onSuccess: closeModal,
    },
  );

  /* ================= ACTIONS ================= */

  const handleDelete = (role: Role) =>
    confirmAction({
      message: "Are you sure you want to delete this role?",
      confirmLabel: "Delete Role",
      onConfirm: async () => {
        await execute(() => deleteRole(role.id).unwrap(), {
          variant: "danger",
          defaultMessage: "Role deleted successfully",
        });
      },
    });

  const getRowActions = useTableActions<Role>({
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

  /* ================= VIEW ================= */

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
      <Card>
        <CardHeader title="Roles List" />

        <CardBody className="p-0" loading={isLoading}>
          <AdminTable<Role>
            loading={isLoading}
            data={roles}
            colSpan={2}
            columns={
              <tr>
                <th>Name</th>
                <th className="text-end">Actions</th>
              </tr>
            }
            renderRow={(role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td className="text-end">
                  <RowActions actions={getRowActions(role)} />
                </td>
              </tr>
            )}
          />
        </CardBody>
      </Card>

      {/* ================= MODALS ================= */}

      {(modalType === "role-add" || modalType === "role-edit") && (
        <FormModal
          title={getModalTitle("Role", modalData)}
          loading={form.loading}
          onSave={form.submit}
          onClose={closeModal}
          saveText={modalType === "role-edit" ? "Update" : "Save"}
        >
          <FormInput
            label="Role Name"
            value={form.values.name}
            error={form.errors.name?.[0]}
            onChange={(v) => form.setField("name", v)}
            disabled={form.loading}
            required
          />
        </FormModal>
      )}

      {modalType === "assign" && modalData?.mode && modalData?.entity && (
        <AssignModal
          mode={modalData.mode}
          entity={modalData.entity}
          onClose={closeModal}
        />
      )}
    </AdminPage>
  );
}

export default memo(RolesPage);
