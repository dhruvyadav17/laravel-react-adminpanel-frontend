import { memo } from "react";
import Modal from "../../components/common/Modal";
import RolePermissionModal from "../../components/RolePermissionModal";
import RowActions from "../../components/common/RowActions";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";

import Card from "../../ui/Card";
import CardHeader from "../../ui/CardHeader";
import CardBody from "../../ui/CardBody";
import { useAppModal } from "../../context/AppModalContext";
import { useBackendForm } from "../../hooks/useBackendForm";
import { useConfirmDelete } from "../../hooks/useConfirmDelete";

import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { Role } from "../../types/models";
import Can from "../../components/common/Can";
import { PERMISSIONS } from "../../constants/permissions";
import { useAuth } from "../../auth/hooks/useAuth";

function Roles() {
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Role>();

  const { data: roles = [], isLoading } = useGetRolesQuery();

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const {
    values,
    errors,
    loading,
    setLoading,
    setField,
    handleError,
    reset,
  } = useBackendForm({ name: "" });

  const { can } = useAuth();

  const save = async () => {
    try {
      setLoading(true);
      await execute(
        () =>
          modalData?.id
            ? updateRole({
                id: modalData.id,
                name: values.name,
              }).unwrap()
            : createRole(values).unwrap(),
        modalData?.id ? "Role updated" : "Role created"
      );
      closeModal();
      reset();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (role: Role) =>
    confirmDelete("Are you sure you want to delete this role?", async () => {
      await execute(
        () => deleteRole(role.id).unwrap(),
        "Role deleted"
      );
    });

  const getRowActions = (role: Role) => {
    if (role.name === "super-admin") return [];

    return [
      {
        label: "Assign Permissions",
        show: can(PERMISSIONS.ROLE.MANAGE),
        onClick: () => openModal("permission", role),
      },
      {
        label: "Edit",
        show: can(PERMISSIONS.ROLE.MANAGE),
        onClick: () => {
          setField("name", role.name);
          openModal("role-edit", role);
        },
      },
      {
        label: "Delete",
        variant: "danger" as const,
        show: can(PERMISSIONS.ROLE.MANAGE),
        onClick: () => handleDelete(role),
      },
    ];
  };

  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <PageHeader
          title="Roles"
          action={
            <Can permission={PERMISSIONS.ROLE.MANAGE}>
              <Button
                label="+ Add Role"
                onClick={() => {
                  reset();
                  openModal("role-add");
                }}
              />
            </Can>
          }
        />

        <Card>
          <CardHeader title="Roles List" />
          <CardBody className="p-0">
            <DataTable
              isLoading={isLoading}
              colSpan={2}
              columns={
                <tr>
                  <th>Name</th>
                  <th className="text-right" style={{ width: 260 }}>
                    Actions
                  </th>
                </tr>
              }
            >
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td className="text-right">
                    <RowActions actions={getRowActions(role)} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {(modalType === "role-add" || modalType === "role-edit") && (
          <Modal
            title={
              modalType === "role-edit" ? "Edit Role" : "Add Role"
            }
            onClose={closeModal}
            onSave={save}
            saveDisabled={loading}
            saveText={modalType === "role-edit" ? "Update" : "Save"}
          >
            <input
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              disabled={loading}
              placeholder="Role name"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name[0]}</div>
            )}
          </Modal>
        )}

        {modalType === "permission" && modalData && (
          <RolePermissionModal role={modalData} onClose={closeModal} />
        )}
      </div>
    </section>
  );
}

export default memo(Roles);
