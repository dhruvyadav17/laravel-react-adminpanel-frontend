import { useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { createAdminService } from "../features/users/user.api";
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

  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */

  const submit = async () => {
    setLoading(true);

    try {
      await execute(
        () => createAdminService(form),
        "Admin created successfully. Password setup email sent."
      );

      onClose();
    } finally {
      setLoading(false);
    }
  };

  /* ================= VIEW ================= */

  return (
    <Modal
      title="Create Admin"
      onClose={onClose}
      onSave={submit}
      saveDisabled={loading}
      saveText={loading ? "Creating..." : "Create"}
    >
      <input
        className="form-control mb-2"
        placeholder="Name"
        value={form.name}
        disabled={loading}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        placeholder="Email"
        type="email"
        value={form.email}
        disabled={loading}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <select
        className="form-control"
        value={form.role}
        disabled={loading}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
      </select>
    </Modal>
  );
}
