import { memo } from "react";
import { useAppModal } from "../../context/AppModalContext";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";
import { useAuth } from "../../auth/hooks/useAuth";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";
import Can from "../../components/common/Can";

import Card from "../../ui/Card";
import CardHeader from "../../ui/CardHeader";
import CardBody from "../../ui/CardBody";

import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";
import UserPermissionModal from "../../components/UserPermissionModal";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";

import { PERMISSIONS } from "../../constants/permissions";
import { startImpersonation } from "../../utils/impersonation";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { User } from "../../types/models";

/* 🔥 POLICY */
import { getUserRowActions } from "../../policies/user.policy";
import StatusBadge from "../../ui/StatusBadge";

function Users() {
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<User | null>();

  const { page, setPage, search, setSearch } = usePagination();
  const { data, isLoading } = useGetUsersQuery(
    { page, search },
    { refetchOnMountOrArgChange: true },
  );

  const users: User[] = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  const auth = useAuth();
  const { can, isAdmin, user: authUser } = auth;

  /* ================= IMPERSONATION ================= */

  const canImpersonate = can("admin-impersonate");

  function UserActions({ user }: { user: User }) {
    if (!isAdmin || !canImpersonate) return null;
    if (authUser?.id === user.id) return null;
    if (user.roles.includes("super-admin")) return null;

    return (
      <button
        className="btn btn-sm btn-warning"
        onClick={() => startImpersonation(user.id)}
      >
        Impersonate
      </button>
    );
  }

  /* ================= HANDLERS ================= */

  const handleArchive = (user: User) =>
    confirmDelete("Archive this user?", async () => {
      await execute(() => deleteUser(user.id).unwrap(), "User archived");
    });

  const handleRestore = async (user: User) => {
    await execute(() => restoreUser(user.id).unwrap(), "User restored");
  };

  /* ================= VIEW ================= */

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <PageHeader
          title="Users"
          action={
            <Can permission={PERMISSIONS.USER.CREATE}>
              <Button
                label="+ Add User"
                onClick={() => openModal("user-form", null)}
              />
            </Can>
          }
        />

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader title="Users List" />
          <CardBody className="p-0">
            <DataTable
              isLoading={isLoading}
              colSpan={6}
              columns={
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                  <th>Impersonation</th>
                </tr>
              }
            >
              {users.map((user) => {
                const actions = getUserRowActions(user, auth, {
                  onAssignRole: () => openModal("user-role", user),
                  onAssignPermission: () => openModal("user-permission", user),
                  onArchive: () => handleArchive(user),
                  onRestore: () => handleRestore(user),
                });

                return (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles.join(", ") || "—"}</td>
                    <td>
                      {user.deleted_at ? (
                        <StatusBadge status="archived" />
                      ) : (
                        <StatusBadge status="active" />
                      )}
                    </td>
                    <td className="text-right">
                      <RowActions actions={actions} />
                    </td>
                    <td>
                      <UserActions user={user} />
                    </td>
                  </tr>
                );
              })}
            </DataTable>
          </CardBody>
        </Card>

        {meta && <Pagination meta={meta} onPageChange={setPage} />}

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
          <UserPermissionModal user={modalData} onClose={closeModal} />
        )}
      </div>
    </section>
  );
}

export default memo(Users);
