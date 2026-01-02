import { useAppModal } from "../../context/AppModalContext";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";
import { usePagination } from "../../hooks/usePagination";

import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";

import Card from "../../ui/Card";
import CardHeader from "../../ui/CardHeader";
import CardBody from "../../ui/CardBody";

import UserFormModal from "../../components/UserFormModal";
import UserRoleModal from "../../components/UserRoleModal";
import UserPermissionModal from "../../components/UserPermissionModal";

import { useGetUsersQuery, useDeleteUserMutation } from "../../store/api";

import { execute } from "../../utils/execute";
import type { User } from "../../types/models";

export default function Users() {
  /* ================= MODAL HANDLING ================= */
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<User | null>();

  /* ================= PAGINATION + SEARCH ================= */
  const { page, setPage, search, setSearch } = usePagination();

  /* ================= API ================= */
  const { data, isLoading } = useGetUsersQuery({
    page,
    search,
  });

  const users: User[] = data?.data ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();

  /* ================= ACTION HANDLERS ================= */

  const handleDelete = (user: User) =>
    confirmDelete("Are you sure you want to delete this user?", async () => {
      await execute(
        () => deleteUser(user.id).unwrap(),
        "User deleted successfully"
      );
    });

  const getRowActions = (user: User) => [
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
      label: "Delete",
      variant: "danger" as const,
      onClick: () => handleDelete(user),
    },
  ];

  /* ================= VIEW ================= */

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        {/* ===== PAGE HEADER ===== */}
        <PageHeader
          title="Users"
          action={
            <Button
              label="+ Add User"
              onClick={() => openModal("user-form", null)}
            />
          }
        />

        {/* ===== SEARCH ===== */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* 🔍 SEARCH (LEFT) */}
          <div style={{ maxWidth: 260 }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ===== USERS TABLE ===== */}
        <Card>
          <CardHeader title="Users List" />
          <CardBody className="p-0">
            <DataTable
              isLoading={isLoading}
              colSpan={4}
              columns={
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th className="text-right" style={{ width: 220 }}>
                    Actions
                  </th>
                </tr>
              }
            >
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  {/* 🔥 ROLES — COMMA SEPARATED */}
                  <td>
                    {user.roles?.length
                      ? user.roles.map((r: any) => r.name).join(", ")
                      : "—"}
                  </td>

                  <td className="text-right">
                    <RowActions actions={getRowActions(user)} gap={2} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {/* ===== PAGINATION ===== */}
        {meta && (
          <div className="d-flex justify-content-end mt-3">
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* ===== MODALS ===== */}
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
