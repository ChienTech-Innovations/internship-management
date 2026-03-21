import { useState, useMemo } from "react";

export function usePagination<T>(data: T[], pageSizeDefault = 5) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSizeDefault
  });

  const pageCount = useMemo(
    () => Math.ceil(data.length / pagination.pageSize),
    [data.length, pagination.pageSize]
  );

  const paginated = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return data.slice(start, start + pagination.pageSize);
  }, [data, pagination]);

  return {
    pagination,
    setPagination,
    pageCount,
    paginated
  };
}
