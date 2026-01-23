import api from "../api/axios";

export const createAdminService = (data: {
  name: string;
  email: string;
  role: string;
}) => {
  return api.post("/admin/admins", data);
};
