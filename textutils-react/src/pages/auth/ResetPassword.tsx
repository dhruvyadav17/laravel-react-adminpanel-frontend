import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import {
  handleApiError,
  handleApiSuccess,
} from "../../utils/toastHelper";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: confirm,
      });

      handleApiSuccess(res);
      navigate("/login", { replace: true });
    } catch (e) {
      // ✅ Backend DomainException message shown here
      handleApiError(e);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <p className="text-danger">
        Invalid reset link
      </p>
    );
  }

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: 420 }}
    >
      <h4>Reset Password</h4>

      <form onSubmit={submit}>
        {/* New Password */}
        <input
          type="password"
          className="form-control mb-1"
          placeholder="New password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        {/* 🔑 STEP-7: UX HINT (ONLY ADDITION) */}
        <small className="text-muted d-block mb-3">
          Password must be different from last 5 passwords
        </small>

        {/* Confirm Password */}
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) =>
            setConfirm(e.target.value)
          }
          required
        />

        <button
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
