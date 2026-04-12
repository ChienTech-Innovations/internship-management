import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { MyInternsResponse } from "@/types/dashboard.type";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  data?: MyInternsResponse;
};

const ListIntern = ({ data }: Props) => {
  const interns = data?.myInterns ?? [];

  const { displayedItems, isLoadingMore, scrollContainerRef } =
    useInfiniteScroll(interns, { pageSize: 5, threshold: 100 });

  return (
    <Card className="w-full sm:w-1/3 rounded-xl flex flex-col relative overflow-hidden border-slate-200/80">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            My Interns
          </h1>
          <Button
            variant="outline"
            className="w-16 h-8 text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent
        ref={scrollContainerRef}
        className="space-y-4 overflow-y-auto flex-1 max-h-[500px]"
      >
        {displayedItems.length > 0 ? (
          <>
            {displayedItems.map((intern) => (
              <Card
                key={intern.id}
                className="rounded-xl hover:shadow-md transition-all duration-200 border-slate-200/80"
              >
                <div className="p-3 flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-12 h-12 ring-2 ring-emerald-200 ring-offset-1">
                      <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700">
                        {intern?.intern?.fullName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{intern?.intern?.fullName}</CardTitle>
                      <CardDescription>{intern?.field}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs px-2.5 py-0.5 ${
                        intern?.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                          : intern?.status === "InProgress"
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "bg-orange-100 text-orange-700 border-orange-300"
                      }`}
                    >
                      {intern?.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
            {isLoadingMore && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-600 py-8">
            No interns assigned yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListIntern;
