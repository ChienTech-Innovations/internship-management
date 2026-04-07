"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AssignmentBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, colIdx) => (
        <Card key={colIdx} className="flex flex-col">
          <CardHeader className="py-3">
            <Skeleton className="h-5 w-24 rounded" />
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
