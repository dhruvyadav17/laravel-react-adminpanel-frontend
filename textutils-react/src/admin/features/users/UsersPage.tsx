import { memo } from "react";

import { useAppModal } from "../../../context/AppModalContext";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";
import DataTable from "../../../components/common/DataTable";
import RowActions from "../../../components/common/RowActions";
import AssignModal from "../roles/AssignModal";
import Pagination from "../../../components/common/Pagination";
import { useTableActions } from "../../../components/common/useTableActions";

import Card from "../shared/ui/Card";
import CardHeader from "../shared/ui/CardHeader";
import CardBody from "../shared/ui/CardBody";

import UserFormModal from "./UserFormModal";

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
import PageActions from "../../../components/common/PageActions";

function UsersPage() {
  
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  const { page, setPage, search, setSearch } =
    usePagination();

  const { data, isLoading } = useGetUsersQuery(
    { page, search },
    { refetchOnMountOrArgChange: true }
  );

  const users = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  const { can } = useAuth();
  const confirmAction = useConfirmAction();

  /* ================= ACTION HANDLERS ================= */

  const handleArchive = (user: User) =>
    confirmAction({
      message: "Are you sure you want to archive this user?",
      confirmLabel: "Yes, Archive",
      onConfirm: async () => {
        await execute(
          () => deleteUser(user.id).unwrap(),
          "User archived successfully"
        );
      },
    });

  const handleRestore = (user: User) =>
    execute(
      () => restoreUser(user.id).unwrap(),
      "User restored successfully"
    );

  /* ================= TABLE ACTIONS ================= */

  const getActiveUserActions = useTableActions<User>({
    canDelete: can(PERMISSIONS.USER.DELETE),

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

    onDelete: handleArchive,
  });

  const getDeletedUserActions = useTableActions<User>({
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
    user.deleted_at
      ? getDeletedUserActions(user)
      : getActiveUserActions(user);

  /* ================= VIEW ================= */

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <PageActions
          title="Users"
          permission={PERMISSIONS.USER.CREATE}
          buttonLabel="Add User"
          icon={ICONS.ADD}
          onClick={() => openModal("user-form", null)}
        />
        {/* SEARCH */}
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
                  <td>
                    {user.roles?.join(", ") || "—"}
                  </td>
                  <td>
                    {user.deleted_at ? (
                      <StatusBadge status="archived" />
                    ) : (
                      <StatusBadge active />
                    )}
                  </td>
                  <td className="text-right">
                    <RowActions
                      actions={getRowActions(user)}
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {meta && (
          <Pagination
            meta={meta}
            onPageChange={setPage}
          />
        )}

        {/* ================= MODALS ================= */}

        {modalType === "user-form" && (
          <UserFormModal
            user={modalData}   // 👈 NEW (null for add, user for edit)
            onClose={closeModal}
            onSaved={closeModal}
          />
        )}

        {modalType === "assign" && modalData && (
          <AssignModal
            mode={modalData.mode}
            entity={modalData.entity}
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  );
}

export default memo(UsersPage);
