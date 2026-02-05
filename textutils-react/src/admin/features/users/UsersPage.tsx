import { memo } from "react";
import { useAppModal } from "../../../context/AppModalContext";
import { useConfirmDelete } from "../../../hooks/useConfirmDelete";
import { useAuth } from "../../../auth/hooks/useAuth";

import PageHeader from "../../../components/common/PageHeader";
import DataTable from "../../../components/common/DataTable";
import RowActions from "../../../components/common/RowActions";
import Button from "../../../components/common/Button";
import Can from "../../../components/common/Can";
import AssignModal from "../../../components/common/AssignModal";

import Card from "../../../ui/Card";
import CardHeader from "../../../ui/CardHeader";
import CardBody from "../../../ui/CardBody";

import UserFormModal from "./UserFormModal";
import Pagination from "../../../components/common/Pagination";
import { usePagination } from "../../../hooks/usePagination";

import { PERMISSIONS } from "../../../constants/permissions";
import { ICONS } from "../../../constants/icons";
import { useTableActions } from "../../../components/common/useTableActions";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "../../../store/api";

import { execute } from "../../../utils/execute";
import type { User } from "../../../types/models";

function UsersPage() {
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

  const { page, setPage, search, setSearch } = usePagination();

  const { data, isLoading } = useGetUsersQuery(
    { page, search },
    { refetchOnMountOrArgChange: true }
  );

  const users = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

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
                  <td>{user.roles?.join(", ") || "—"}</td>
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
