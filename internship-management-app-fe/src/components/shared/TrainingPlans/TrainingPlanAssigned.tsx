/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { TrainingPlan } from "@/types/trainingPlan.type";
import { TrainingPlanAssigned as TrainingPlanAssignedType } from "@/types/user.type";

interface Props {
  assignedMap: TrainingPlanAssignedType[];
  onView?: (plan: TrainingPlan) => void;
  onEdit?: (plan: TrainingPlan) => void;
  onDelete?: (planId: string) => void;
}

export function TrainingPlanAssigned({
  assignedMap,
  onView,
  onEdit,
  onDelete
}: Props) {
  const [selectedTrainingPlan, setSelectedTrainingPlan] =
    useState<TrainingPlan | null>(null);

  return (
    <div className="h-[700px] overflow-y-auto space-y-4 pr-1">
      {Array.isArray(assignedMap) && assignedMap.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-10">
          No plans have been assigned yet
        </p>
      )}

      {Array.isArray(assignedMap) &&
        assignedMap.map((assigned) => (
          <Card
            key={assigned.id}
            className="rounded-xl hover:shadow-md transition-shadow"
          >
            {/* HEADER */}
            <CardHeader className="pb-2 space-y-1">
              {/* NAME */}
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <CardTitle className="text-base font-semibold truncate cursor-default">
                      {assigned.plan.name}
                    </CardTitle>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[400px]">
                    {assigned.plan.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* DESCRIPTION */}
              <CardDescription className="text-sm line-clamp-1">
                {assigned.plan.description || "No description provided"}
              </CardDescription>

              {/* SKILLS META */}
              {assigned.plan.skills.length > 0 && (
                <div className="pt-1">
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex w-fit">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 cursor-pointer"
                          >
                            {assigned.plan.skills.length} skills
                          </Badge>
                        </span>
                      </TooltipTrigger>

                      <TooltipContent className="max-w-[320px]">
                        <div className="flex flex-wrap gap-1">
                          {assigned.plan.skills.map((s: any) => (
                            <Badge
                              key={s.id}
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              {s.skill.name}
                            </Badge>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </CardHeader>

            {/* CONTENT */}
            <CardContent className="pt-2 space-y-3 text-sm text-gray-500">
              {/* META */}
              <div className="space-y-1">
                <div>
                  Created by{" "}
                  <span className="font-medium text-gray-700">
                    {assigned.mentor.fullName}
                  </span>
                </div>
                <div>
                  Assigned to{" "}
                  <span className="font-medium text-gray-700">
                    {assigned.intern.fullName}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onView?.(assigned.plan)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(assigned.plan)}
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setSelectedTrainingPlan(assigned.plan)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={!!selectedTrainingPlan}
        title="Confirm Delete"
        description={`Are you sure you want to delete "${selectedTrainingPlan?.name}"?`}
        onCancel={() => setSelectedTrainingPlan(null)}
        onConfirm={() => {
          if (onDelete && selectedTrainingPlan) {
            onDelete(selectedTrainingPlan.id);
          }
          setSelectedTrainingPlan(null);
        }}
      />
    </div>
  );
}
