import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<any, void>({
      query: () => "/profile",
    }),
  }),
});

export const { useGetMyProfileQuery } = userApi;
