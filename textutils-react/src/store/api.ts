// src/store/api.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import type { User, Role, Permission } from "../types/models";
import type { PaginationMeta } from "../types/pagination";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import { buildQueryParams } from "./apiHelpers";

/* =====================================================
   API SLICE – SINGLE SOURCE OF TRUTH
===================================================== */

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Users", "Roles", "Permissions"],

  endpoints: (builder) => ({
    /* =====================================================
       USERS
    ===================================================== */

    getUsers: builder.query<
      { data: User[]; meta: PaginationMeta },
      { page?: number; search?: string } | void
    >({
      query: (params) =>
        `/admin/users${buildQueryParams(params)}`,

      // 🔥 BACKEND → FRONTEND CONTRACT
      transformResponse: (res: any) => ({
        data: res.data ?? [],
        meta: res.meta,
      }),

      providesTags: (res) =>
        res?.data
          ? [
              ...res.data.map((u: User) => ({
                type: "Users" as const,
                id: u.id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    createUser: builder.mutation<any, Partial<User>>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    restoreUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
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
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    /* =====================================================
       USER → PERMISSIONS
    ===================================================== */

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

    /* =====================================================
       ROLES
    ===================================================== */

    getRoles: builder.query<Role[], void>({
      query: () => "/admin/roles",
      transformResponse: (res: any) => res.data ?? [],
      providesTags: (res) =>
        res
          ? [
              ...res.map((r: Role) => ({
                type: "Roles" as const,
                id: r.id,
              })),
              { type: "Roles", id: "LIST" },
            ]
          : [{ type: "Roles", id: "LIST" }],
    }),

    createRole: builder.mutation<any, { name: string }>({
      query: (body) => ({
        url: "/admin/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    updateRole: builder.mutation<any, { id: number; name: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/roles/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Roles", id },
        { type: "Roles", id: "LIST" },
      ],
    }),

    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    /* =====================================================
       ROLE → PERMISSIONS
    ===================================================== */

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

    /* =====================================================
       PERMISSIONS (MASTER)
    ===================================================== */

    getPermissions: builder.query<Permission[], void>({
      query: () => "/admin/permissions",
      transformResponse: (res: any) => res.data ?? [],
      providesTags: (res) =>
        res
          ? [
              ...res.map((p: Permission) => ({
                type: "Permissions" as const,
                id: p.id,
              })),
              { type: "Permissions", id: "LIST" },
            ]
          : [{ type: "Permissions", id: "LIST" }],
    }),

    createPermission: builder.mutation<any, { name: string }>({
      query: (body) => ({
        url: "/admin/permissions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Permissions", id: "LIST" }],
    }),

    updatePermission: builder.mutation<any, { id: number; name: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/permissions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Permissions", id: "LIST" }],
    }),

    deletePermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Permissions", id: "LIST" }],
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
   AUTO-GENERATED HOOK EXPORTS (🔥 COMPLETE)
===================================================== */

export const {
  // USERS
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useAssignUserRolesMutation,

  // USER → PERMISSIONS
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,

  // ROLES
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,

  // ROLE → PERMISSIONS (🔥 CRASH FIXED)
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,

  // PERMISSIONS
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,

  // DASHBOARD
  useGetDashboardStatsQuery,
} = api;
