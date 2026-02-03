import Modal from "../../../components/common/Modal";
import { useBackendForm } from "../../../hooks/useBackendForm";
import { useCreateUserMutation } from "../../../store/api";
import { execute } from "../../../utils/execute";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function UserFormModal({
  onClose,
  onSaved,
}: Props) {
  const {
    values,
    errors,
    loading,
    setField,
    handleError,
    reset,
  } = useBackendForm({
    name: "",
    email: "",
  });

  const [createUser] = useCreateUserMutation();

  /* ================= SAVE ================= */

  const save = async () => {
    try {
      await execute(
        () => createUser(values).unwrap(),
        "User created successfully. Password setup email sent."
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
      <input
        className={`form-control mb-2 ${
          errors.name ? "is-invalid" : ""
        }`}
        placeholder="Name"
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
        disabled={loading}
      />
      {errors.name && (
        <div className="invalid-feedback">
          {errors.name[0]}
        </div>
      )}

      <input
        className={`form-control mb-2 ${
          errors.email ? "is-invalid" : ""
        }`}
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={(e) =>
          setField("email", e.target.value)
        }
        disabled={loading}
      />
      {errors.email && (
        <div className="invalid-feedback">
          {errors.email[0]}
        </div>
      )}
    </Modal>
  );
}
