import Modal from "./common/Modal";
import { useBackendForm } from "../hooks/useBackendForm";
import { useCreateUserMutation } from "../store/api";
import { handleApiSuccess, handleApiError } from "../utils/toastHelper";
import { execute } from "../utils/execute";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function UserFormModal({ onClose, onSaved }: Props) {
  /* ================= FORM ================= */
  const { values, errors, loading, setLoading, setField, handleError, reset } =
    useBackendForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

  /* ================= API ================= */
  const [createUser] = useCreateUserMutation();

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      await execute(
        () => createUser(values).unwrap(),
        "User created successfully"
      );
      reset();
      onSaved();
    } catch (e) {
      handleError(e); // keep backend validation
    }
  };

  return (
    <Modal
      title="Add User"
      onClose={onClose}
      onSave={save}
      saveDisabled={loading}
      button_name={loading ? "Saving..." : "Save"}
    >
      {/* ================= NAME ================= */}
      <input
        className={`form-control mb-2 ${errors.name ? "is-invalid" : ""}`}
        placeholder="Name"
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
        disabled={loading}
      />
      {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}

      {/* ================= EMAIL ================= */}
      <input
        className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
        placeholder="Email"
        value={values.email}
        onChange={(e) => setField("email", e.target.value)}
        disabled={loading}
      />
      {errors.email && (
        <div className="invalid-feedback">{errors.email[0]}</div>
      )}

      {/* ================= PASSWORD ================= */}
      <input
        className={`form-control mb-2 ${errors.password ? "is-invalid" : ""}`}
        type="password"
        placeholder="Password (min 8 chars)"
        value={values.password}
        onChange={(e) => setField("password", e.target.value)}
        disabled={loading}
      />
      {errors.password && (
        <div className="invalid-feedback">{errors.password[0]}</div>
      )}

      {/* ================= CONFIRM PASSWORD ================= */}
      <input
        className={`form-control mb-2 ${
          errors.password_confirmation ? "is-invalid" : ""
        }`}
        type="password"
        placeholder="Confirm Password"
        value={values.password_confirmation}
        onChange={(e) => setField("password_confirmation", e.target.value)}
        disabled={loading}
      />
      {errors.password_confirmation && (
        <div className="invalid-feedback">
          {errors.password_confirmation[0]}
        </div>
      )}
    </Modal>
  );
}
