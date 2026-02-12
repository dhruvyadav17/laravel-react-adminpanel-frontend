import { memo, useMemo } from "react";

import { useAppModal } from "../../../context/AppModalContext";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";
import { useConfirmAction } from "../../../hooks/useConfirmAction";

import AdminTablePage from "../../components/page/AdminTablePage";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";
import UserFormModal from "../../components/modals/UserFormModal";

import Pagination from "../../../components/common/Pagination";
import {
  TableSearch,
  StatusBadge,
} from "../../../components/common/TableUtils";

import { useSoftDeleteRowActions } from "../../hooks/useSoftDeleteRowActions";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "../../../store/api";

import { execute } from "../../../utils/execute";
import type { User } from "../../../types/models";
import { PERMISSIONS } from "../../../constants/rbac";
import { ICONS } from "../../../constants/ui";

function UsersPage() {
  const { modalType, modalData, openModal, closeModal } =
    useAppModal();

  const { page, setPage, search, setSearch } =
    usePagination();

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

  /* ================= ARCHIVE ================= */

  const handleArchive = (user: User) =>
    confirmAction({
      message:
        "Are you sure you want to archive this user?",
      confirmLabel: "Yes, Archive",
      onConfirm: async () => {
        await execute(
          () => deleteUser(user.id).unwrap(),
          {
            defaultMessage:
              "User archived successfully",
          }
        );
      },
    });

  /* ================= RESTORE ================= */

  const handleRestore = (user: User) =>
    execute(
      () => restoreUser(user.id).unwrap(),
      {
        defaultMessage:
          "User restored successfully",
      }
    );

  /* ================= ROW ACTIONS ================= */

  const getRowActions =
    useSoftDeleteRowActions<User>({
      isDeleted: (user) => !!user.deleted_at,

      activeConfig: {
        canDelete: can(PERMISSIONS.USER.DELETE),
        onDelete: handleArchive,
        extraActions: [
          {
            key: "roles",
            icon: ICONS.ROLE,
            title: "Assign Roles",
            show: can(
              PERMISSIONS.USER.ASSIGN_ROLE
            ),
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
            show: can(
              PERMISSIONS.USER.ASSIGN_PERMISSION
            ),
            onClick: (user) =>
              openModal("assign", {
                mode: "user-permission",
                entity: user,
              }),
          },
        ],
      },

      deletedConfig: {
        extraActions: [
          {
            key: "restore",
            icon: ICONS.RESTORE,
            title: "Restore User",
            variant: "success",
            onClick: handleRestore,
          },
        ],
      },
    });

  /* ================= TABLE COLUMNS ================= */

  const columns = useMemo(
    () => (
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Roles</th>
        <th>Status</th>
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
        title="Users"
        permission={PERMISSIONS.USER.CREATE}
        actionLabel="Add User"
        actionIcon={ICONS.ADD}
        onAction={() =>
          openModal("user-form", null)
        }
        loading={isLoading}
        empty={
          !isLoading && users.length === 0
        }
        emptyText="No users found"
        columns={columns}
        topContent={
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email..."
          />
        }
      >
        {!isLoading &&
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.roles?.join(", ") ||
                  "—"}
              </td>
              <td>
                {user.deleted_at ? (
                  <StatusBadge
                    status="archived"
                  />
                ) : (
                  <StatusBadge active />
                )}
              </td>
              <td className="text-end">
                <RowActions
                  actions={getRowActions(
                    user
                  )}
                />
              </td>
            </tr>
          ))}
      </AdminTablePage>

      {meta && (
        <Pagination
          meta={meta}
          onPageChange={setPage}
        />
      )}

      {/* ================= USER FORM MODAL ================= */}

      {modalType === "user-form" &&  (
          <UserFormModal
            user={modalData}
            onClose={closeModal}
            onSaved={closeModal}
          />
        )}

      {/* ================= ASSIGN MODAL ================= */}

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

export default memo(UsersPage);
