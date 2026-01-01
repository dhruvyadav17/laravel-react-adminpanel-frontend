import { useAuth } from "../../auth/hooks/useAuth";
import { PERMISSIONS } from "../../constants/permissions";
import { useAppModal } from "../../hooks/useAppModal";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";

import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";
import UserPermissionModal from "../../components/UserPermissionModal";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { User } from "../../types/models";

/* =====================================================
   USERS PAGE
   - AdminLTE 3
   - Bootstrap 4
   - Central Confirm Delete
   - Modular & Reusable
===================================================== */

export default function Users() {
  const { can } = useAuth();
  const confirmDelete = useConfirmDelete();

  const { modalType, modalData, openModal, closeModal } =
    useAppModal<User>();

  const { data: users = [], isLoading } =
    useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  /* ================= GUARD ================= */

  if (!can(PERMISSIONS.USER.VIEW)) {
    return (
      <p className="text-danger mt-4">
        Unauthorized
      </p>
    );
  }

  /* ================= HANDLERS ================= */

  const handleDelete = (user: User) =>
    confirmDelete(
      "Are you sure you want to delete this user?",
      async () => {
        await execute(
          () => deleteUser(user.id).unwrap(),
          "User deleted successfully"
        );
      }
    );

  const getRowActions = (user: User) => [
    ...(can(PERMISSIONS.USER.ASSIGN_ROLE)
      ? [
          {
            label: "Assign Role",
            variant: "secondary" as const,
            onClick: () =>
              openModal("user-role", user),
          },
        ]
      : []),

    ...(can(PERMISSIONS.PERMISSION.MANAGE)
      ? [
          {
            label: "Permissions",
            variant: "secondary" as const,
            onClick: () =>
              openModal(
                "user-permission",
                user
              ),
          },
        ]
      : []),

    {
      label: "Delete",
      variant: "danger" as const,
      onClick: () => handleDelete(user),
    },
  ];

  /* ================= VIEW ================= */

  return (
    <div className="container-fluid mt-3">
      <PageHeader
        title="Users"
        action={
          can(PERMISSIONS.USER.CREATE) && (
            <Button
              label="+ Add User"
              onClick={() =>
                openModal("user-form")
              }
            />
          )
        }
      />

      <DataTable
        isLoading={isLoading}
        colSpan={4}
        columns={
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th
              className="text-right"
              width={220}
            >
              Actions
            </th>
          </tr>
        }
      >
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              {user.roles.length
                ? user.roles.join(", ")
                : "—"}
            </td>
            <td className="text-right">
              <RowActions
                actions={getRowActions(
                  user
                )}
              />
            </td>
          </tr>
        ))}
      </DataTable>

      {/* ================= MODALS ================= */}

      {modalType === "user-form" && (
        <UserFormModal
          onClose={closeModal}
          onSaved={closeModal}
        />
      )}

      {modalType === "user-role" &&
        modalData && (
          <UserRoleModal
            user={modalData}
            onClose={closeModal}
            onSaved={closeModal}
          />
        )}

      {modalType === "user-permission" &&
        modalData && (
          <UserPermissionModal
            user={modalData}
            onClose={closeModal}
          />
        )}
    </div>
  );
}
