import { baseApi } from "./baseApi";
import type { User } from "@/types/models";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string; force_password_reset: boolean },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    profile: builder.query<
      { user: User; permissions: string[]; force_password_reset: boolean },
      void
    >({
      query: () => "/profile",
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useProfileQuery,
  useLogoutMutation,
} = authApi;
