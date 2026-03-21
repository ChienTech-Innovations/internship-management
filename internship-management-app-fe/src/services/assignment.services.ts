import { del, get, post, put } from "@/services/api.services";
import {
  Assignment,
  AssignmentRequestPayload,
  AssignmentStatus
} from "@/types/trainingPlan.type";

export const assignmentServices = {
  getAssigmentAll: (params?: { status?: string; isAssigned: boolean }) => {
    const query = new URLSearchParams();

    if (params?.status) query.append("status", params.status);
    if (params?.isAssigned !== undefined)
      query.append("isAssigned", String(params.isAssigned));

    const url = `/assignments${query.toString() ? `?${query.toString()}` : ""}`;
    return get<Assignment[]>(url);
  },
  getAssignmentById: (id: string) => {
    return get<Assignment>(`/assignments/${id}`);
  },
  createAssignment: (payload: AssignmentRequestPayload) => {
    return post("/assignments", payload);
  },
  updateAssignment: (
    id: string,
    payload: Partial<AssignmentRequestPayload>
  ) => {
    return put(`/assignments/${id}`, payload);
  },
  updateAssignmentStatus: (
    id: string,
    payload: { status: AssignmentStatus }
  ) => {
    return put(`/assignments/${id}/status`, payload);
  },
  assignmentSubmit: (id: string, payload: { submittedLink: string }) => {
    return put(`/assignments/${id}/submit`, payload);
  },
  assignmentReview: (id: string, payload: { feedback: string }) => {
    return put(`/assignments/${id}/review`, payload);
  },
  deleteAssignment: (id: string) => {
    return del(`/assignments/${id}`);
  }
};
