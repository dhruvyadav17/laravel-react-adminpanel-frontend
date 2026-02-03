import { api } from "./api";
import type { AuditLog } from "@/types/audit";
import type { PaginationMeta } from "@/types/pagination";

export const auditApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<
      { data: AuditLog[]; meta: PaginationMeta },
      { page?: number; action?: string }
    >({
      query: (params) => ({
        url: "/admin/audit-logs",
        params,
      }),
      transformResponse: (res: any) => ({
        data: res.data ?? [],
        meta: res.meta,
      }),
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
