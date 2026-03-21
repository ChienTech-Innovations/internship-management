"use client";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { SkillRequestPayload } from "@/types/skill.type";

interface SkillFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isEditing: boolean;
  onSubmit: (payload: SkillRequestPayload) => void;
}

export const SkillForm = ({
  isOpen,
  onClose,
  title,
  description,
  isEditing,
  onSubmit
}: SkillFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useFormContext<SkillRequestPayload>();

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
            Skill Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name", { required: "Skill name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            id="description"
            rows={3}
            {...register("description")}
            placeholder="Enter description (optional)"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Skill" : "Create Skill"}
          </Button>
        </div>
      </form>
    </DialogWrapper>
  );
};
