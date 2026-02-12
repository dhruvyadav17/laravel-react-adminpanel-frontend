export { baseApi } from "./baseApi";
export { adminApi } from "./admin.api";

export {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useAssignUserRolesMutation,
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,

  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,

  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,

  useGetSidebarQuery,
  useGetDashboardStatsQuery,
} from "./admin.api";
