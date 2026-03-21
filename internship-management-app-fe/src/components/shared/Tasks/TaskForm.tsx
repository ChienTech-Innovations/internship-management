"use client";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { TaskRequestPayload } from "@/types/task.type";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isEditing: boolean;
  onSubmit: (data: TaskRequestPayload) => void;
}

export const TaskForm = ({
  isOpen,
  onClose,
  title,
  description,
  isEditing,
  onSubmit
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useFormContext<TaskRequestPayload>();

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>
            Task Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label>Description</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </DialogWrapper>
  );
};
