import Modal from "../../../components/common/Modal";
import FormInput from "../../../components/common/FormInput";
import { useBackendForm } from "../../../hooks/useBackendForm";
import { useCreateUserMutation } from "../../../store/api";
import { execute } from "../../../utils/execute";
import { getModalTitle } from "../../../utils/modalTitle";

import type { User } from "../../../types/models";

type Props = {
  onClose: () => void;
  onSaved: () => void;
  user?: User | null; // 👈 future-proof
};

export default function UserFormModal({
  onClose,
  onSaved,
  user,
}: Props) {
  const {
    values,
    errors,
    loading,
    setField,
    handleError,
    reset,
  } = useBackendForm({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    password_confirmation: "",
  });

  const [createUser] = useCreateUserMutation();

  const save = async () => {
    try {
      await execute(
        () => createUser(values).unwrap(),
        "User created successfully"
      );

      reset();
      onSaved();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Modal
      title={getModalTitle("User", user)}
      onClose={onClose}
      onSave={save}
      saveDisabled={loading}
      saveText={loading ? "Saving..." : "Save"}
    >
      <FormInput
        label="Name"
        value={values.name}
        error={errors.name?.[0]}
        onChange={(v) => setField("name", v)}
        disabled={loading}
        required
      />

      <FormInput
        label="Email"
        type="email"
        value={values.email}
        error={errors.email?.[0]}
        onChange={(v) => setField("email", v)}
        disabled={loading}
        required
      />

      <FormInput
        label="Password"
        type="password"
        value={values.password}
        error={errors.password?.[0]}
        onChange={(v) => setField("password", v)}
        disabled={loading}
        required={!user} // future: optional on edit
      />

      <FormInput
        label="Confirm Password"
        type="password"
        value={values.password_confirmation}
        error={errors.password_confirmation?.[0]}
        onChange={(v) =>
          setField("password_confirmation", v)
        }
        disabled={loading}
        required={!user}
      />
    </Modal>
  );
}
