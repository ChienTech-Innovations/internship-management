import { Skill } from "@/types/skill.type";
import { Task } from "@/types/task.type";
export type AssignmentStatus = "Todo" | "InProgress" | "Submitted" | "Reviewed";

export type Username = {
  username: string;
  fullName: string;
};

export type Assignment = {
  id: string;
  planId: string;
  task: Task;
  estimatedTime: number;
  status: AssignmentStatus;
  submittedLink?: string | null;
  submittedAt?: string | null;
  feedback?: string | null;
  skills: {
    id: string;
    skill: Skill;
  }[];
  assignedTo?: string | null;
  assignee?: Username;
  creator?: Username;
  createdBy: string;
};

export type TrainingPlan = {
  id: string;
  name: string;
  description?: string | null;
  creator?: { fullName: string };
  isPublic: boolean;
  extra?: string | null;
  createdBy: string;
  skills: {
    id: string;
    planId: string;
    skillId: string;
    skill: Skill;
  }[];
  assignments?: Assignment[];
};

export type AssignmentRequestPayload = {
  skillIds: string[];
  taskId: string;
  estimatedTime: number;
  assignedTo?: string;
  dueDate?: string;
  submittedLink?: string;
  feedback?: string;
  status: string;
};

export type TrainingPlanRequestPayload = {
  name: string;
  description: string;
  extra: string;
  skills: string[];
  isPublic: boolean;
  assignments: AssignmentRequestPayload[];
};
