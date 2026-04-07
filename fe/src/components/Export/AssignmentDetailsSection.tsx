import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusColor } from "@/lib/helper";
import { InternInfoDetail } from "@/types/intern.type";
import { Assignment } from "@/types/trainingPlan.type";
import { Clock, Target } from "lucide-react";

export default function AssignmentDetailsSection({
  infoInternExport
}: {
  infoInternExport: InternInfoDetail | undefined;
}) {
  const assignmentGrouped: Record<string, Assignment[]> = {
    Reviewed: [],
    Submitted: [],
    InProgress: [],
    Todo: []
  };

  infoInternExport?.plan.assignments.map((assignment) => {
    if (assignment.status in assignmentGrouped) {
      assignmentGrouped[assignment.status].push(assignment);
    }
  });

  const statusOrder: (keyof typeof assignmentGrouped)[] = [
    "Reviewed",
    "Submitted",
    "InProgress",
    "Todo"
  ];

  return (
    <Card className="page-break rounded-md">
      <CardHeader className="bg-indigo-50 p-3">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Target className="h-6 w-6 text-indigo-600" />
          <span>Assignment Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {statusOrder.map((status) => {
            const assignments = assignmentGrouped[status];
            if (assignments.length === 0) return null;
            return (
              <div key={status} className="mb-8">
                {assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 avoid-break mb-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-md font-semibold text-gray-900 flex items-center line-clamp-1">
                          <span>{assignment.task.name}</span>
                        </h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          {assignment.estimatedTime && (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {assignment.estimatedTime}h estimated
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    {assignment.submittedLink && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <label className="text-sm font-medium text-gray-500">
                          Submitted Work
                        </label>
                        <p className="text-blue-600 text-sm break-all">
                          {assignment.submittedLink}
                        </p>
                      </div>
                    )}

                    {assignment.feedback && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <label className="text-sm font-medium text-yellow-800">
                          Mentor Feedback
                        </label>
                        <p className="text-yellow-700 text-sm mt-1 leading-relaxed">
                          {assignment.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
