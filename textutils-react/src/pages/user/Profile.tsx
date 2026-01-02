import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { profileService } from "../../services/authService";
import { setPermissions, logoutThunk } from "../../store/authSlice";
import { useAuth } from "../../auth/hooks/useAuth";

/* ================= TYPES ================= */
type UserProfile = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

type ProfileResponse = {
  user: UserProfile;
  permissions?: string[];
};

/* ================= COMPONENT ================= */
export default function Profile() {
  const dispatch = useDispatch();
  const { isSuperAdmin } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        
        const res = await profileService();
        //console.log("loadProfile"); return false;
        const data: ProfileResponse | undefined = res.data?.data;
        console.log(res.data?.data);
        if (!data || !active) return;

        setProfile(data.user);

        // 🔥 permissions sync only when needed
        if (
          Array.isArray(data.permissions) &&
          !isSuperAdmin
        ) {
          dispatch(setPermissions(data.permissions));
        }
      } catch (err: any) {
        if (!active) return;

        if (err?.response?.status === 401) {
          dispatch(logoutThunk());
        } else {
          setError("Failed to load profile");
        }
      } finally {
        active && setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [dispatch, isSuperAdmin]);

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-4 text-muted">
        No profile data found
      </div>
    );
  }

  /* ================= VIEW ================= */
  return (
    <div className="container mt-4">
      <h3>Profile</h3>

      <div className="card mt-3">
        <div className="card-body">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <p>
            <strong>Roles:</strong>{" "}
            {profile.roles.length
              ? profile.roles.map(r => r.name).join(", ") || JSON.stringify(profile.roles )
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
