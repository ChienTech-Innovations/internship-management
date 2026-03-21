import { InternStatus } from "@/types/intern.type";

export interface InternsCount {
  total: number;
  totalFields: number;
  completed: number;
  inProgress: number;
  onboarding: number;
}

export interface MonthlyInternsCount {
  month: string;
  count: number;
}

export interface StatusInternsCount {
  status: string;
  count: number;
}

export interface FieldInternsCount {
  field: string;
  count: number;
}

export interface MentorInternsCount {
  mentorName: string;
  count: number;
}

export type InternsData = {
  internsCount: InternsCount;
  monthlyInternsCount: MonthlyInternsCount[];
  statusInternsCount: StatusInternsCount[];
  fieldInternsCount: FieldInternsCount[];
  mentorInternsCount: MentorInternsCount[];
};

//  Mentor Dashboard

export type Intern = {
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

export type MyIntern = {
  id: string;
  field: string;
  internId: string;
  intern: Intern;
  mentorId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: InternStatus;
};

export type InternsOfUserCount = {
  total: number;
  completed: number;
  inProgress: number;
  onboarding: number;
};

export type MyInternsResponse = {
  myInterns: MyIntern[];
  internsOfUserCount: InternsOfUserCount;
};
