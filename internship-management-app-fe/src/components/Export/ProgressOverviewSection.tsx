import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

export default function ProgressOverviewSection({
  progressCounts
}: {
  progressCounts: {
    todo: number;
    inprogress: number;
    submitted: number;
    completed: number;
    total: number;
  };
}) {
  const percent = progressCounts.total
    ? Math.round((progressCounts.completed / progressCounts.total) * 100)
    : 0;
  return (
    <Card className="rounded-md mt-4">
      <CardHeader className="bg-green-50 p-3">
        <div className="flex gap-2 items-center">
          <TrendingUp className="text-green-700" />
          <span className="text-xl font-semibold">Progress Overview</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col mt-4">
          <p className="flex items-center justify-between text-gray-600">
            Overall Progress{" "}
            <span className="text-xl text-green-700 font-semibold">
              {percent}%
            </span>
          </p>
          <Progress value={percent} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 ">
          <Card className="bg-green-50 flex flex-col text-center py-4 rounded-md">
            <p className="text-green-700 font-semibold text-2xl">
              {progressCounts.completed}
            </p>
            <p className="tex-sm text-gray-600">Completed</p>
          </Card>
          <Card className="bg-yellow-50 flex flex-col text-center py-4 rounded-md">
            <p className="text-yellow-700 font-semibold text-2xl">
              {progressCounts.submitted}
            </p>
            <p className="tex-sm text-gray-600">Submitted</p>
          </Card>
          <Card className="bg-blue-50 flex flex-col text-center py-4 rounded-md">
            <p className="text-blue-700 font-semibold text-2xl">
              {progressCounts.inprogress}
            </p>
            <p className="tex-sm text-gray-600">In Progress</p>
          </Card>
          <Card className="bg-gray-50 flex flex-col text-center py-4 rounded-md">
            <p className="text-gray-700 font-semibold text-2xl">
              {progressCounts.todo}
            </p>
            <p className="tex-sm text-gray-600">Todo</p>
          </Card>
          <Card className="bg-purple-50 flex flex-col text-center py-4 rounded-md">
            <p className="text-purple-700 font-semibold text-2xl">
              {progressCounts.total}
            </p>
            <p className="tex-sm text-gray-600">Total</p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
