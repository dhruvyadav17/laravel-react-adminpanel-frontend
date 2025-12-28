import api from "../api/axios";

export const loginService = async (
  email: string,
  password: string
) => {
  const res = await api.post("/login", { email, password });

  // 🔥 normalize user.roles → string[]
  const data = res.data.data;

  data.user.roles = Array.isArray(data.user.roles)
    ? data.user.roles.map((r: any) =>
        typeof r === "string" ? r : r.name
      )
    : [];

  return res;
};

export const profileService = () => api.get("/profile");

export const logoutService = () => api.post("/logout");
