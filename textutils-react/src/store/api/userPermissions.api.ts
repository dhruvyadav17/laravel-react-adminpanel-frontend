import type { Permission } from "../../types/models";
import { baseApi } from "./baseApi";

export const userPermissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetUserPermissionsQuery,
  useAssignUserPermissionsMutation,
} = userPermissionsApi;
