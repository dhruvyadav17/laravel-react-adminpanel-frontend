import api from "../api/axios";

/* ================= PERMISSIONS ================= */

export const getPermissions = () =>
  api.get("/admin/permissions");

export const createPermission = (data: { name: string }) =>
  api.post("/admin/permissions", data);

export const updatePermission = (
  id: number,
  data: { name: string }
) =>
  api.put(`/admin/permissions/${id}`, data);

export const deletePermission = (id: number) =>
  api.delete(`/admin/permissions/${id}`);

export const togglePermission = (id: number) =>
  api.patch(`/admin/permissions/${id}/toggle`);
