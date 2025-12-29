import api from "../api/axios";

/* ======================================================
   ROLES (CRUD)
====================================================== */

/**
 * Get all roles (with permission count)
 */
export const getRoles = () => {
  return api.get("/admin/roles");
};

/**
 * Create new role
 */
export const createRole = (data: { name: string }) => {
  return api.post("/admin/roles", data);
};

/**
 * Update role
 */
export const updateRole = (
  id: number,
  data: { name: string }
) => {
  return api.put(`/admin/roles/${id}`, data);
};

/**
 * Delete role
 */
export const deleteRole = (id: number) => {
  return api.delete(`/admin/roles/${id}`);
};

/**
 * Enable / Disable role
 */
export const toggleRole = (id: number) => {
  return api.patch(`/admin/roles/${id}/toggle`);
};

/* ======================================================
   ROLE → PERMISSIONS
====================================================== */

/**
 * Get all permissions + assigned permissions for role
 */
export const getRolePermissions = (id: number) => {
  return api.get(`/admin/roles/${id}/permissions`);
};

/**
 * Assign permissions to role
 */
export const assignRolePermissions = (
  id: number,
  permissions: string[]
) => {
  return api.post(`/admin/roles/${id}/permissions`, {
    permissions,
  });
};

/* ======================================================
   USER → ROLES
====================================================== */

/**
 * Assign roles to user (admin / super-admin only)
 */
// export const assignUserRoles = (
//   userId: number,
//   roles: string[]
// ) => {
//   return api.post(`/admin/users/${userId}/assign-role`, {
//     roles,
//   });
// };
export const getUserRoles = (userId: number) => {
  return api.get(`/admin/users/${userId}/roles`);
};

// export const createRole = (data: { name: string }) => {
//   return api.post("/admin/roles", data);
// };
