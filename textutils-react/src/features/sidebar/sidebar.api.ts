import { api } from "../../store/api";

export const sidebarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSidebar: builder.query<any[], void>({
      query: () => "/admin/sidebar",
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const { useGetSidebarQuery } = sidebarApi;
