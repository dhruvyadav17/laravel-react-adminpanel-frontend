import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="container mt-5 text-center">
      <h2 className="text-danger mb-3">403 – Unauthorized</h2>

      <p className="text-muted">
        You do not have permission to access this page.
      </p>

      <Link to="/admin/dashboard" className="btn btn-primary mt-3">
        Go to Dashboard
      </Link>
    </div>
  );
}
