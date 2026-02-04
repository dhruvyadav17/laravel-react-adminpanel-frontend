type QueryParams = Record<string, any>;

export function buildQueryParams(params?: QueryParams) {
  if (!params) return "";

  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    )
    .join("&");

  return query ? `?${query}` : "";
}

/* standard Laravel API response */
export function extractData<T = any>(res: any): T {
  return res.data;
}
