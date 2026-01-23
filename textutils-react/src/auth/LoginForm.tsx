import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  loginThunk,
  fetchProfileThunk,
} from "../store/authSlice";

import type { RootState, AppDispatch } from "../store";
import { handleApiError } from "../utils/toastHelper";
import { resolveLoginRedirect } from "../utils/authRedirect";

type Props = {
  title: string;
  redirectAdmin?: boolean;
};

export default function LoginForm({
  title,
  redirectAdmin = false,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(
    (s: RootState) => s.auth.loading
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginRes = await dispatch(
      loginThunk({ email, password })
    );

    if (loginThunk.rejected.match(loginRes)) {
      handleApiError(loginRes.payload || loginRes.error);
      return;
    }

    const profileRes = await dispatch(fetchProfileThunk());

    const redirectTo = resolveLoginRedirect(
      profileRes.payload?.user ?? null,
      redirectAdmin
    );

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h4 className="mb-3 text-center">{title}</h4>

      <form onSubmit={submit}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link to="/forgot-password" className="d-block mt-2">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
