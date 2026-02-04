import { useState } from "react";
import { useCreateAdminMutation } from "../../store/api";
import { execute } from "../../utils/execute";

export default function CreateAdminModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const submit = async () => {
    const result = await execute(
      () => createAdmin(form).unwrap(),
      "Admin created successfully"
    );

    if (!result) return;

    const { email, password } = result;

    alert(
      `Admin created!\n\nEmail: ${email}\nPassword: ${password}\n\n⚠️ Please save this password now.`
    );

    onClose();
  };

  return (
    <div className="modal">
      <h5>Create Admin</h5>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <select
        value={form.role}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
      </select>

      <button onClick={submit} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
