import { usePermission } from "../../auth/hooks/usePermission";
import { PERMISSIONS } from "../../constants/permissions";
import { useAppModal } from "../../hooks/useAppModal";
import { useConfirm } from "../../hooks/useConfirm";

import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";
import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api";
import {
  handleApiError,
  handleApiSuccess,
} from "../../utils/toastHelper";

export default function Users() {
  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  const { confirm, ConfirmUI } = useConfirm();

  /* ================= DATA ================= */
  const { data: users = [], isLoading } =
    useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  /* ================= GUARD ================= */
  if (!can(PERMISSIONS.USER_VIEW)) {
    return <p className="text-danger">Unauthorized</p>;
  }

  return (
    <div className="container mt-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Users</h3>

        {can(PERMISSIONS.USER_CREATE) && (
          <Button
            label="+ Add User"
            onClick={() => openModal("user-form")}
          />
        )}
      </div>

      {/* ================= LIST ================= */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th width="200">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u: any) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles?.join(", ") || "-"}</td>
                <td>
                  <RowActions
                    actions={[
                      ...(can(
                        PERMISSIONS.USER_ASSIGN_ROLE
                      )
                        ? [
                            {
                              label: "Assign Role",
                              variant: "secondary",
                              onClick: () =>
                                openModal("user-role", u),
                            },
                          ]
                        : []),
                      {
                        label: "Delete",
                        variant: "danger",
                        onClick: () =>
                          confirm(async () => {
                            try {
                              await deleteUser(
                                u.id
                              ).unwrap();
                              handleApiSuccess(
                                null,
                                "User deleted"
                              );
                            } catch (e) {
                              handleApiError(e);
                            }
                          }),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}

            {!users.length && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ================= ADD USER ================= */}
      {modalType === "user-form" && (
        <UserFormModal
          onClose={closeModal}
          onSaved={closeModal}
        />
      )}

      {/* ================= ASSIGN ROLE ================= */}
      {modalType === "user-role" && modalData && (
        <UserRoleModal
          user={modalData}
          onClose={closeModal}
          onSaved={closeModal}
        />
      )}

      {/* ================= CONFIRM MODAL ================= */}
      {ConfirmUI}
    </div>
  );
}
