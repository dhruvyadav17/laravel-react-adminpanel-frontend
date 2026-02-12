import { memo, useMemo } from "react";

import AdminTablePage from "../../components/page/AdminTablePage";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";
import EntityCrudModal from "../../components/modals/EntityCrudModal";

import { useAppModal } from "../../../context/AppModalContext";
import { useCrudForm } from "../../../hooks/useCrudForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { useSoftDeleteRowActions } from "../../hooks/useSoftDeleteRowActions";

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
    useAppModal();

  const { can } = useAuth();
  const { data: roles = [], isLoading } =
    useGetRolesQuery();

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
      message:
        "Are you sure you want to delete this role?",
      confirmLabel: "Delete Role",
      onConfirm: async () => {
        await form.remove(role.id);
      },
    });

  /* ================= RESTORE (if soft delete exists) ================= */

  const handleRestore = async (role: Role) => {
    await form.remove(role.id); // Replace with restore API if available
  };

  /* ================= ROW ACTIONS ================= */

  const getRowActions =
    useSoftDeleteRowActions<Role>({
      isDeleted: (role) =>
        !!role.deleted_at,

      activeConfig: {
        canEdit: can(
          PERMISSIONS.ROLE.MANAGE
        ),
        canDelete: can(
          PERMISSIONS.ROLE.MANAGE
        ),

        onEdit: (role) => {
          form.setField(
            "name",
            role.name
          );
          openModal(
            "role-edit",
            role
          );
        },

        onDelete: handleDelete,

        extraActions: [
          {
            key: "permissions",
            icon: ICONS.PERMISSION,
            title:
              "Assign Permissions",
            show: can(
              PERMISSIONS.ROLE.MANAGE
            ),
            onClick: (role) =>
              openModal(
                "assign",
                {
                  mode: "role-permission",
                  entity: role,
                }
              ),
          },
        ],
      },

      deletedConfig: {
        extraActions: [
          {
            key: "restore",
            icon: ICONS.RESTORE,
            title:
              "Restore Role",
            variant: "success",
            onClick:
              handleRestore,
          },
        ],
      },
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
        title="Roles"
        permission={
          PERMISSIONS.ROLE.MANAGE
        }
        actionLabel="Add Role"
        actionIcon={ICONS.ADD}
        onAction={() => {
          form.reset();
          openModal(
            "role-add",
            null
          );
        }}
        loading={isLoading}
        empty={
          !isLoading &&
          roles.length === 0
        }
        emptyText="No roles found"
        columns={columns}
      >
        {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.name}</td>
            <td className="text-end">
              <RowActions
                actions={getRowActions(
                  role
                )}
              />
            </td>
          </tr>
        ))}
      </AdminTablePage>

      {/* ================= ROLE CRUD MODAL ================= */}

      {(modalType === "role-add" ||
        modalType === "role-edit") &&(
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
        "mode" in modalData &&
        "entity" in modalData && (
          <AssignModal
            mode={modalData.mode}
            entity={modalData.entity}
            onClose={closeModal}
          />
        )}
    </>
  );
}

export default memo(RolesPage);
