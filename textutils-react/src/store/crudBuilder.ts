import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/* ======================================================
   SHARED TYPES
====================================================== */

export type PaginatedMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedMeta;
};

type QueryParams = {
  search?: string;
  page?: number;
};

/* ======================================================
   GENERIC CRUD BUILDER
====================================================== */

export function createCrudEndpoints<
  T,
  Tag extends string
>(
  builder: EndpointBuilder<any, Tag, any>,
  resource: string,
  tag: Tag,
  isPaginated: boolean = true
) {
  const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  const singular = (value: string) =>
    capitalize(value.endsWith("s") ? value.slice(0, -1) : value);

  const capitalized = capitalize(resource);
  const singularName = singular(resource);

  return {
    /* ================= GET ================= */

    [`get${capitalized}`]: builder.query<
      PaginatedResponse<T> | T[],
      QueryParams | void
    >({
      query: (params) => ({
        url: `/admin/${resource}`,
        params,
      }),
      transformResponse: (res: any) =>
        isPaginated
          ? {
              data: res.data ?? [],
              meta: res.meta,
            }
          : res.data ?? [],
      providesTags: [{ type: tag, id: "LIST" }],
    }),

    /* ================= CREATE ================= */

    [`create${singularName}`]: builder.mutation<T, Partial<T>>({
      query: (body) => ({
        url: `/admin/${resource}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: tag, id: "LIST" }],
    }),

    /* ================= UPDATE ================= */
    // ✅ Backward compatible — no nested { data }

    [`update${singularName}`]: builder.mutation<
      T,
      { id: number } & Partial<T>
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/${resource}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: tag, id: "LIST" }],
    }),

    /* ================= DELETE ================= */

    [`delete${singularName}`]: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/${resource}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tag, id: "LIST" }],
    }),
  };
}
