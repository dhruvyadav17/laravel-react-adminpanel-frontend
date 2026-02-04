import { memo } from "react";
import Modal from "../../../components/common/Modal";
import RowActions from "../../../components/common/RowActions";
import Button from "../../../components/common/Button";
import PageHeader from "../../../components/common/PageHeader";
import DataTable from "../../../components/common/DataTable";

import Card from "../../../ui/Card";
import CardHeader from "../../../ui/CardHeader";
import CardBody from "../../../ui/CardBody";

import { useAppModal } from "../../../context/AppModalContext";
import { useBackendForm } from "../../../hooks/useBackendForm";
import { useConfirmDelete } from "../../../hooks/useConfirmDelete";
import { useAuth } from "../../../auth/hooks/useAuth";
import { ICONS } from "../../../constants/icons";

import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../../store/api";

import { execute } from "../../../utils/execute";
import type { Permission } from "../../../types/models";

import Can from "../../../components/common/Can";
import { PERMISSIONS } from "../../../constants/permissions";
import { title } from "process";

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

  /* ================= SAVE ================= */

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
        modalData?.id
          ? "Permission updated"
          : "Permission created"
      );

      closeModal();
      reset();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

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

  /* ================= ROW ACTIONS ================= */

  const getRowActions = (permission: Permission) => [
    {
      key: "edit",
      label: "",
      icon: ICONS.EDIT,
      title: "Edit Permission",
      show: can(PERMISSIONS.PERMISSION.MANAGE),
      onClick: () => {
        setField("name", permission.name);
        openModal("permission", permission);
      },
    },
    {
      key: "delete",
      label: "",
      icon: ICONS.DELETE,
      title: "Delete Permission",
      variant: "danger" as const,
      show: can(PERMISSIONS.PERMISSION.MANAGE),
      onClick: () => handleDelete(permission),
    },
  ];

  /* ================= VIEW ================= */

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
              columns={
                <tr>
                  <th>Name</th>
                  <th
                    className="text-right"
                    style={{ width: 180 }}
                  >
                    Actions
                  </th>
                </tr>
              }
            >
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td>{permission.name}</td>
                  <td className="text-right">
                    <RowActions
                      actions={getRowActions(permission)}
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
          </CardBody>
        </Card>

        {modalType === "permission" && (
          <Modal
            title={
              modalData?.id ? "Edit Permission" : "Add Permission"
            }
            onClose={closeModal}
            onSave={save}
            saveDisabled={loading}
            saveText={modalData?.id ? "Update" : "Save"}
          >
            <input
              className={`form-control ${
                errors.name ? "is-invalid" : ""
              }`}
              value={values.name}
              onChange={(e) =>
                setField("name", e.target.value)
              }
              disabled={loading}
              placeholder="Permission name"
            />

            {errors.name && (
              <div className="invalid-feedback">
                {errors.name[0]}
              </div>
            )}
          </Modal>
        )}
      </div>
    </section>
  );
}

export default memo(PermissionsPage);
