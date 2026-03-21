import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlarmClockOff,
  CheckCircle,
  ClipboardList,
  Loader
} from "lucide-react";
import React from "react";

type Props = {
  reviewed: number;
  totalAssignments: number;
  inProgress: number;
};

const OverAllProgress = ({ reviewed, totalAssignments, inProgress }: Props) => {
  const progressPercent = totalAssignments
    ? (reviewed / totalAssignments) * 100
    : 0;

  return (
    <Card className="rounded-xl min-h-[200px] relative overflow-hidden border-slate-200/80 hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Overall Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Assignments Completed</span>
            <span className="font-bold text-blue-600">
              {reviewed}/{totalAssignments}
            </span>
          </div>
          <div className="relative">
            <Progress value={progressPercent} className="h-2.5 bg-slate-100" />
          </div>
          <p className="text-xs text-gray-500">
            {Math.round(progressPercent)}% of your training program completed
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-3 text-center border border-orange-200/50 hover:shadow-md transition-all duration-200">
            <div className="w-8 h-8 rounded-lg bg-orange-200/50 flex items-center justify-center mx-auto mb-1.5">
              <ClipboardList className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-700">
              {totalAssignments}
            </div>
            <p className="text-xs text-gray-600">Assignments</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 text-center border border-blue-200/50 hover:shadow-md transition-all duration-200">
            <div className="w-8 h-8 rounded-lg bg-blue-200/50 flex items-center justify-center mx-auto mb-1.5">
              <Loader className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{inProgress}</div>
            <p className="text-xs text-gray-600">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-3 text-center border border-red-200/50 hover:shadow-md transition-all duration-200">
            <div className="w-8 h-8 rounded-lg bg-red-200/50 flex items-center justify-center mx-auto mb-1.5">
              <AlarmClockOff className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-700">0</div>
            <p className="text-xs text-gray-600">Overdue</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 text-center border border-green-200/50 hover:shadow-md transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-green-200/50 flex items-center justify-center mx-auto mb-1.5">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-700">{reviewed}</div>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverAllProgress;
