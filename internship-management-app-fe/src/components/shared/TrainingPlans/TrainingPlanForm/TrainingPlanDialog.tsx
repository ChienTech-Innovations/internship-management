"use client";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import { Button } from "@/components/ui/button";
import { DIALOG_MODES, DialogMode } from "@/constants";
import {
  TrainingPlan,
  TrainingPlanRequestPayload
} from "@/types/trainingPlan.type";
import { Skill } from "@/types/skill.type";
import { Task } from "@/types/task.type";
import TrainingPlanForm from "./TrainingPlanForm";

interface Props {
  dialogMode: DialogMode;
  selectedPlan: TrainingPlan | null;
  onClose: () => void;
  onDelete: (planId: string) => void;
  onSubmit: (data: TrainingPlanRequestPayload) => void;
  skills: Skill[];
  tasks: Task[];
  isSubmitting: boolean;
}

export default function TrainingPlanDialog({
  dialogMode,
  selectedPlan,
  onClose,
  onDelete,
  onSubmit,
  skills,
  tasks,
  isSubmitting
}: Props) {
  const isCreate = dialogMode === DIALOG_MODES.CREATE;
  const isEdit = dialogMode === DIALOG_MODES.EDIT;
  const isDelete = dialogMode === DIALOG_MODES.DELETE;

  return (
    <>
      {/* CREATE */}
      {isCreate && (
        <DialogWrapper isOpen onClose={onClose} title="Create Training Plan">
          <TrainingPlanForm
            onClose={onClose}
            onSubmit={onSubmit}
            initialData={undefined}
            skills={skills}
            tasks={tasks}
            isSubmitting={isSubmitting}
            mode={"create"}
          />
        </DialogWrapper>
      )}

      {/* EDIT */}
      {isEdit && (
        <DialogWrapper isOpen onClose={onClose} title="Edit Training Plan">
          <TrainingPlanForm
            onClose={onClose}
            onSubmit={onSubmit}
            initialData={selectedPlan || undefined}
            skills={skills}
            tasks={tasks}
            isSubmitting={isSubmitting}
            mode={"edit"}
          />
        </DialogWrapper>
      )}

      {/* DELETE */}
      {isDelete && (
        <DialogWrapper isOpen onClose={onClose} title="Confirm Delete">
          <p>Are you sure you want to delete training plan</p>
          <b>{selectedPlan?.name}</b>?
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedPlan && onDelete(selectedPlan.id)}
            >
              Delete
            </Button>
          </div>
        </DialogWrapper>
      )}
    </>
  );
}
