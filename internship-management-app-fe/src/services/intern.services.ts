import { get, put } from "@/services/api.services";
import {
  InternInfoAll,
  InternInfoDetail,
  InternInfoRequestPayload
} from "@/types/intern.type";
import { AssignmentStatus } from "@/types/trainingPlan.type";

export const internServices = {
  getInternAll: () => {
    return get("/interns-information");
  },
  getInternById: (id: string) => {
    return get(`/interns-information/${id}`);
  },
  getInternInfoAll: () => {
    return get<InternInfoAll>("/interns-information/interns");
  },
  getInternInfoAllById: (id: string) => {
    return get<InternInfoDetail>(`/interns-information/interns/${id}`);
  },
  updateIntern: (id: string, payload: InternInfoRequestPayload) => {
    return put(`/interns-information/${id}`, payload);
  },
  updateInternStatus: (id: string, payload: { status: AssignmentStatus }) => {
    return put(`/interns-information/${id}/status`, payload);
  },
  updateInternPlan: (id: string, payload: InternInfoRequestPayload) => {
    return put(`/interns-information/${id}/plan`, payload);
  }
};
