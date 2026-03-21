import { useCustomSWR } from "@/lib/swr/useCustomSWR";
import { assignmentServices } from "@/services/assignment.services";
import { Assignment } from "@/types/trainingPlan.type";

export const useGetAssigmentAll = (params?: {
  status?: string;
  isAssigned: boolean;
}) => {
  const query = new URLSearchParams();

  if (params?.status) query.append("status", params.status);
  if (params?.isAssigned !== undefined)
    query.append("isAssigned", String(params.isAssigned));

  const url = `/assignments${query.toString() ? `?${query.toString()}` : ""}`;
  return useCustomSWR<Assignment[]>(
    url,
    async () => (await assignmentServices.getAssigmentAll(params)).data ?? []
  );
};

export const useGetAssignmentById = (id: string) => {
  return useCustomSWR(`/assignments/${id}`);
};
