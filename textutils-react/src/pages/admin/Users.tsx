import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk } from "../../store/userSlice";
import { RootState, AppDispatch } from "../../store";
import { usePermission } from "../../auth/hooks/usePermission";
import { PERMISSIONS } from "../../constants/permissions";
import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";
import { useAppModal } from "../../hooks/useAppModal";

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();

  const { list, loading } = useSelector((state: RootState) => state.users);

  const can = usePermission();

  // 🔥 Centralized modal state
  const { modalType, modalData, openModal, closeModal } = useAppModal<any>();

  /* ================= LOAD USERS ================= */
  const loadUsers = () => {
    dispatch(fetchUsersThunk());
  };

  useEffect(() => {
    if (can(PERMISSIONS.USER_VIEW)) {
      loadUsers();
    }
  }, []);

  /* ================= GUARD ================= */
  if (!can(PERMISSIONS.USER_VIEW)) {
    return (
      <div className="container mt-4">
        <p className="text-danger">Unauthorized</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Users</h3>

        {can(PERMISSIONS.USER_CREATE) && (
          <button
            className="btn btn-primary"
            onClick={() => openModal("user-form")} // ✅ OPEN ADD USER
          >
            + Add User
          </button>
        )}
      </div>

      {/* ================= LIST ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th width="160">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles?.join(", ") || "-"}</td>
                <td>
                  {can(PERMISSIONS.USER_ASSIGN_ROLE) && (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={
                        () => openModal("user-role", u) // ✅ OPEN ASSIGN ROLE
                      }
                    >
                      Assign Role
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {!list.length && (
              <tr>
                <td colSpan={4} className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ================= ADD USER MODAL ================= */}
      {modalType === "user-form" && (
        <UserFormModal
          onClose={closeModal} // ❌ Cancel / X
          onSaved={() => {
            loadUsers(); // ✅ refresh list
            closeModal(); // ✅ CLOSE POPUP
          }}
        />
      )}

      {/* ================= ASSIGN ROLE MODAL ================= */}
      {modalType === "user-role" && modalData && (
        <UserRoleModal
          user={modalData}
          onClose={closeModal}
          onSaved={(success) => {
            
              loadUsers(); // refresh only on success
            
            closeModal(); // ✅ CLOSE IN BOTH CASES
          }}
        />
      )}
    </div>
  );
}
