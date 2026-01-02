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

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { User } from "../../types/models";

export default function Users() {
  const confirmDelete = useConfirmDelete();

  const { modalType, modalData, openModal, closeModal } =
    useAppModal();

  const { data: users = [], isLoading } =
    useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = (user: User) =>
    confirmDelete(
      "Are you sure you want to delete this user?",
      async () => {
        await execute(
          () => deleteUser(user.id).unwrap(),
          "User deleted successfully"
        );
      }
    );

  const getRowActions = (user: User) => [
    {
      label: "Assign Role",
      variant: "secondary" as const,
      onClick: () => openModal("user-role", user),
    },
    {
      label: "Permissions",
      variant: "secondary" as const,
      onClick: () =>
        openModal("user-permission", user),
    },
    {
      label: "Delete",
      variant: "danger" as const,
      onClick: () => handleDelete(user),
    },
  ];

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <PageHeader
          title="Users"
          action={
            <Button
              label="+ Add User"
              onClick={() =>
                openModal("user-form", null)
              }
            />
          }
        />

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
                  <th className="text-right" width={220}>
                    Actions
                  </th>
                </tr>
              }
            >
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.roles.length
                      ? user.roles.join(", ")
                      : "—"}
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

        {modalType === "user-form" && (
          <UserFormModal
            onClose={closeModal}
            onSaved={closeModal}
          />
        )}

        {modalType === "user-role" &&
          modalData && (
            <UserRoleModal
              user={modalData}
              onClose={closeModal}
              onSaved={closeModal}
            />
          )}

        {modalType === "user-permission" &&
          modalData && (
            <UserPermissionModal
              user={modalData}
              onClose={closeModal}
            />
          )}
      </div>
    </section>
  );
}
