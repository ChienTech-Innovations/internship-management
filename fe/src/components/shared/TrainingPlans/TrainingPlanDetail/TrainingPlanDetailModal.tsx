"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Assignment, TrainingPlan } from "@/types/trainingPlan.type";
import { useMemo, useState } from "react";
import { AssignmentDetailModal } from "@/components/shared/TrainingPlans/AssignmentDetail/AssignmentDetailModal";
import { useAuthStore } from "@/store/useAuthStore";
import { assignmentServices } from "@/services/assignment.services";
import { getStatusColor } from "@/lib/helper";
import { CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TrainingPlanDetailModalProps {
  open: boolean;
  onClose: () => void;
  plan: TrainingPlan | null;
  sourceType?: "assigned" | "unassigned";
}

export function TrainingPlanDetailModal({
  open,
  onClose,
  plan,
  sourceType
}: TrainingPlanDetailModalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { userDetails } = useAuthStore();
  const assignments = useMemo(() => plan?.assignments ?? [], [plan]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [assignmentsState, setAssignmentsState] = useState(assignments);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [detailAssignment, setDetailAssignment] = useState<Assignment | null>(
    null
  );

  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "Reviewed").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (!plan) return null;

  const handleView = (a: Assignment) => {
    setAssignment(a);
    setModalOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-screen ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📚 Training Plan Detail
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm text-gray-700">
          {/* Plan Summary */}
          <section className="border rounded p-4 bg-amber-50 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg mb-1">{plan.name}</h2>
                <p className="text-gray-500 text-sm">
                  {plan.description || "No description provided."}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-blue-100 text-blue-700"
              >
                {plan.skills.length} skill{plan.skills.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <div>
                <strong>Visibility:</strong>{" "}
                {plan.isPublic ? "Public" : "Private"}
              </div>
              {plan.extra && (
                <div>
                  <strong>Extra:</strong> {plan.extra}
                </div>
              )}
            </div>
          </section>

          {/* Progress */}
          <section className="border rounded p-4 bg-white shadow-sm">
            <div className="font-semibold text-sm mb-2">
              Progress: {completed}/{total} assignments completed
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </section>

          {/* Assignments */}
          <section className="border rounded p-4 bg-white shadow-sm md:w-h-[450px] md:overflow-y-scroll">
            <div className="font-semibold mb-3 text-sm">Assignments</div>
            {assignments.length === 0 ? (
              <div className="text-xs text-gray-400">
                No assignments available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[200px]">
                {assignments.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded space-y-2 text-xs bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-700 line-clamp-1">
                        {a.task.name || "Untitled Assignment"}
                      </span>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] bg-white ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {a.status}
                        </Badge>
                        {sourceType === "unassigned" ? (
                          ""
                        ) : (
                          <Button
                            variant="outline"
                            className="w-10 h-6 text-[10px]"
                            onClick={() => {
                              handleView(a);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      <CardDescription>
                        Description: {a.task.description || "-"}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 font-semibold text-sm text-gray-500">
                      Skills:{" "}
                      {a.skills.map((skillItem) => (
                        <Badge
                          key={skillItem.id}
                          className="rounded-md text-xs bg-blue-100 text-blue-800 p-1"
                        >
                          {skillItem.skill.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2git font-semibold text-sm text-gray-500">
                      <Clock size={16} className="mr-2" /> {a.estimatedTime}{" "}
                      hours
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
      <AssignmentDetailModal
        assignment={assignment}
        role={userDetails?.role ?? ""}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onFeedbackSubmit={async (newFeedback) => {
          if (!assignment) return;
          try {
            await assignmentServices.assignmentReview(assignment.id, {
              feedback: newFeedback
            });
            setAssignmentsState((prev) =>
              prev.map((asg) =>
                asg.id === assignment?.id
                  ? { ...asg, feedback: newFeedback }
                  : asg
              )
            );
            setDetailAssignment({ ...assignment!, feedback: newFeedback });
          } catch (error) {
            console.error("Status update failed", error);
          }
        }}
      />
    </Dialog>
  );
}
