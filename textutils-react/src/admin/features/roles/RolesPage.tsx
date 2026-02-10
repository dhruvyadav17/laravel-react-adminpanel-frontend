import { memo } from "react";

import FormInput from "../../../components/common/FormInput";
import Modal from "../../../components/common/Modal";

import { useModalForm } from "../../../hooks/useModalForm";
import { useAppModal } from "../../../context/AppModalContext";
import { useAuth } from "../../../auth/hooks/useAuth";

import DataTable from "../../components/table/DataTable";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";

// ✅ CORRECT IMPORT (GLOBAL / CANONICAL)
import {
  Card,
  CardHeader,
  CardBody,
} from "../../../components/ui/Card";

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
import PageActions from "../../components/page/PageActions";
import { getModalTitle } from "../../../utils/modalTitle";
import { execute } from "../../../utils/execute";

function RolesPage() {
  const confirmAction = useConfirmAction();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  const { data: roles = [], isLoading } =
    useGetRolesQuery();

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
    }
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
    <section className="content pt-3">
      <div className="container-fluid">
        <PageActions
          title="Roles"
          permission={PERMISSIONS.ROLE.MANAGE}
          buttonLabel="+ Add Role"
          onClick={() => {
            form.reset();
            openModal("role-add");
          }}
        />

        <Card>
          <CardHeader title="Roles List" />

          <CardBody
            className="p-0"
            loading={isLoading}
            empty={!roles.length}
            emptyText="No roles found"
          >
            <DataTable
              colSpan={2}
              columns={
                <tr>
                  <th>Name</th>
                  <th className="text-end">Actions</th>
                </tr>
              }
            >
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td className="text-end">
                    <RowActions
                      actions={getRowActions(role)}
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {/* MODALS */}
        {(modalType === "role-add" ||
          modalType === "role-edit") && (
          <Modal
            title={getModalTitle("Role", modalData)}
            onClose={closeModal}
            onSave={form.submit}
            saveDisabled={form.loading}
            saveText={
              modalType === "role-edit"
                ? "Update"
                : "Save"
            }
          >
            <FormInput
              label="Role Name"
              value={form.values.name}
              error={form.errors.name?.[0]}
              onChange={(v) =>
                form.setField("name", v)
              }
              disabled={form.loading}
              required
            />
          </Modal>
        )}

        {modalType === "assign" && modalData && (
          <AssignModal
            mode={modalData.mode}
            entity={modalData.entity}
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  );
}

export default memo(RolesPage);
