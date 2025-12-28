import { useState } from "react";
import Modal from "./common/Modal";
import { createUser } from "../services/userService";
import {
  handleApiSuccess,
  handleApiError,
} from "../utils/toastHelper";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function UserFormModal({
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] =
    useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      password.length < 8 ||
      password !== passwordConfirm
    ) {
      handleApiError(
        null,
        "Fill all fields correctly (password must match & be 8+ chars)"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await createUser({
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      });

      handleApiSuccess(res, "User created successfully");

      // 🔥 SUCCESS → parent will close modal
      onSaved();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      //onClose();
    }
  };

  return (
    <Modal
      title="Add User"
      onClose={onClose}   // ❌ Cancel / X
      onSave={save}
      saveDisabled={loading}
    >
      <input
        className="form-control mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />

      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password (min 8 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChange={(e) =>
          setPasswordConfirm(e.target.value)
        }
        disabled={loading}
      />
    </Modal>
  );
}
