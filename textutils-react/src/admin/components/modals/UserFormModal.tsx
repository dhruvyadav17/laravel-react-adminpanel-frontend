import { useEffect } from "react";
import CrudModal from "../../../components/common/CrudModal";
import FormInput from "../../../components/common/FormInput";
import { useCrudForm } from "../../../hooks/useCrudForm";

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
  /* ================= MUTATIONS ================= */

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  /* ================= CRUD FORM ================= */

  const form = useCrudForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    create: createUser,
    update: updateUser,
    onSuccess: onSaved,
  });

  /* ================= SYNC EDIT DATA ================= */

  useEffect(() => {
    if (user) {
      form.setAllValues({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
      });
    } else {
      form.reset();
    }
  }, [user]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    user?.id
      ? form.update(user.id)
      : form.create();
  };

  /* ================= VIEW ================= */

  return (
    <CrudModal
      title={getModalTitle("User", user)}
      loading={form.loading}
      onSave={handleSubmit}
      onClose={onClose}
      saveText={user ? "Update" : "Save"}
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
    </CrudModal>
  );
}
