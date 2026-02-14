import { memo, useMemo } from "react";

import { useAppModal } from "../../../context/AppModalContext";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePagination } from "../../../hooks/usePagination";
import { useConfirmAction } from "../../../hooks/useConfirmAction";
import { useCrudForm } from "../../../hooks/useCrudForm";

import AdminTablePage from "../../components/page/AdminTablePage";
import RowActions from "../../components/table/RowActions";
import AssignModal from "../../components/modals/AssignModal";
import FormModal from "../../../components/common/FormModal";

import Pagination from "../../../components/common/Pagination";
import {
  TableSearch,
  StatusBadge,
} from "../../../components/common/TableUtils";

import { useRowActions } from "../../hooks/useRowActions";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
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

  /* ================= QUERY ================= */

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery(
    { page, search },
    { refetchOnMountOrArgChange: true }
  );

  const users = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  /* ================= FORM ================= */

  const userInitialValues = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const userForm = useCrudForm({
    initialValues: userInitialValues,
    create: createUser,
    update: updateUser,
    onSuccess: closeModal,
  });

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

  const getRowActions = (user: User) =>
    useRowActions<User>({
      row: user,
      isDeleted: !!user.deleted_at,

      delete: {
        enabled: can(PERMISSIONS.USER.DELETE),
        onClick: handleArchive,
      },

      restore: {
        enabled: true,
        onClick: handleRestore,
      },

      extra: [
        {
          key: "edit",
          icon: ICONS.EDIT,
          title: "Edit User",
          show: can(PERMISSIONS.USER.UPDATE),
          onClick: (u) =>
            openModal("user-form", u),
        },
        {
          key: "roles",
          icon: ICONS.ROLE,
          title: "Assign Roles",
          show: can(
            PERMISSIONS.USER.ASSIGN_ROLE
          ),
          onClick: (u) =>
            openModal("assign", {
              mode: "user-role",
              entity: u,
            }),
        },
        {
          key: "permissions",
          icon: ICONS.PERMISSION,
          title: "Assign Permissions",
          show: can(
            PERMISSIONS.USER.ASSIGN_PERMISSION
          ),
          onClick: (u) =>
            openModal("assign", {
              mode: "user-permission",
              entity: u,
            }),
        },
      ],
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
        error={isError}
        onRetry={refetch}
        empty={
          !isLoading &&
          !isError &&
          users.length === 0
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
          !isError &&
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
                  <StatusBadge status="archived" />
                ) : (
                  <StatusBadge active />
                )}
              </td>
              <td className="text-end">
                <RowActions
                  actions={getRowActions(user)}
                />
              </td>
            </tr>
          ))}
      </AdminTablePage>

      {meta && !isError && (
        <Pagination
          meta={meta}
          onPageChange={setPage}
        />
      )}

      {/* ================= FORM MODAL ================= */}

      {modalType === "user-form" && (
        <FormModal
          title={
            modalData
              ? "Edit User"
              : "Add User"
          }
          entity={modalData}
          initialValues={userInitialValues}
          form={userForm}
          onClose={closeModal}
          fields={[
            {
              name: "name",
              label: "Name",
              required: true,
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              required: !modalData,
            },
            {
              name: "password_confirmation",
              label: "Confirm Password",
              type: "password",
              required: !modalData,
            },
          ]}
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
