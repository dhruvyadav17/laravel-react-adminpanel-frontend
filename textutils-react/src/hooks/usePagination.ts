// src/hooks/usePagination.ts

import { useState } from "react";

type Options = {
  initialPage?: number;
  initialSearch?: string;
};

export function usePagination(options: Options = {}) {
  const [page, setPage] = useState(
    options.initialPage ?? 1
  );
  const [search, setSearch] = useState(
    options.initialSearch ?? ""
  );

  /* ================= SEARCH ================= */
  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // 🔥 reset page on search
  };

  return {
    page,
    setPage,

    search,
    setSearch: onSearchChange,
  };
}
