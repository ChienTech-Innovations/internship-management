import { useCustomSWR } from "@/lib/swr/useCustomSWR";
import { TrainingPlanAssigned } from "@/types/user.type";
import { trainingPlanServices } from "@/services/trainingPlan.services";

export const useGetTrainingPlanUser = () => {
  return useCustomSWR(`/training-plans`, () =>
    trainingPlanServices.getTrainingPlanUser()
  );
};
export const useGetTrainingPlanAll = () => {
  return useCustomSWR(`/training-plans/all`, () =>
    trainingPlanServices.getTrainingPlanAll()
  );
};
export const useGetTrainingPlanById = (id: string) => {
  return useCustomSWR(`/training-plans/${id}`, () =>
    trainingPlanServices.getTrainingPlanById(id)
  );
};
export const useGetTrainingPlanWithInterns = () => {
  return useCustomSWR<TrainingPlanAssigned[]>("/training-plans/with-interns");
};

export const downloadTrainingPlanExport = async (
  internId: string,
  link: string
): Promise<Blob> => {
  return await trainingPlanServices.downloadTrainingPlanExport(internId, link);
};
