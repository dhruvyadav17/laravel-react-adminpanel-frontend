import Modal from "../../../components/common/Modal";
import { useBackendForm } from "../../../hooks/useBackendForm";
import { useCreateUserMutation, useGetRolesQuery } from "../../../store/api";
import { execute } from "../../../utils/execute";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function UserFormModal({ onClose, onSaved }: Props) {
  const { values, errors, loading, setField, handleError, reset } =
    useBackendForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

  const [createUser] = useCreateUserMutation();
  const { data: roles = [] } = useGetRolesQuery();

  /* ================= SAVE ================= */

  const save = async () => {
    try {
      await execute(
        () => createUser(values).unwrap(),
        "User created successfully",
      );

      reset();
      onSaved();
    } catch (e) {
      handleError(e); // backend validation only
    }
  };

  /* ================= VIEW ================= */

  return (
    <Modal
      title="Add User"
      onClose={onClose}
      onSave={save}
      saveDisabled={loading}
      saveText={loading ? "Creating..." : "Create"}
    >
      {/* NAME */}
      <input
        className={`form-control mb-2 ${errors.name ? "is-invalid" : ""}`}
        placeholder="Name"
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
        disabled={loading}
      />
      {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}

      {/* EMAIL */}
      <input
        className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={(e) => setField("email", e.target.value)}
        disabled={loading}
      />
      {errors.email && (
        <div className="invalid-feedback">{errors.email[0]}</div>
      )}

      {/* PASSWORD */}
      <input
        className={`form-control mb-2 ${errors.password ? "is-invalid" : ""}`}
        type="password"
        placeholder="Password"
        value={values.password}
        onChange={(e) => setField("password", e.target.value)}
        disabled={loading}
      />
      {errors.password && (
        <div className="invalid-feedback">{errors.password[0]}</div>
      )}

      {/* CONFIRM PASSWORD */}
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

      {/* ROLE (DYNAMIC) */}
      <select
        className={`form-control mb-2 ${errors.role ? "is-invalid" : ""}`}
        value={values.role}
        onChange={(e) => setField("role", e.target.value)}
        disabled={loading}
      >
        {roles.map((role) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>

      {errors.role && <div className="invalid-feedback">{errors.role[0]}</div>}
    </Modal>
  );
}
