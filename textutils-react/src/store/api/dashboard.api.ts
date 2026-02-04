import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<
      { total_users: number },
      void
    >({
      query: () => "/admin/dashboard/stats",
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
