import { memo, useMemo } from "react";

import AdminTablePage from "../../components/page/AdminTablePage";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";
import EntityCrudModal from "../../components/modals/EntityCrudModal";

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

  /* ================= DELETE ================= */

  const handleDelete = (role: Role) =>
    confirmAction({
      message: "Are you sure you want to delete this role?",
      confirmLabel: "Delete Role",
      onConfirm: async () => {
        await form.remove(role.id);
      },
    });

  /* ================= ROW ACTIONS ================= */

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
        title="Roles"
        permission={PERMISSIONS.ROLE.MANAGE}
        actionLabel="Add Role"
        actionIcon={ICONS.ADD}
        onAction={() => {
          form.reset();
          openModal("role-add");
        }}
        loading={isLoading}
        empty={!isLoading && roles.length === 0}
        emptyText="No roles found"
        columns={columns}
        colSpan={2}
      >
        {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.name}</td>
            <td className="text-end">
              <RowActions actions={rowActions(role)} />
            </td>
          </tr>
        ))}
      </AdminTablePage>

      {/* ================= ROLE CRUD MODAL ================= */}

      {(modalType === "role-add" || modalType === "role-edit") && (
        <EntityCrudModal
          entityName="Role"
          modalData={modalData}
          form={form}
          onClose={closeModal}
        />
      )}

      {/* ================= ASSIGN PERMISSIONS MODAL ================= */}

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
    </>
  );
}

export default memo(RolesPage);
