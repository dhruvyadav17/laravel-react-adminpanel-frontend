import { useBackendForm } from "../../hooks/useBackendForm";
import api from "../../api/axios";
import { execute } from "../../utils/execute";

type FormValues = {
  email: string;
};

export default function ForgotPassword() {
  const {
    values,
    errors,
    loading,
    setLoading,
    setField,
    handleError,
    reset,
  } = useBackendForm<FormValues>({
    email: "",
  });

  /* ================= SUBMIT ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await execute(
      async () => {
        setLoading(true);

        const res = await api.post("/forgot-password", {
          email: values.email,
        });

        reset();
        return res;
      },
      {
        defaultMessage: "Password reset link sent to your email",
      }
    ).finally(() => setLoading(false));
  };


  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h4 className="mb-3">Forgot Password</h4>

      <form onSubmit={submit}>
        {/* EMAIL */}
        <input
          type="email"
          className={`form-control mb-2 ${
            errors.email ? "is-invalid" : ""
          }`}
          placeholder="Enter your email"
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          disabled={loading}
          required
        />

        {errors.email && (
          <div className="invalid-feedback">
            {errors.email[0]}
          </div>
        )}

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
