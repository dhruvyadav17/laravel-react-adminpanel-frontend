import { useEffect } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import ProfileRoles from "./ProfileRoles";
import { useLogout } from "../../../auth/hooks/useLogout";

export default function ProfilePage() {
  const { user } = useAuth();
  const logout = useLogout();
  useEffect(() => {
    // Bootstrap tab fix (jQuery)
    // @ts-ignore
    window.$?.('[data-toggle="tab"]').tab();
  }, []);

  if (!user) {
    return (
      <div className="container mt-5 text-center text-muted">
        No profile data found
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* ================= LEFT PROFILE CARD ================= */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <img
                src="https://ui-avatars.com/api/?name={user.name}&background=0d6efd&color=fff&size=128"
                className="rounded-circle mb-3"
                alt="Profile"
              />

              <h5 className="mb-1">{user.name}</h5>
              <p className="text-muted mb-2">{user.email}</p>

              <span className="badge badge-success">Active User</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#profile"
                  >
                    Profile Info
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#roles">
                    My Roles
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#settings">
                    Settings
                  </a>
                </li>
              </ul>
            </div>

            <div className="card-body tab-content">
              {/* ===== PROFILE INFO ===== */}
              <div className="tab-pane fade show active" id="profile">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Name</label>
                    <div className="fw-bold">{user.name}</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Email</label>
                    <div className="fw-bold">{user.email}</div>
                  </div>
                </div>
              </div>

              {/* ===== ROLES ===== */}
              <div className="tab-pane fade" id="roles">
                <ProfileRoles />
              </div>

              {/* ===== SETTINGS (PLACEHOLDER) ===== */}
              <div className="tab-pane fade" id="settings">
                <p className="text-muted">Settings section coming soon.</p>

                <button className="btn btn-outline-danger btn-sm">
                  Change Password
                </button>
                <button
                  className="btn btn-outline-danger btn-sm mt-3"
                  onClick={() => logout("/login")}
                >
                  <i className="fas fa-sign-out-alt mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
