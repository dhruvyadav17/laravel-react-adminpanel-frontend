export { baseApi } from "./baseApi";

/* ================= USERS ================= */
export {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,

  // 🔐 Roles
  useAssignUserRolesMutation,

  // 🔐 Permissions  ✅ REQUIRED FIX
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,
} from "./users.api";

/* ================= ROLES ================= */
export {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} from "./roles.api";

/* ================= PERMISSIONS ================= */
export {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "./permissions.api";

/* ================= SIDEBAR ================= */
export { useGetSidebarQuery } from "./sidebar.api";

/* ================= DASHBOARD ================= */
export { useGetDashboardStatsQuery } from "./dashboard.api";
