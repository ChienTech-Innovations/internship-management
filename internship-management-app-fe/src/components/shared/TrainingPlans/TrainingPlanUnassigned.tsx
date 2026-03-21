"use client";

import React, { useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

import { useAuthStore } from "@/store/useAuthStore";
import { TrainingPlan } from "@/types/trainingPlan.type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

type Props = {
  filteredPlans: TrainingPlan[];
  onView?: (plan: TrainingPlan) => void;
  onEdit?: (plan: TrainingPlan) => void;
  onDelete?: (planId: string) => void;
};

const TrainingPlanUnassigned = ({
  filteredPlans,
  onView,
  onEdit,
  onDelete
}: Props) => {
  const [selectedTrainingPlan, setSelectedTrainingPlan] =
    useState<TrainingPlan | null>(null);

  const { userDetails } = useAuthStore();

  return (
    <div className="h-[700px] overflow-y-auto space-y-4 pr-1">
      {filteredPlans.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-10">
          No plans have been created yet
        </p>
      )}

      {filteredPlans.map((plan) => (
        <Card
          key={plan.id}
          className="rounded-xl hover:shadow-md transition-shadow"
        >
          {/* HEADER */}
          <CardHeader className="pb-2 space-y-1">
            {/* NAME */}
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <CardTitle className="text-base font-semibold truncate cursor-default">
                    {plan.name}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent className="max-w-[400px]">
                  {plan.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* DESCRIPTION */}
            <CardDescription className="text-sm line-clamp-1">
              {plan.description || "No description provided"}
            </CardDescription>

            {/* SKILLS META */}
            {plan.skills.length > 0 && (
              <div className="pt-1">
                <TooltipProvider>
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                      <span className="inline-flex w-fit">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 cursor-pointer"
                        >
                          {plan.skills.length} skills
                        </Badge>
                      </span>
                    </TooltipTrigger>

                    <TooltipContent className="max-w-[320px]">
                      <div className="flex flex-wrap gap-1">
                        {plan.skills.map((s) => (
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
            {/* CREATED BY */}
            <div className="space-y-1">
              <div>
                Created by{" "}
                <span className="font-medium text-gray-700">
                  {plan.creator?.fullName ?? "Unknown"}
                </span>
              </div>

              <div className="text-muted-foreground">
                Assigned to: <span>Not assigned yet</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onView?.(plan)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>

              {userDetails?.role !== "admin" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(plan)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={() => setSelectedTrainingPlan(plan)}
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
};

export default TrainingPlanUnassigned;
