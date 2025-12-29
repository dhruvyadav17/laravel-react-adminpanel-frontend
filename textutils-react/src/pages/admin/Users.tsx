import { useState } from "react";
import { PERMISSIONS } from "../../constants/permissions";
import { usePermission } from "../../auth/hooks/usePermission";
import { useAppModal } from "../../hooks/useAppModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api";
import { handleApiError, handleApiSuccess } from "../../utils/toastHelper";

export default function Users() {
  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data = [], isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  if (!can(PERMISSIONS.USER_VIEW)) {
    return <p className="text-danger">Unauthorized</p>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Users</h3>

        {can(PERMISSIONS.USER_CREATE) && (
          <button
            className="btn btn-primary"
            onClick={() => openModal("user-form")}
          >
            + Add User
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th width="180">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u: any) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles?.join(", ") || "-"}</td>
                <td>
                  {can(PERMISSIONS.USER_ASSIGN_ROLE) && (
                    <button
                      className="btn btn-sm btn-secondary me-1"
                      onClick={() =>
                        openModal("user-role", u)
                      }
                    >
                      Assign Role
                    </button>
                  )}

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeleteId(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!data.length && (
              <tr>
                <td colSpan={4} className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ADD USER */}
      {modalType === "user-form" && (
        <UserFormModal
          onClose={closeModal}
          onSaved={closeModal} // RTK Query auto-refetch
        />
      )}

      {/* ASSIGN ROLE */}
      {modalType === "user-role" && modalData && (
        <UserRoleModal
          user={modalData}
          onClose={closeModal}
          onSaved={closeModal}
        />
      )}

      {/* DELETE */}
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this user?"
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            try {
              await deleteUser(deleteId).unwrap();
              handleApiSuccess(null, "User deleted");
            } catch (e) {
              handleApiError(e);
            } finally {
              setDeleteId(null);
            }
          }}
        />
      )}
    </div>
  );
}
