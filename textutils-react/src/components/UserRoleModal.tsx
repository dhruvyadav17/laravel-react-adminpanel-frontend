import { useEffect, useState } from "react";
import Modal from "./common/Modal";
import {
  useGetRolesQuery,
  useAssignUserRolesMutation,
} from "../store/api";
import {
  handleApiError,
  handleApiSuccess,
} from "../utils/toastHelper";

type Props = {
  user: {
    id: number;
    name: string;
    roles: string[];
  };
  onClose: () => void;
  onSaved: () => void;
};

export default function UserRoleModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  /* ================= FETCH ROLES ================= */
  const {
    data: roles = [],
    isLoading,
    isError,
  } = useGetRolesQuery();

  /* ================= ASSIGN ROLE ================= */
  const [
    assignUserRoles,
    { isLoading: saving },
  ] = useAssignUserRolesMutation();

  /* ================= SYNC USER ROLES ================= */
  useEffect(() => {
    setSelected(user.roles || []);
  }, [user.roles]);

  const toggle = (role: string) => {
    setSelected((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      await assignUserRoles({
        id: user.id,
        roles: selected,
      }).unwrap();

      handleApiSuccess(
        null,
        "Roles assigned successfully"
      );

      onSaved(); // parent handles close + refetch
    } catch (e) {
      handleApiError(e);
    } finally {
      onClose(); // ✅ always close modal
    }
  };

  return (
    <Modal
      title={`Assign Roles – ${user.name}`}
      onClose={onClose}
      onSave={save}
      saveDisabled={saving}
      button_name={saving ? "Saving..." : "Assign"}
    >
      {/* ================= STATES ================= */}
      {isLoading && <p>Loading roles...</p>}

      {isError && (
        <p className="text-danger">
          Failed to load roles
        </p>
      )}

      {!isLoading && !roles.length && (
        <p className="text-muted">
          No roles available
        </p>
      )}

      {/* ================= LIST ================= */}
      {!isLoading &&
        roles.map((r: any) => (
          <div key={r.id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`role-${r.id}`}
              checked={selected.includes(r.name)}
              onChange={() => toggle(r.name)}
              disabled={saving}
            />
            <label
              className="form-check-label"
              htmlFor={`role-${r.id}`}
            >
              {r.name}
            </label>
          </div>
        ))}
    </Modal>
  );
}
