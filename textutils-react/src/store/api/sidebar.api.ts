import { baseApi } from "./baseApi";

export const sidebarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSidebar: builder.query<any[], void>({
      query: () => "/admin/sidebar",
      transformResponse: (res: any) => res.data ?? [],
      providesTags: ["Sidebar"],
    }),
  }),
});

export const { useGetSidebarQuery } = sidebarApi;
