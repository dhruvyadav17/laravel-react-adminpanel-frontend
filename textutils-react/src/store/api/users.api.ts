import { baseApi } from "./baseApi";

/* ======================================================
   TYPES
====================================================== */

export type User = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  deleted_at?: string | null;
};

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
   API
====================================================== */

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= LIST ================= */

    getUsers: builder.query<
      PaginatedResponse<User>,
      { search?: string; page?: number }
    >({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),

      // ✅ unwrap Laravel ApiResponse
      transformResponse: (res: any) => ({
        data: res.data ?? [],
        meta: res.meta,
      }),

      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    /* ================= CREATE ================= */

    createUser: builder.mutation<User, Partial<User> & { password: string }>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    /* ================= UPDATE ================= */

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

    /* ================= DELETE ================= */

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    /* ================= RESTORE ================= */

    restoreUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    /* ================= ROLES ================= */

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

    /* ================= PERMISSIONS ================= */

    getUserPermissions: builder.query<
      { permissions: { id: number; name: string }[]; assigned: string[] },
      number
    >({
      query: (id) => `/admin/users/${id}/permissions`,

      // 🔥 MOST IMPORTANT FIX
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
} = usersApi;
