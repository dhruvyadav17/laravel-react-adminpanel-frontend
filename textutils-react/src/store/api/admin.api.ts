import { baseApi } from "./baseApi";
import type { User, Role, Permission } from "@/types/models";
import type { PaginationMeta } from "@/types/pagination";
import { buildQueryParams } from "@/utils/buildQueryParams";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= USERS ================= */

    getUsers: builder.query<
      { data: User[]; meta: PaginationMeta },
      { page?: number; search?: string } | void
    >({
      query: (params) =>
        `/admin/users${buildQueryParams(params)}`,
      transformResponse: (res: any) => ({
        data: res.data ?? [],
        meta: res.meta,
      }),
      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    createUser: builder.mutation<any, Partial<User>>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    restoreUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    assignUserRoles: builder.mutation<
      void,
      { id: number; roles: string[] }
    >({
      query: ({ id, roles }) => ({
        url: `/admin/users/${id}/assign-role`,
        method: "POST",
        body: { roles },
      }),
      invalidatesTags: ["Users"],
    }),

    toggleUserStatus: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    forceUserPasswordReset: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/force-password-reset`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    /* ================= USER → PERMISSIONS ================= */

    getUserPermissions: builder.query<
      { permissions: Permission[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/users/${id}/permissions`,
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Users", id }],
    }),

    assignUserPermissions: builder.mutation<
      void,
      { id: number; permissions: string[] }
    >({
      query: ({ id, permissions }) => ({
        url: `/admin/users/${id}/permissions`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Users", id }],
    }),

    /* ================= ROLES ================= */

    getRoles: builder.query<Role[], void>({
      query: () => "/admin/roles",
      transformResponse: (res: any) => res.data ?? [],
      providesTags: ["Roles"],
    }),

    createRole: builder.mutation<any, { name: string }>({
      query: (body) => ({
        url: "/admin/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    updateRole: builder.mutation<any, { id: number; name: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/roles/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

    /* ================= ROLE → PERMISSIONS ================= */

    getRolePermissions: builder.query<
      { permissions: Permission[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/roles/${id}/permissions`,
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Roles", id }],
    }),

    assignRolePermissions: builder.mutation<
      void,
      { id: number; permissions: string[] }
    >({
      query: ({ id, permissions }) => ({
        url: `/admin/roles/${id}/permissions`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Roles", id }],
    }),

    /* ================= PERMISSIONS ================= */

    getPermissions: builder.query<
      Permission[],
      { flat?: boolean } | void
    >({
      query: (params) =>
        `/admin/permissions${buildQueryParams(params)}`,
      transformResponse: (res: any) => res.data ?? [],
      providesTags: ["Permissions"],
    }),

    createPermission: builder.mutation<any, { name: string }>({
      query: (body) => ({
        url: "/admin/permissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Permissions"],
    }),

    updatePermission: builder.mutation<any, { id: number; name: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/permissions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Permissions"],
    }),

    deletePermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permissions"],
    }),

    /* ================= SIDEBAR ================= */

    getSidebar: builder.query<any[], void>({
      query: () => "/admin/sidebar",
      transformResponse: (res: any) => res.data ?? [],
      providesTags: ["Sidebar"],
    }),

    /* ================= DASHBOARD ================= */

    getDashboardStats: builder.query<{ total_users: number }, void>({
      query: () => "/admin/dashboard/stats",
      transformResponse: (res: any) => res.data,
    }),

    /* ================= AUDIT LOGS ================= */

    getAuditLogs: builder.query<
      { data: any[]; meta: PaginationMeta },
      { page?: number; action?: string } | void
    >({
      query: (params) =>
        `/admin/audit-logs${buildQueryParams(params)}`,
      transformResponse: (res: any) => ({
        data: res.data ?? [],
        meta: res.meta,
      }),
      providesTags: [{ type: "AuditLogs", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useAssignUserRolesMutation,
  useToggleUserStatusMutation,
  useForceUserPasswordResetMutation,

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
  useGetAuditLogsQuery,
} = adminApi;
