import { del, get, post, put, getBlob } from "@/services/api.services";
import {
  TrainingPlan,
  TrainingPlanRequestPayload
} from "@/types/trainingPlan.type";
import { TrainingPlanAssigned } from "@/types/user.type";

export const trainingPlanServices = {
  getTrainingPlanUser: () => {
    return get<TrainingPlan>("/training-plans");
  },
  getTrainingPlanAll: () => {
    return get<TrainingPlan>("/training-plans/all");
  },
  getTrainingPlanById: (id: string) => {
    return get<TrainingPlan>(`/training-plans/${id}`);
  },
  getTrainingPlanWithInterns: () => {
    return get<TrainingPlanAssigned[]>("/training-plans/with-interns");
  },
  getTrainingPlanExport: (internId: string, link: string) => {
    return get<Blob>(`/training-plans/${internId}/export?${link}`);
  },
  downloadTrainingPlanExport: async (internId: string, link: string) => {
    return await getBlob(`/training-plans/${internId}/export?${link}`);
  },
  createTrainingPlan: (payload: TrainingPlanRequestPayload) => {
    return post("/training-plans", payload);
  },
  updateTrainingPlan: (id: string, payload: TrainingPlanRequestPayload) => {
    return put(`/training-plans/${id}`, payload);
  },
  trainingPlanAssign: (id: string, internId: string) => {
    return put(`/training-plans/${id}/assign`, { internId });
  },
  deleteTrainingPlan: (id: string) => {
    return del(`/training-plans/${id}`);
  }
};
