import api from "../../api/axios";

export default function ResendVerification() {
  const resend = async () => {
    await api.post("/email/resend");
    alert("Verification email sent");
  };

  return (
    <div className="container mt-5 text-center">
      <h4>Email not verified</h4>
      <button onClick={resend} className="btn btn-primary">
        Resend verification email
      </button>
    </div>
  );
}
