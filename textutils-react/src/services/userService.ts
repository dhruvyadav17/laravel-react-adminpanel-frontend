import api from "../api/axios";

export const getUsers = async () => {
  const res = await api.get("/admin/users");

  // 🔥 normalize roles → ALWAYS string[]
  res.data.data = res.data.data.map((u: any) => ({
    ...u,
    roles: Array.isArray(u.roles)
      ? u.roles.map((r: any) =>
          typeof r === "string" ? r : r.name
        )
      : [],
  }));

  return res;
};

/* ================= USERS ================= */
export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  roles: string[];
}) => api.post("/admin/users", data);
export const updateUser = (id: number, data: any) =>
  api.put(`/admin/users/${id}`, data);

export const deleteUser = (id: number) =>
  api.delete(`/admin/users/${id}`);

export const assignUserRoles = (
  userId: number,
  roles: string[]
) => {
  return api.post(`/admin/users/${userId}/assign-role`, {
    roles,
  });
};

/* ================= ROLES ================= */

export const getRoles = () => {
  return api.get("/admin/roles");
};