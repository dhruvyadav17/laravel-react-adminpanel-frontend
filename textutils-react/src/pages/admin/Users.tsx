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

function Users() {
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<User | null>();

  const { page, setPage, search, setSearch } = usePagination();
  const { data, isLoading } = useGetUsersQuery(
    { page, search },
    { refetchOnMountOrArgChange: true }
  );

  const users: User[] = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  const {
    can,
    isAdmin,
    user: authUser,
  } = useAuth();

  /* ================= IMPERSONATION UI ================= */

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

  /* ================= ROW ACTIONS ================= */

  const handleArchive = (user: User) =>
    confirmDelete(
      "Are you sure you want to archive this user?",
      async () => {
        await execute(
          () => deleteUser(user.id).unwrap(),
          "User archived successfully"
        );
      }
    );

  const handleRestore = async (user: User) => {
    await execute(
      () => restoreUser(user.id).unwrap(),
      "User restored successfully"
    );
  };

  const getRowActions = (user: User) => {
    if (user.roles.includes("super-admin")) return [];

    if (user.deleted_at) {
      return [
        {
          label: "Restore",
          variant: "success" as const,
          onClick: () => handleRestore(user),
        },
      ];
    }

    return [
      {
        label: "Assign Role",
        show: can(PERMISSIONS.USER.ASSIGN_ROLE),
        onClick: () => openModal("user-role", user),
      },
      {
        label: "Assign Permissions",
        show: can(PERMISSIONS.USER.ASSIGN_ROLE),
        onClick: () => openModal("user-permission", user),
      },
      {
        label: "Archive",
        variant: "danger" as const,
        show: can(PERMISSIONS.USER.DELETE),
        onClick: () => handleArchive(user),
      },
    ];
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.roles.join(", ") || "—"}</td>
                  <td>
                    {user.deleted_at ? (
                      <span className="badge badge-warning">
                        Archived
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <RowActions actions={getRowActions(user)} />
                  </td>
                  <td>
                    <UserActions user={user} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {meta && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}

        {modalType === "user-form" && (
          <UserFormModal
            onClose={closeModal}
            onSaved={closeModal}
          />
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
    </section>
  );
}

export default memo(Users);
