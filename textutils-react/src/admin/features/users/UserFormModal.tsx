import Modal from "../../../components/common/Modal";
import FormInput from "../../../components/common/FormInput";
import { useModalForm } from "../../../hooks/useModalForm";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../store/api";
import { getModalTitle } from "../../../utils/modalTitle";

import type { User } from "../../../types/models";

type Props = {
  onClose: () => void;
  onSaved: () => void;
  user?: User | null;
};

export default function UserFormModal({
  onClose,
  onSaved,
  user,
}: Props) {
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const form = useModalForm(
    {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      password_confirmation: "",
    },
    {
      onSubmit: (values) => {
        if (user?.id) {
          return updateUser({
            id: user.id,
            data: values,
          }).unwrap();
        }

        return createUser(values).unwrap();
      },
      onSuccess: onSaved,
    }
  );

  return (
    <Modal
      title={getModalTitle("User", user)}
      onClose={onClose}
      onSave={form.submit}
      saveDisabled={form.loading}
      saveText={form.loading ? "Saving..." : "Save"}
    >
      <FormInput
        label="Name"
        value={form.values.name}
        error={form.errors.name?.[0]}
        onChange={(v) => form.setField("name", v)}
        disabled={form.loading}
        required
      />

      <FormInput
        label="Email"
        type="email"
        value={form.values.email}
        error={form.errors.email?.[0]}
        onChange={(v) => form.setField("email", v)}
        disabled={form.loading}
        required
      />

      <FormInput
        label="Password"
        type="password"
        value={form.values.password}
        error={form.errors.password?.[0]}
        onChange={(v) => form.setField("password", v)}
        disabled={form.loading}
        required={!user}
      />

      <FormInput
        label="Confirm Password"
        type="password"
        value={form.values.password_confirmation}
        error={form.errors.password_confirmation?.[0]}
        onChange={(v) =>
          form.setField("password_confirmation", v)
        }
        disabled={form.loading}
        required={!user}
      />
    </Modal>
  );
}
