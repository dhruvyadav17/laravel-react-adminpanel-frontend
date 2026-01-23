import { useState } from "react";
import { createAdminService } from "../../services/userService";

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

  const submit = async () => {
    const res = await createAdminService(form);
    alert(
      `Admin created!\nEmail: ${res.data.data.email}\nPassword: ${res.data.data.password}`
    );
    onClose();
  };

  return (
    <div className="modal">
      <h5>Create Admin</h5>

      <input
        placeholder="Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />
      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <select
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
      </select>

      <button onClick={submit}>Create</button>
    </div>
  );
}
