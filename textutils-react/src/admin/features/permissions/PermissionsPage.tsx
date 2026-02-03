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

function PermissionsPage() {
  const confirmDelete = useConfirmDelete();

  const { modalType, modalData, openModal, closeModal } =
    useAppModal<Permission>();

  /* ✅ FLAT PERMISSIONS ONLY */
  const { data: permissions = [], isLoading } =
    useGetPermissionsQuery({ flat: true });

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
  } = useBackendForm({
    name: "",
    group_name: "",
  });

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
                group_name: values.group_name,
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
      label: "Edit",
      show: can(PERMISSIONS.PERMISSION.MANAGE),
      onClick: () => {
        setField("name", permission.name);
        setField("group_name", permission.group_name);
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
              colSpan={3}
              hasData={permissions.length > 0}
              columns={
                <tr>
                  <th>Name</th>
                  <th>Group</th>
                  <th className="text-right">Actions</th>
                </tr>
              }
            >
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td>{permission.name}</td>
                  <td>{permission.group_name}</td>
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
            title={
              modalData?.id ? "Edit Permission" : "Add Permission"
            }
            onClose={closeModal}
            onSave={save}
            saveDisabled={loading}
          >
            <input
              className={`form-control mb-2 ${
                errors.name ? "is-invalid" : ""
              }`}
              value={values.name}
              onChange={(e) =>
                setField("name", e.target.value)
              }
              placeholder="Permission name"
            />

            <input
              className={`form-control ${
                errors.group_name ? "is-invalid" : ""
              }`}
              value={values.group_name}
              onChange={(e) =>
                setField("group_name", e.target.value)
              }
              placeholder="Group (User / Role / System)"
            />
          </Modal>
        )}
      </div>
    </section>
  );
}

export default memo(PermissionsPage);
