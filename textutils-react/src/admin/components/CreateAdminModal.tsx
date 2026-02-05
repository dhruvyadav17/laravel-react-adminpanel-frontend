import { useState } from "react";
import Modal from "../../components/common/Modal";
import FormInput from "../../components/common/FormInput";
import { useCreateAdminMutation } from "../../store/api";
import { execute } from "../../utils/execute";

type Props = {
  onClose: () => void;
};

export default function CreateAdminModal({ onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const submit = async () => {
    const res = await execute(
      () => createAdmin(form).unwrap(),
      "Admin created successfully"
    );

    if (!res) return;

    alert(
      `Admin created!\n\nEmail: ${res.email}\nPassword: ${res.password}\n\n⚠️ Please save this password now.`
    );

    onClose();
  };

  return (
    <Modal
      title="Create Admin"
      onClose={onClose}
      onSave={submit}
      saveText={isLoading ? "Creating..." : "Create"}
      loading={isLoading}
      size="sm"
    >
      <FormInput
        label="Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        required
      />

      <FormInput
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
        required
      />

      <div className="form-group">
        <label className="form-label">
          Role <span className="text-danger">*</span>
        </label>

        <select
          className="form-control"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
      </div>
    </Modal>
  );
}
