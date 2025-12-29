import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Permissions","roles","users"],
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

    updatePermission: builder.mutation<
      any,
      { id: number; name: string }
    >({
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

getUsers: builder.query<any[], void>({
  query: () => "/admin/users",
  transformResponse: (res: any) => res.data,
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

assignUserRoles: builder.mutation<any, { id: number; roles: string[] }>({
  query: ({ id, roles }) => ({
    url: `/admin/users/${id}/assign-role`,
    method: "POST",
    body: { roles },
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
  }),
});

export const {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
    useGetUsersQuery,
  useCreateUserMutation,
  useAssignUserRolesMutation,
  useDeleteUserMutation,

  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = api;
