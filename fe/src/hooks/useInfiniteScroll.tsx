import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface UseInfiniteScrollOptions {
  pageSize?: number;
  threshold?: number; // px from bottom to trigger load more
}

export function useInfiniteScroll<T>(
  data: T[],
  options: UseInfiniteScrollOptions = {}
) {
  const { pageSize = 5, threshold = 100 } = options;
  const [displayCount, setDisplayCount] = useState(pageSize);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayedItems = useMemo(
    () => data.slice(0, displayCount),
    [data, displayCount]
  );

  const hasMore = displayCount < data.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    // Small delay for smooth UX
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + pageSize, data.length));
      setIsLoadingMore(false);
    }, 300);
  }, [hasMore, isLoadingMore, pageSize, data.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadMore, threshold]);

  // Reset display count when data changes
  useEffect(() => {
    setDisplayCount(pageSize);
  }, [data.length, pageSize]);

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    scrollContainerRef,
    loadMore
  };
}
