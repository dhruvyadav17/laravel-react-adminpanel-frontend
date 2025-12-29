import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { profileService } from "../../services/authService";
import { setPermissions } from "../../store/authSlice";

type ProfileData = {
  user: any;
  roles?: string[];
  permissions?: string[];
};

export default function Profile() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService()
      .then((res) => {
        const data = res.data?.data;

        if (!data) {
          setError("Failed to load profile");
          return;
        }

        setProfile(data);

        /* 🔥 BACKEND → FRONTEND PERMISSION SYNC */
        if (Array.isArray(data.permissions)) {
          dispatch(setPermissions(data.permissions));
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Something went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Profile</h3>

      <div className="card mt-3">
        <div className="card-body">
          <pre className="mb-0">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
