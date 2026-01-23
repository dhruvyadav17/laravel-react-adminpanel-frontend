import { useState } from "react";
import CreateAdminModal from "../../components/admin/CreateAdminModal";

export default function AdminUsers() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mt-4">
      <h4>Admin Users</h4>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setOpen(true)}
      >
        + Create Admin
      </button>

      {open && (
        <CreateAdminModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
