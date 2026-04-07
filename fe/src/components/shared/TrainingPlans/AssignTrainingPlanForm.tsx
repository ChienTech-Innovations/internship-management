"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { User } from "@/types/user.type";
import { Card } from "@/components/ui/card";
import { TrainingPlan } from "@/types/trainingPlan.type";
import { trainingPlanServices } from "@/services/trainingPlan.services";
import { useToastStore } from "@/store/useToastStore";

interface Props {
  interns: User[];
  plans: TrainingPlan[];
  onAssigned?: () => void;
}

export function AssignTrainingPlanForm({ interns, plans, onAssigned }: Props) {
  const [internId, setInternId] = useState("");
  const [planId, setPlanId] = useState("");
  const { showToastSuccess, showToastError } = useToastStore();

  const unassignedInterns = interns.filter((i) => !i.internInformation?.planId);

  const handleAssign = async () => {
    if (internId && planId) {
      try {
        await trainingPlanServices.trainingPlanAssign(planId, internId);
        showToastSuccess("Training plan assigned successfully");
        setInternId("");
        setPlanId("");
        onAssigned?.();
      } catch (error) {
        console.error("Failed to assign training plan", error);
        showToastError("Failed to assign training plan");
      }
    }
  };

  return (
    <Card className="space-y-4 p-4 mt-4 min-h-[230px] overflow-y-auto ">
      <div>
        <label className="text-sm font-medium">
          Select an unassigned intern
        </label>
        <Select value={internId} onValueChange={setInternId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose intern" />
          </SelectTrigger>
          <SelectContent>
            {unassignedInterns.length > 0 ? (
              unassignedInterns.map((intern) => (
                <SelectItem key={intern.id} value={intern.id}>
                  {intern.fullName} ({intern.email}) ({intern.internInformation?.field})
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="none">
                All interns are already assigned
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Select a training plan</label>
        <Select value={planId} onValueChange={setPlanId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose plan" />
          </SelectTrigger>
          <SelectContent>
            {plans.length > 0 ? (
              plans.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="none">
                No plans available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleAssign} disabled={!internId || !planId}>
        Assign Plan
      </Button>
    </Card>
  );
}
