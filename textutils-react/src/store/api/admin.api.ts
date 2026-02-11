import { baseApi } from "./baseApi";
import type { User, Role, Permission } from "../../types/models";

/* ======================================================
   SHARED TYPES
====================================================== */

type PaginatedMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedMeta;
};

/* ======================================================
   ADMIN API
====================================================== */

export const adminApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({

    /* ================= USERS ================= */

    getUsers: builder.query<
      PaginatedResponse<User>,
      { search?: string; page?: number }
    >({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      transformResponse: (res: any) => ({
        data: res.data ?? [],
        meta: res.meta,
      }),
      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    createUser: builder.mutation<User, any>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<
      User,
      { id: number; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: data,
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
      { roles: string[] },
      { id: number; roles: string[] }
    >({
      query: ({ id, roles }) => ({
        url: `/admin/users/${id}/assign-role`,
        method: "POST",
        body: { roles },
      }),
      invalidatesTags: ["Users"],
    }),

    getUserPermissions: builder.query<
      { permissions: Permission[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/users/${id}/permissions`,
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Users", id }],
    }),

    assignUserPermissions: builder.mutation<
      { assigned: string[] },
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

    getPermissions: builder.query<Permission[], void>({
      query: () => "/admin/permissions",
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

    getDashboardStats: builder.query<
      { total_users: number },
      void
    >({
      query: () => "/admin/dashboard/stats",
      transformResponse: (res: any) => res.data,
    }),

  }),
});

/* ======================================================
   HOOK EXPORTS
====================================================== */

export const {
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
} = adminApi;
