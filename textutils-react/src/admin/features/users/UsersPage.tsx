import { memo } from "react";
import { useAppModal } from "../../../context/AppModalContext";
import { useConfirmDelete } from "../../../hooks/useConfirmDelete";
import { useAuth } from "../../../auth/hooks/useAuth";

import PageHeader from "../../../components/common/PageHeader";
import DataTable from "../../../components/common/DataTable";
import RowActions from "../../../components/common/RowActions";
import Button from "../../../components/common/Button";
import Can from "../../../components/common/Can";
import StatusToggle from "../../../components/common/StatusToggle";

import Card from "../../../ui/Card";
import CardHeader from "../../../ui/CardHeader";
import CardBody from "../../../ui/CardBody";

import UserFormModal from "./UserFormModal";
import UserRoleModal from "./UserRoleModal";
import UserPermissionModal from "./UserPermissionModal";
import Pagination from "../../../components/common/Pagination";
import { usePagination } from "../../../hooks/usePagination";

import { PERMISSIONS } from "../../../constants/permissions";
import { ICONS } from "../../../constants/icons";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useToggleUserStatusMutation,
  useForceUserPasswordResetMutation,
} from "../../../store/api";

import { execute } from "../../../utils/execute";
import type { User } from "../../../types/models";

function UsersPage() {
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<User | null>();

  const { page, setPage, search, setSearch } = usePagination();

  const { data, isLoading } = useGetUsersQuery(
    { page, search },
    { refetchOnMountOrArgChange: true }
  );

  const users = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();
  const [forceReset] = useForceUserPasswordResetMutation();

  const { can } = useAuth();

  /* ================= ACTION HANDLERS ================= */

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

  /* ================= ROW ACTIONS ================= */

  const getRowActions = (user: User) => {
    if (user.deleted_at) {
      return [
        {
          key: "restore",
          label: "Restore",
          icon: ICONS.RESTORE,
          variant: "success" as const,
          onClick: () => handleRestore(user),
        },
      ];
    }

    return [
      {
        key: "roles",
        label: "Roles",
        icon: ICONS.ROLE,
        show: can(PERMISSIONS.USER.ASSIGN_ROLE),
        onClick: () => openModal("user-role", user),
      },
      {
        key: "permissions",
        label: "Permissions",
        icon: ICONS.PERMISSION,
        show: can(PERMISSIONS.USER.ASSIGN_PERMISSION),
        onClick: () => openModal("user-permission", user),
      },
      {
        key: "force-reset",
        label: "Force Password Reset",
        icon: ICONS.LOCK,
        variant: "warning" as const,
        show: can(PERMISSIONS.USER.UPDATE),
        onClick: () =>
          execute(
            () => forceReset(user.id).unwrap(),
            "Force password reset updated"
          ),
      },
      {
        key: "archive",
        label: "Archive",
        icon: ICONS.DELETE,
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
                label="Add User"
                icon={ICONS.ADD}
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
              colSpan={5}
              hasData={users.length > 0}
              columns={
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
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
                      <StatusToggle
                        checked={user.is_active}
                        onToggle={() =>
                          execute(
                            () =>
                              toggleStatus(user.id).unwrap(),
                            "User status updated"
                          )
                        }
                      />
                    )}
                  </td>
                  <td className="text-right">
                    <RowActions actions={getRowActions(user)} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {meta && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}

        {/* MODALS */}
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

export default memo(UsersPage);
