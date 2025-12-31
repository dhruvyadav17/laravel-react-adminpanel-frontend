import { usePermission } from "../../auth/hooks/usePermission";
import { PERMISSIONS } from "../../constants/permissions";
import { useAppModal } from "../../hooks/useAppModal";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";
import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";

import { useGetUsersQuery, useDeleteUserMutation } from "../../store/api";

import { execute } from "../../utils/execute";
import type { User } from "../../types/models";
import TableSkeleton from "../../components/common/TableSkeleton";
import UserPermissionModal from "../../components/UserPermissionModal";

/* ================= COMPONENT ================= */

export default function Users() {
  const can = usePermission();

  // 🔥 modalData is now strictly typed as User
  const { modalType, modalData, openModal, closeModal } = useAppModal<User>();

  const confirmDelete = useConfirmDelete();

  const { data: users = [], isLoading } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  /* ================= GUARD ================= */

  if (!can(PERMISSIONS.USER.VIEW)) {
    return <p className="text-danger">Unauthorized</p>;
  }

  /* ================= VIEW ================= */

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Users</h3>

        {can(PERMISSIONS.USER.CREATE) && (
          <Button label="+ Add User" onClick={() => openModal("user-form")} />
        )}
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th width="200">Actions</th>
          </tr>
        </thead>
        {isLoading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : (
          <tbody>
            {users.map((u: User) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles.length ? u.roles.join(", ") : "—"}</td>

                <td>
                  <RowActions
                    actions={[
                      ...(can(PERMISSIONS.USER.ASSIGN_ROLE)
                        ? [
                            {
                              label: "Assign Role",
                              variant: "secondary",
                              onClick: () => openModal("user-role", u),
                            },
                          ]
                        : []),

                      {
                        label: "Delete",
                        variant: "danger",
                        onClick: () =>
                          confirmDelete(
                            "Are you sure you want to delete this user?",
                            async () => {
                              await execute(
                                () => deleteUser(u.id).unwrap(),
                                "User deleted"
                              );
                            }
                          ),
                      },
                      {
                        label: "Permissions",
                        variant: "secondary",
                        show: can(PERMISSIONS.PERMISSION.MANAGE),
                        onClick: () => openModal("user-permission", u),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {/* ================= MODALS ================= */}

      {modalType === "user-form" && (
        <UserFormModal onClose={closeModal} onSaved={closeModal} />
      )}

      {modalType === "user-role" && modalData && (
        <UserRoleModal
          user={modalData}
          onClose={closeModal}
          onSaved={closeModal}
        />
      )}

      {modalType === "user-permission" && modalData && (
  <UserPermissionModal
    user={modalData}
    onClose={closeModal}
  />
)}
    </div>
  );
}
