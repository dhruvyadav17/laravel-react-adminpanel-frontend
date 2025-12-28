import { useEffect, useState } from "react";
import { profileService } from "../../services/authService";

type ProfileData = {
  user: any;
  roles?: string[];
  permissions?: string[];
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    profileService()
      .then((res) => {
        if (res.data?.status) {
          setProfile(res.data.data);
        } else {
          setError(res.data?.message || "Failed to load profile");
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
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
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
