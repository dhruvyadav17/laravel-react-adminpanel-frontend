import { useState } from "react";

import { useAppModal } from "../../context/AppModalContext";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";

import Card from "../../ui/Card";
import CardHeader from "../../ui/CardHeader";
import CardBody from "../../ui/CardBody";

import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";
import UserPermissionModal from "../../components/UserPermissionModal";
import Pagination from "../../components/common/Pagination";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { User } from "../../types/models";

export default function Users() {
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<User | null>();

  /* ================= STATE ================= */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  /* ================= API ================= */
  const { data, isLoading } = useGetUsersQuery({
    page,
    search,
  });

  const users: User[] = data?.data ?? [];
  const meta = data?.meta;

 
  const [perPage, setPerPage] = useState(10);

  const [deleteUser] = useDeleteUserMutation();
  const [restoreUser] = useRestoreUserMutation();

  /* ================= ACTIONS ================= */

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
    // 🔁 Archived User → ONLY RESTORE
    if (user.deleted_at) {
      return [
        {
          label: "Restore",
          variant: "success" as const,
          onClick: () => handleRestore(user),
        },
      ];
    }

    // ✅ Active User Actions
    return [
      {
        label: "Assign Role",
        variant: "secondary" as const,
        onClick: () => openModal("user-role", user),
      },
      {
        label: "Permissions",
        variant: "secondary" as const,
        onClick: () => openModal("user-permission", user),
      },
      {
        label: "Archive",
        variant: "danger" as const,
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
            <Button
              label="+ Add User"
              onClick={() => openModal("user-form", null)}
            />
          }
        />

        {/* 🔍 SEARCH */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset pagination on search
            }}
          />
        </div>

        <Card>
          <CardHeader title="Users List" />
          <CardBody className="p-0">
            <DataTable
              isLoading={isLoading}
              colSpan={5}
              columns={
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th className="text-right" width={240}>
                    Actions
                  </th>
                </tr>
              }
            >
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.name}
                    {/* {user.deleted_at && (
                      <span className="badge badge-warning ml-2">
                        Archived
                      </span>
                    )} */}
                  </td>

                  <td>{user.email}</td>

                  <td>
                    {user.roles.length
                      ? user?.roles?.map((role) => role?.name).join(", ")
                      : "—"}
                  </td>

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

        {/* 🔢 PAGINATION */}

        {meta && (
          <Pagination
            meta={meta}
            onPageChange={setPage}
            onPerPageChange={(size) => {
              setPerPage(size);
              setPage(1); // 🔥 IMPORTANT
            }}
          />
        )}

        {/* ================= MODALS ================= */}

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
            saveLabel="Assign Role"
          />
        )}

        {modalType === "user-permission" && modalData && (
          <UserPermissionModal
            user={modalData}
            onClose={closeModal}
            saveLabel="Assign Permission"
          />
        )}
      </div>
    </section>
  );
}
