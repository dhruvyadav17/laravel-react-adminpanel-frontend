import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";
import type { User } from "../types/models";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  // 🔥 CENTRALIZED TAGS
  tagTypes: ["Users", "Roles", "Permissions"],

  endpoints: (builder) => ({
    /* =====================================================
       USERS
    ===================================================== */

    getUsers: builder.query<
      { data: User[]; meta: any },
      { page?: number; search?: string } | void
    >({
      query: (args = {}) => {
        const page = args.page ?? 1;
        const search = args.search ?? "";
        return `/admin/users?page=${page}&search=${search}`;
      },
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"], // archive → reload
    }),

    restoreUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: ["Users"], // restore → reload
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
      invalidatesTags: ["Users"], // role assign → reload
    }),

    /* =====================================================
       USER → PERMISSIONS
    ===================================================== */

    getUserPermissions: builder.query<
      { permissions: any[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/users/${id}/permissions`,
      transformResponse: (res: any) => res.data,
      providesTags: ["Users"],
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
      invalidatesTags: ["Users"], // permission assign → reload
    }),

    /* =====================================================
       ROLES
    ===================================================== */

    getRoles: builder.query<any[], void>({
      query: () => "/admin/roles",
      transformResponse: (res: any) => res.data,
      providesTags: ["Roles"],
    }),

    createRole: builder.mutation<any, { name: string }>({
      query: (data) => ({
        url: "/admin/roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Roles"],
    }),

    updateRole: builder.mutation<any, { id: number; name: string }>({
      query: ({ id, ...data }) => ({
        url: `/admin/roles/${id}`,
        method: "PUT",
        body: data,
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

    /* =====================================================
       ROLE → PERMISSIONS
    ===================================================== */

    getRolePermissions: builder.query<
      { permissions: any[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/roles/${id}/permissions`,
      transformResponse: (res: any) => res.data,
      providesTags: ["Roles"],
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
      invalidatesTags: ["Roles"],
    }),

    /* =====================================================
       PERMISSIONS (MASTER)
    ===================================================== */

    getPermissions: builder.query<any[], void>({
      query: () => "/admin/permissions",
      transformResponse: (res: any) => res.data,
      providesTags: ["Permissions"],
    }),

    createPermission: builder.mutation<any, { name: string }>({
      query: (data) => ({
        url: "/admin/permissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permissions"],
    }),

    updatePermission: builder.mutation<any, { id: number; name: string }>({
      query: ({ id, ...data }) => ({
        url: `/admin/permissions/${id}`,
        method: "PUT",
        body: data,
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

    /* =====================================================
       DASHBOARD
    ===================================================== */

    getDashboardStats: builder.query<{ total_users: number }, void>({
      query: () => "/admin/dashboard/stats",
      transformResponse: (res: any) => res.data,
    }),
  }),
});

/* =====================================================
   HOOK EXPORTS
===================================================== */

export const {
  // users
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useAssignUserRolesMutation,

  // user → permissions
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,

  // roles
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,

  // permissions
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,

  // dashboard
  useGetDashboardStatsQuery,
} = api;
