import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerService } from "../services/authService";
import { handleApiError } from "../utils/toastHelper";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerService(form);
      navigate("/verify-email", { replace: true });
    } catch (e: any) {
      handleApiError(e);
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        className="form-control mb-2"
        placeholder="Name"
        required
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        type="email"
        placeholder="Email"
        required
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        required
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Confirm Password"
        required
        onChange={(e) =>
          setForm({
            ...form,
            password_confirmation: e.target.value,
          })
        }
      />

      <button className="btn btn-primary w-100">
        Sign Up
      </button>
    </form>
  );
}
