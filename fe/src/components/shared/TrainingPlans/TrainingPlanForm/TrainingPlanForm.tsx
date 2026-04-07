"use client";

import { useEffect, useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Assignment,
  TrainingPlan,
  TrainingPlanRequestPayload
} from "@/types/trainingPlan.type";
import type { Skill } from "@/types/skill.type";
import { Task } from "@/types/task.type";
import { useToastStore } from "@/store/useToastStore";
import { Clock } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import "./style.css";

interface Props {
  onClose: () => void;
  onSubmit: (data: TrainingPlanRequestPayload) => void;
  initialData?: TrainingPlan;
  skills: Skill[];
  tasks: Task[];
  isSubmitting: boolean;
  mode: string;
}

export default function TrainingPlanForm({
  onClose,
  onSubmit,
  initialData,
  skills,
  tasks,
  isSubmitting,
  mode
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [extra, setExtra] = useState("");
  const [skill, setSkill] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [assignmentSkillIds, setAssignmentSkillIds] = useState<string[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [newAssignment, setNewAssignment] = useState<Assignment>({
    id: "",
    task: { id: "", name: "", description: "", createdBy: "" },
    estimatedTime: 0,
    status: "Todo",
    submittedLink: null,
    feedback: null,
    skills: [],
    planId: "",
    assignedTo: null,
    createdBy: ""
  });
  const { showToastSuccess, showToastError } = useToastStore();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description ?? "");
      setExtra(initialData.extra ?? "");
      setIsPublic(initialData.isPublic);
      setSkill(initialData.skills.map((s) => s.skill.id));
      setAssignments(initialData.assignments || []);
    } else {
      resetForm();
    }
    setShowForm(false);
  }, [initialData]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setExtra("");
    setSkill([]);
    setIsPublic(false);
    setAssignments([]);
    setShowForm(false);
    setAssignmentSkillIds([]);
    setEditingIdx(null);
  };

  const handleSkillToggle = (id: string) => {
    setSkill((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAssignmentSkillToggle = (id: string) => {
    setAssignmentSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAddAssignment = () => {
    setShowForm(true);
    setNewAssignment({
      id: "",
      task: { id: "", name: "", description: "", createdBy: "" },
      estimatedTime: 0,
      status: "Todo",
      submittedLink: null,
      feedback: null,
      skills: [],
      planId: "",
      assignedTo: null,
      createdBy: ""
    });
    setAssignmentSkillIds([]);
  };

  const handleEditAssignment = async (idx: number) => {
    setEditingIdx(idx);
    setShowForm(true);
    const assignment = assignments[idx];
    setNewAssignment(assignment);
    setAssignmentSkillIds(assignment.skills.map((s) => s.skill.id));
  };

  const handleDeleteAssignment = async (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveAssignment = () => {
    if (!newAssignment.task?.id) {
      setError("Please select a task before saving.");
      return;
    }
    setError("");
    if (editingIdx !== null) {
      setAssignments((prev) =>
        prev.map((item, idx) =>
          idx === editingIdx
            ? {
                ...newAssignment,
                skills: skills
                  .filter((s) => assignmentSkillIds.includes(s.id))
                  .map((s) => ({ id: s.id, skill: s }))
              }
            : item
        )
      );
      setEditingIdx(null);
    } else {
      setAssignments((prev) => [
        ...prev,
        {
          ...newAssignment,
          skills: skills
            .filter((s) => assignmentSkillIds.includes(s.id))
            .map((s) => ({ id: s.id, skill: s }))
        }
      ]);
    }
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: TrainingPlanRequestPayload = {
      name,
      description,
      extra,
      isPublic,
      skills: skill,
      assignments: assignments.map((assignment) => ({
        taskId: assignment.task.id,
        estimatedTime: assignment.estimatedTime,
        skillIds: assignment.skills.map((s) => s.skill.id),
        status: assignment.status
      }))
    };
    try {
      await onSubmit(payload);
      showToastSuccess(
        initialData
          ? "Training plan updated successfully"
          : "Training plan created successfully"
      );
    } catch (error) {
      console.error(error);
      showToastError("Failed to save training plan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="overflow-y-auto space-y-4 max-h-[70vh] thin-scrollbar">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter training plan name"
            required
            disabled={mode === "edit"}
          />
        </div>

        {mode === "create" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Information
              </label>
              <Textarea
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Enter extra information"
                rows={2}
              />
            </div>
          </>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded"
          />
          <label
            htmlFor="isPublic"
            className="text-sm font-medium text-gray-700"
          >
            Make this plan public
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((s) => (
              <label key={s.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={skill.includes(s.id)}
                  onChange={() => handleSkillToggle(s.id)}
                  className="rounded"
                />
                <span className="text-sm">{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Assignments
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAssignment}
            >
              Add Assignment
            </Button>
          </div>

          <div className="space-y-2 max-h-[250px] overflow-y-scroll">
            {assignments.map((assignment, idx) => (
              <div
                key={idx}
                className="border rounded p-3 bg-gray-50 text-xs space-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <strong>{assignment.task.name}</strong>
                    <CardDescription className="text-sm font-semibold">
                      Description:{" "}
                      {assignment.task.description ?? "No description"}
                    </CardDescription>
                    <div className="text-sm font-semibold text-gray-500">
                      Skills:{" "}
                      {assignment.skills.map((skillItem) => (
                        <span
                          key={skillItem.id}
                          className="mr-1 text-xs bg-blue-100 text-blue-800 p-1"
                        >
                          {skillItem.skill.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <Clock size={16} /> {assignment.estimatedTime} hours
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAssignment(idx)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAssignment(assignment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {showForm && (
              <div className="border rounded p-3 bg-white mt-2 text-xs space-y-2">
                <select
                  value={newAssignment.task.id}
                  onChange={(e) => {
                    const selected = tasks.find((t) => t.id === e.target.value);
                    if (selected)
                      setNewAssignment((prev) => ({
                        ...prev,
                        task: selected
                      }));
                  }}
                  className="border rounded-md p-2 w-full"
                >
                  <option value="">Select Task</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {error && (
                  <p className="text-red-500 text-xs mt-1">
                    {error}{" "}
                    {tasks.length === 0 && (
                      <>
                        If no tasks available,{" "}
                        <Link
                          href="/skills"
                          className="underline text-blue-600 hover:text-blue-800"
                        >
                          go to create
                        </Link>
                      </>
                    )}
                  </p>
                )}

                <div>
                  <label className="font-medium text-sm">Skills</label>
                  {skills.filter((s) => skill.includes(s.id)).length === 0 ? (
                    <p className="text-sm text-gray-500 ">No skill selected</p>
                  ) : (
                    skills
                      .filter((s) => skill.includes(s.id))
                      .map((s) => (
                        <label key={s.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={assignmentSkillIds.includes(s.id)}
                            onChange={() => handleAssignmentSkillToggle(s.id)}
                          />
                          {s.name}
                        </label>
                      ))
                  )}
                </div>

                <Label>Estimate time: </Label>
                <Input
                  type="number"
                  placeholder="Estimated Days"
                  value={newAssignment.estimatedTime}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      estimatedTime: +e.target.value
                    }))
                  }
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveAssignment}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => (resetForm(), onClose())}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );
}
