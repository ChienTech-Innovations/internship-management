"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  rows?: number;
  cols?: number;
  showHeader?: boolean;
  showToolbar?: boolean;
};

export function TableSkeleton({
  rows = 5,
  cols = 5,
  showHeader = true,
  showToolbar = true,
}: TableSkeletonProps) {
  return (
    <Card>
      {showHeader && (
        <CardHeader className="space-y-4">
          {showToolbar && (
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-9 w-64 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          )}
        </CardHeader>
      )}
      <CardContent>
        <div className="rounded-md border">
          <div className="flex border-b bg-muted/30 p-3 gap-4">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1 rounded" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex border-b border-border/50 p-3 gap-4 last:border-0"
            >
              {Array.from({ length: cols }).map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  className="h-4 flex-1 rounded"
                  style={{
                    maxWidth: colIdx === 0 ? 180 : undefined,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-4 w-24 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
