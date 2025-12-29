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

export default function Permissions() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState("");

  const can = usePermission();
  const { modalType, modalData, openModal, closeModal } = useAppModal<any>();

  const fetchData = async () => {
    try {
      const res = await getPermissions();
      setList(res.data.data);
    } catch (e) {
      handleApiError(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!can(PERMISSIONS.PERMISSION_MANAGE)) {
    return <p className="text-danger">Unauthorized</p>;
  }

  const save = async () => {
    try {
      const res = modalData?.id
        ? await updatePermission(modalData.id, { name })
        : await createPermission({ name });

      handleApiSuccess(res);
      fetchData();
    } catch (e) {
      handleApiError(e);
    } finally {
      closeModal(); // ✅ CENTRALIZED CLOSE
      setName("");
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
                  setName(p.name);
                  openModal("permission", p);
                }}
              >
                Edit
              </button>

              <button
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
          button_name="Save"
        >
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
}
