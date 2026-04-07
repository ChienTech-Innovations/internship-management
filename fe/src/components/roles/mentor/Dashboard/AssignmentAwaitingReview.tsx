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
import { Assignment } from "@/types/trainingPlan.type";
import { Clock, Loader2 } from "lucide-react";
import React, { useMemo } from "react";

type Props = {
  assignmentsWait: Assignment[];
  handleView: (a: Assignment) => void;
};

const AssignmentAwaitingReview = ({ assignmentsWait, handleView }: Props) => {
  // Only show assignments with status "Submitted"
  const submittedAssignments = useMemo(
    () => assignmentsWait.filter((a) => a.status === "Submitted"),
    [assignmentsWait]
  );

  const { displayedItems, hasMore, isLoadingMore, scrollContainerRef } =
    useInfiniteScroll(submittedAssignments, { pageSize: 4, threshold: 100 });

  return (
    <Card className="w-full sm:w-2/3 rounded-xl md:min-h-[500px] flex flex-col relative overflow-hidden border-slate-200/80">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Assignment Awaiting Review
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
            {displayedItems.map((assignment) => (
              <Card
                key={assignment.id}
                className="rounded-xl border-l-4 border-l-orange-400 hover:shadow-md transition-all duration-200 border-slate-200/80"
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">
                      {assignment?.task?.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-300 px-2 py-0.5"
                      >
                        {assignment?.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(assignment)}
                          className="flex-1 bg-blue-500 hover:to-cyan-600 text-white border-0 rounded-lg"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <CardDescription className="text-sm text-gray-600 font-semibold">
                    Description:{" "}
                    <span>
                      {assignment?.task?.description ??
                        "No description available"}
                    </span>
                  </CardDescription>
                  <div className="flex flex-wrap gap-1.5 text-sm text-gray-600 font-semibold">
                    Skills:{" "}
                    {assignment.skills.map((s) => (
                      <Badge
                        key={s.id}
                        variant="secondary"
                        className="text-xs rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200/50"
                      >
                        {s.skill.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex gap-1.5 text-sm text-gray-600 font-semibold items-center">
                      <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                        <Clock size={14} className="text-blue-600" />
                      </div>
                      {assignment.estimatedTime} hours
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {isLoadingMore && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
          </>
        ) : (
          <div className="md:pt-36 text-center text-gray-600">
            No assignments submitted yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentAwaitingReview;
