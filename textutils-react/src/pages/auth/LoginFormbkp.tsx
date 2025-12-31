import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../store/authSlice";
import { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
};

export default function LoginForm({ title }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(
    (state: RootState) => state.auth.loading
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await dispatch(
      loginThunk({ email, password })
    );

    if (loginThunk.fulfilled.match(res)) {
      const roles = res.payload.user.roles || [];

      navigate(
        roles.includes("admin") || roles.includes("super-admin")
          ? "/admin/dashboard"
          : "/profile",
        { replace: true }
      );
    }
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
      </form>
    </div>
  );
}
