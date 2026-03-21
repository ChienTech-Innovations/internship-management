import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { InternInfoDetail } from "@/types/intern.type";
import React from "react";

type Props = {
  internInfo?: InternInfoDetail;
};

const TrainingPlanIntern = ({ internInfo }: Props) => {
  return (
    <Card className="rounded-xl min-h-[200px] flex flex-col justify-between relative overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200/80">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-xl" />

      <CardHeader className="space-y-1 pl-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {internInfo?.plan?.name || "No training plan"}
          </CardTitle>
          {internInfo?.plan ? (
            <Badge
              variant="outline"
              className="text-xs bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 px-2.5 py-0.5"
            >
              {internInfo?.plan?.skills.length} skills
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm font-semibold text-gray-600 pl-5">
        {internInfo?.plan ? (
          <>
            <CardDescription>
              Description:{" "}
              <span>
                {internInfo?.plan.description || "No description provided"}
              </span>
            </CardDescription>
            <div className="flex flex-wrap gap-1.5 text-gray-500">
              Skills:{" "}
              {internInfo?.plan.skills.map((s) => (
                <Badge
                  key={s.id}
                  variant="secondary"
                  className="text-xs rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200/50"
                >
                  {s.skill.name}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-gray-500 flex justify-between">
              <span>Created by: {internInfo?.mentor?.username}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center mb-14 text-gray-400">
            No training plan available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingPlanIntern;
