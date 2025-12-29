import { useEffect, useState } from "react";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../../services/permissionService";
import { handleApiError, handleApiSuccess } from "../../utils/toastHelper";
import Modal from "../../components/common/Modal";
import { usePermission } from "../../auth/hooks/usePermission";
import { PERMISSIONS } from "../../constants/permissions";
import { useAppModal } from "../../hooks/useAppModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useBackendForm } from "../../hooks/useBackendForm";
export default function Permissions() {
  const [list, setList] = useState<any[]>([]);
  //const [name, setName] = useState("");

  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } = useAppModal<any>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fetchData = async () => {
    try {
      const res = await getPermissions();
      setList(res.data.data);
    } catch (e) {
      handleApiError(e);
    }
  };
  const { values, errors, loading, setLoading, setField, handleError, reset } =
    useBackendForm({ name: "" });
  useEffect(() => {
    fetchData();
  }, []);

  if (!can(PERMISSIONS.PERMISSION_MANAGE)) {
    return <p className="text-danger">Unauthorized</p>;
  }

  // const save = async () => {
  //   try {
  //     const res = modalData?.id
  //       ? await updatePermission(modalData.id, { name })
  //       : await createPermission({ name });

  //     handleApiSuccess(res);
  //     fetchData();
  //   } catch (e) {
  //     handleApiError(e);
  //   } finally {
  //     closeModal(); // ✅ CENTRALIZED CLOSE
  //     setName("");
  //   }
  // };
  const save = async () => {
    try {
      setLoading(true);
      console.log(modalData?.id);
      const res = modalData?.id
        ? await updatePermission(modalData.id, values)
        : await createPermission(values);

      handleApiSuccess(res);
      fetchData();
      closeModal();
      reset();
    } catch (e) {
      handleError(e); // ✅ field errors
      handleApiError(e); // ✅ toast
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Permissions</h3>

        <button
          className="btn btn-primary mb-3"
          onClick={() => openModal("permission")}
        >
          + Add Permission
        </button>
      </div>

      <ul className="list-group">
        {list.map((p) => (
          <li
            key={p.id}
            className="list-group-item d-flex justify-content-between"
          >
            {p.name}
            <div>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => {
                  setField("name", p.name);
                  openModal("permission", p);
                }}
              >
                Edit
              </button>

              {/* <button
                className="btn btn-sm btn-danger ms-1"
                onClick={async () => {
                  try {
                    const res = await deletePermission(p.id);
                    handleApiSuccess(res);
                    fetchData();
                  } catch (e) {
                    handleApiError(e);
                  }
                }}
              >
                Delete
              </button> */}

              <button
                className="btn btn-sm btn-danger ms-1"
                onClick={() => setDeleteId(p.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalType === "permission" && (
        <Modal
          title="Permission"
          onClose={closeModal}
          onSave={save}
          saveDisabled={false}
          button_name={modalData?.id ? "Update" : "Save"}
        >
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={values.name}
            onChange={(e) => setField("name",e.target.value)}
          />
          {errors.name && (
  <div className="invalid-feedback">
    {errors.name[0]}
  </div>
)}
        </Modal>
      )}

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this permission?"
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            try {
              const res = await deletePermission(deleteId);
              handleApiSuccess(res);
              fetchData();
            } catch (e) {
              handleApiError(e);
            } finally {
              setDeleteId(null);
            }
          }}
        />
      )}
    </div>
  );
}
