import { Skill } from "@/types/skill.type";
import { Assignment } from "@/types/trainingPlan.type";
import { internProfile, User } from "@/types/user.type";

export type InternStatus =
  | "Onboarding"
  | "InProgress"
  | "Completed"
  | "Dropped";

export type InternInformation = {
  id: string;
  internId: string;
  mentorId?: string | null;
  planId?: string | null;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string | null;
  dob?: string | null;
  address?: string | null;
  internInformation: internProfile;
  status: InternStatus;
};

export type InternInfoRequestPayload = {
  field: string;
  internId: string;
  startDate: string;
  endDate: string;
};

export type InternInfoDetail = {
  id: string;
  field: string;
  internId: string;
  intern?: User;
  mentorId: string;
  mentor: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    phoneNumber?: string;
    dob?: string;
    address?: string;
    role: string;
    status: string;
    isAssigned: boolean;
  };
  planId: string;
  plan: {
    id: string;
    name: string;
    description: string;
    extra: string;
    createdBy: string;
    isPublic: false;
    skills: {
      id: string;
      planId: string;
      skill: Skill;
    }[];
    assignments: Assignment[];
  };
  startDate: string;
  endDate: string;
  status: string;
};

export type InternAssignmentStats = {
  total: number;
  todo: number;
  inProgress: number;
  submitted: number;
  reviewed: number;
};

export type InternInfoAll = {
  internInformation: InternInfoDetail;
  countAssignments: InternAssignmentStats;
};
