/* eslint-disable @typescript-eslint/no-explicit-any */
export type NotificationType =
  | "TRAINING_PLAN_ASSIGNED"
  | "ASSIGNMENT_REVIEWED"
  | "ASSIGNMENT_FEEDBACK"
  | "ASSIGNMENT_SUBMITTED"
  | "ATTENDANCE_REGISTERED";

export type Notification = {
  id: string;
  recipientId: string;
  senderId: string;
  sender?: {
    id: string;
    fullName: string;
  };
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
};
