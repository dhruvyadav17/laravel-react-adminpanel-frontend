import { memo } from "react";
import { useAppModal } from "../../../context/AppModalContext";
import { useBackendForm } from "../../../hooks/useBackendForm";
import { useConfirmDelete } from "../../../hooks/useConfirmDelete";
import { useAuth } from "../../../auth/hooks/useAuth";

import PageHeader from "../../../components/common/PageHeader";
import DataTable from "../../../components/common/DataTable";
import RowActions from "../../../components/common/RowActions";
import Button from "../../../components/common/Button";
import Can from "../../../components/common/Can";
import Modal from "../../../components/common/Modal";
import AssignModal from "../../../components/common/AssignModal";

import Card from "../../../ui/Card";
import CardHeader from "../../../ui/CardHeader";
import CardBody from "../../../ui/CardBody";

import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../../store/api";

import { execute } from "../../../utils/execute";
import type { Role } from "../../../types/models";

import { PERMISSIONS } from "../../../constants/permissions";
import { ICONS } from "../../../constants/icons";

function RolesPage() {
  const confirmDelete = useConfirmDelete();

  // 🔥 FIX: generic modal data
  const { modalType, modalData, openModal, closeModal } =
    useAppModal<any>();

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

  /* ================= SAVE ================= */

  const save = async () => {
    try {
      setLoading(true);

      await execute(
        () =>
          modalType === "role-edit" && modalData?.id
            ? updateRole({
                id: modalData.id,
                name: values.name,
              }).unwrap()
            : createRole(values).unwrap(),
        modalType === "role-edit"
          ? "Role updated"
          : "Role created"
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

  const handleDelete = (role: Role) =>
    confirmDelete(
      "Are you sure you want to delete this role?",
      async () => {
        await execute(
          () => deleteRole(role.id).unwrap(),
          "Role deleted"
        );
      }
    );

  /* ================= ROW ACTIONS ================= */

  const getRowActions = (role: Role) => [
    {
      key: "permissions",
      icon: ICONS.PERMISSION,
      title: "Assign Permissions",
      show: can(PERMISSIONS.ROLE.MANAGE),
      onClick: () =>
        openModal("assign", {
          mode: "role-permission",
          entity: role,
        }),
    },
    {
      key: "edit",
      icon: ICONS.EDIT,
      title: "Edit Role",
      show: can(PERMISSIONS.ROLE.MANAGE),
      onClick: () => {
        setField("name", role.name);
        openModal("role-edit", role);
      },
    },
    {
      key: "delete",
      icon: ICONS.DELETE,
      title: "Delete Role",
      variant: "danger" as const,
      show: can(PERMISSIONS.ROLE.MANAGE),
      onClick: () => handleDelete(role),
    },
  ];

  /* ================= VIEW ================= */

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
              hasData={roles.length > 0}
              columns={
                <tr>
                  <th>Name</th>
                  <th
                    className="text-right"
                    style={{ width: 220 }}
                  >
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

        {/* ADD / EDIT ROLE MODAL */}
        {(modalType === "role-add" ||
          modalType === "role-edit") && (
          <Modal
            title={
              modalType === "role-edit"
                ? "Edit Role"
                : "Add Role"
            }
            onClose={closeModal}
            onSave={save}
            saveDisabled={loading}
            saveText={
              modalType === "role-edit"
                ? "Update"
                : "Save"
            }
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
              placeholder="Role name"
            />

            {errors.name && (
              <div className="invalid-feedback">
                {errors.name[0]}
              </div>
            )}
          </Modal>
        )}

        {/* ✅ GENERIC ASSIGN MODAL */}
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

export default memo(RolesPage);
