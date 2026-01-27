import { memo } from "react";
import Modal from "../../components/common/Modal";
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
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../store/api";

import { execute } from "../../utils/execute";
import type { Permission } from "../../types/models";
import Can from "../../components/common/Can";
import { PERMISSIONS } from "../../constants/permissions";
import { useAuth } from "../../auth/hooks/useAuth";

function PermissionsPage() {
  const confirmDelete = useConfirmDelete();
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Permission>();

  const { data: permissions = [], isLoading } =
    useGetPermissionsQuery();

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

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
            ? updatePermission({
                id: modalData.id,
                name: values.name,
              }).unwrap()
            : createPermission(values).unwrap(),
        modalData?.id ? "Permission updated" : "Permission created"
      );
      closeModal();
      reset();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (permission: Permission) =>
    confirmDelete(
      "Are you sure you want to delete this permission?",
      async () => {
        await execute(
          () => deletePermission(permission.id).unwrap(),
          "Permission deleted"
        );
      }
    );

const getRowActions = (permission: Permission) => [
  {
    key: "edit",
    label: "Edit",
    show: can(PERMISSIONS.PERMISSION.MANAGE),
    onClick: () => {
      setField("name", permission.name);
      openModal("permission", permission);
    },
  },
  {
    key: "delete",
    label: "Delete",
    variant: "danger" as const,
    show: can(PERMISSIONS.PERMISSION.MANAGE),
    onClick: () => handleDelete(permission),
  },
];


  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <PageHeader
          title="Permissions"
          action={
            <Can permission={PERMISSIONS.PERMISSION.MANAGE}>
              <Button
                label="+ Add Permission"
                onClick={() => {
                  reset();
                  openModal("permission");
                }}
              />
            </Can>
          }
        />

        <Card>
          <CardHeader title="Permissions List" />
          <CardBody className="p-0">
            <DataTable
              isLoading={isLoading}
              colSpan={2}
              hasData={permissions.length > 0}
              columns={(
                <tr>
                  <th>Name</th>
                  <th className="text-right" style={{ width: 180 }}>
                    Actions
                  </th>
                </tr>
              )}
            >
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td>{permission.name}</td>
                  <td className="text-right">
                    <RowActions actions={getRowActions(permission)} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {modalType === "permission" && (
          <Modal
            title="Permission"
            onClose={closeModal}
            onSave={save}
            saveDisabled={loading}
            saveText={modalData?.id ? "Update" : "Save"}
          >
            <input
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              disabled={loading}
              placeholder="Permission name"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name[0]}</div>
            )}
          </Modal>
        )}
      </div>
    </section>
  );
}

export default memo(PermissionsPage);
