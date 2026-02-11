import { memo, useMemo } from "react";

import { useAppModal } from "../../../context/AppModalContext";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";

import AdminPage from "../../components/page/AdminPage";
import AdminTable from "../../components/table/AdminTable";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";
import Pagination from "../../../components/common/Pagination";
import { useTableActions } from "../../hooks/useTableActions";

import UserFormModal from "../../components/modals/UserFormModal";
import AdminCard from "../../components/ui/AdminCard";
import TableSearch from "../../../components/common/TableSearch";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "../../../store/api";

import { execute } from "../../../utils/execute";
import type { User } from "../../../types/models";

import { PERMISSIONS } from "../../../constants/permissions";
import { ICONS } from "../../../constants/icons";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import StatusBadge from "../../../components/common/StatusBadge";

function UsersPage() {
  const { modalType, modalData, openModal, closeModal } = useAppModal<any>();
  const { page, setPage, search, setSearch } = usePagination();
  const { can } = useAuth();
  const confirmAction = useConfirmAction();

  const { data, isLoading } = useGetUsersQuery(
    { page, search },
    { refetchOnMountOrArgChange: true }
  );

  const users = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  /* ================= ACTION HANDLERS ================= */

  const handleArchive = (user: User) =>
    confirmAction({
      message: "Are you sure you want to archive this user?",
      confirmLabel: "Yes, Archive",
      onConfirm: async () => {
        await execute(() => deleteUser(user.id).unwrap(), {
          defaultMessage: "User archived successfully",
        });
      },
    });

  const handleRestore = (user: User) =>
    execute(() => restoreUser(user.id).unwrap(), {
      defaultMessage: "User restored successfully",
    });

  /* ================= TABLE ACTIONS ================= */

  const activeActions = useTableActions<User>({
    canDelete: can(PERMISSIONS.USER.DELETE),
    onDelete: handleArchive,
    extraActions: [
      {
        key: "roles",
        icon: ICONS.ROLE,
        title: "Assign Roles",
        show: can(PERMISSIONS.USER.ASSIGN_ROLE),
        onClick: (user) =>
          openModal("assign", {
            mode: "user-role",
            entity: user,
          }),
      },
      {
        key: "permissions",
        icon: ICONS.PERMISSION,
        title: "Assign Permissions",
        show: can(PERMISSIONS.USER.ASSIGN_PERMISSION),
        onClick: (user) =>
          openModal("assign", {
            mode: "user-permission",
            entity: user,
          }),
      },
    ],
  });

  const deletedActions = useTableActions<User>({
    extraActions: [
      {
        key: "restore",
        icon: ICONS.RESTORE,
        title: "Restore User",
        variant: "success",
        onClick: handleRestore,
      },
    ],
  });

  const getRowActions = (user: User) =>
    user.deleted_at ? deletedActions(user) : activeActions(user);

  /* ================= TABLE HEADER ================= */

  const columns = useMemo(
    () => (
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Roles</th>
        <th>Status</th>
        <th className="text-end">Actions</th>
      </tr>
    ),
    []
  );

  /* ================= VIEW ================= */

  return (
    <AdminPage
      title="Users"
      permission={PERMISSIONS.USER.CREATE}
      actionLabel="Add User"
      actionIcon={ICONS.ADD}
      onAction={() => openModal("user-form", null)}
    >
      <TableSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name or email..."
      />

      <AdminCard title="Users List" loading={isLoading}>
        <AdminTable<User>
          loading={isLoading}
          data={users}
          colSpan={5}
          columns={columns}
          renderRow={(user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles?.join(", ") || "—"}</td>
              <td>
                {user.deleted_at ? (
                  <StatusBadge status="archived" />
                ) : (
                  <StatusBadge active />
                )}
              </td>
              <td className="text-end">
                <RowActions actions={getRowActions(user)} />
              </td>
            </tr>
          )}
        />
      </AdminCard>

      {meta && <Pagination meta={meta} onPageChange={setPage} />}

      {/* ================= MODALS ================= */}

      {modalType === "user-form" && (
        <UserFormModal
          user={modalData}
          onClose={closeModal}
          onSaved={closeModal}
        />
      )}

      {modalType === "assign" && modalData?.mode && modalData?.entity && (
        <AssignModal
          mode={modalData.mode}
          entity={modalData.entity}
          onClose={closeModal}
        />
      )}
    </AdminPage>
  );
}

export default memo(UsersPage);
