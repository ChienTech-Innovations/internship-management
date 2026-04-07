import { InternStatus } from "@/types/intern.type";
import { TrainingPlan } from "@/types/trainingPlan.type";

export type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  dob?: string;
  address?: string;
  role: string;
  status: string;
  isAssigned?: boolean;
  internInformation?: internProfile;
};

export type internProfile = {
  id: string;
  field: string;
  internId: string;
  mentorId?: string | null;
  planId?: string | null;
  startDate: string;
  endDate: string;
  status?: InternStatus;
};

export type userRequestPayload = {
  email: string;
  username: string;
  password: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  dob?: string;
  address?: string;
  internInformation?: internProfilePayload;
};

export type internProfilePayload = {
  field: string;
  startDate: string;
  endDate: string;
};

export type TrainingPlanAssigned = {
  id: string;
  field: string;
  internId: string;
  intern: Omit<User, "internInformation">;
  mentorId: string;
  mentor: Omit<User, "internInformation">;
  planId: string;
  plan: TrainingPlan;
  startDate: string;
  endDate: string;
  status: InternStatus;
};
