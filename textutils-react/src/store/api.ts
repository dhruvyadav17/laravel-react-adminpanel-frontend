import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

/**
 * RTK Query API
 * -------------------------------------------------
 * - Env based baseUrl (VITE_API_URL)
 * - Auth token auto attach
 * - Centralized caching via tags
 * - Production ready
 */

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

  // 🔥 TAGS (case-sensitive)
  tagTypes: ["Permissions", "Roles", "Users"],

  endpoints: (builder) => ({
    /* ================= PERMISSIONS ================= */

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

    deletePermission: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permissions"],
    }),

    /* ================= USERS ================= */

    getUsers: builder.query<
      { data: User[]; meta: any },
      { page?: number; search?: string }
    >({
      query: ({ page = 1, search = "" }) =>
        `/admin/users?page=${page}&search=${search}`,
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
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

    deleteUser: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    assignUserRoles: builder.mutation<any, { id: number; roles: string[] }>({
      query: ({ id, roles }) => ({
        url: `/admin/users/${id}/assign-role`,
        method: "POST",
        body: {
          roles, // 🔥 ONLY STRING[] (role names)
        },
      }),
      invalidatesTags: ["Users"],
    }),

    restoreUser: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/users/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    /* ================= ROLES ================= */

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

    deleteRole: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

    /* ================= ROLE → PERMISSIONS ================= */

    getRolePermissions: builder.query<
      { permissions: any[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/roles/${id}/permissions`,
      transformResponse: (res: any) => res.data,
      providesTags: ["Roles"],
    }),

    assignRolePermissions: builder.mutation<
      any,
      { id: number; permissions: string[] }
    >({
      query: ({ id, permissions }) => ({
        url: `/admin/roles/${id}/permissions`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: ["Roles"],
    }),

    /* ================= USER → PERMISSIONS ================= */

    getUserPermissions: builder.query<
      { permissions: any[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/users/${id}/permissions`,
      transformResponse: (res: any) => res.data,
      providesTags: ["Users"],
    }),

    assignUserPermissions: builder.mutation<
      any,
      { id: number; permissions: string[] }
    >({
      query: ({ id, permissions }) => ({
        url: `/admin/users/${id}/permissions`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

/* ================= HOOK EXPORTS ================= */

export const {
  // permissions
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,

  // users
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useAssignUserRolesMutation,

  useRestoreUserMutation,

  // roles
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,

  // role → permissions
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,

  // user → permissions
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,
} = api;
