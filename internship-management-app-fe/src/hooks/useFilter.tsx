import { useDebounce } from "@/hooks/useDebounce";
import { useState, useMemo } from "react";

export function useFilter<T>(
  data: T[],
  searchTerm: string,
  filterFn: (item: T, search: string) => boolean
) {
  const [term, setTerm] = useState(searchTerm);
  const debouncedTerm = useDebounce(term, 500);
  const filtered = useMemo(
    () => data.filter((item) => filterFn(item, debouncedTerm)),
    [data, debouncedTerm, filterFn]
  );
  return { filtered, term, setTerm };
}
