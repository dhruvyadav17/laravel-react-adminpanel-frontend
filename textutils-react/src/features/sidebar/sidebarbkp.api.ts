// src/features/sidebar/sidebar.api.ts
import { api } from "../../store/api";
import type { SidebarGroup } from "../../types/sidebar";

export const sidebarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSidebar: builder.query<SidebarGroup[], void>({
      query: () => "/admin/sidebar",
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const { useGetSidebarQuery } = sidebarApi;
