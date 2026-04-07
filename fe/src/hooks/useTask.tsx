import { buildPagingUrlQuery } from "@/lib/helper";
import { useCustomSWR } from "@/lib/swr/useCustomSWR";
import { taskServices } from "@/services/task.services";
import { PayloadGet } from "@/types/common.type";
import { Task } from "@/types/task.type";

export const useGetTaskUser = () => {
  return useCustomSWR<Task[]>(
    "/tasks",
    async () => (await taskServices.getTaskUser()).data?.tasks ?? []
  );
};

export const useGetTaskUserByPagination = (
  payload: PayloadGet<Record<string, never>>
) => {
  const urlPayload = buildPagingUrlQuery(payload);
  return useCustomSWR(`/tasks${urlPayload}`, () =>
    taskServices.getTaskUserByPagination(payload)
  );
};

export const useGetTaskAllByPagination = (
  payload: PayloadGet<Record<string, never>>
) => {
  const urlPayload = buildPagingUrlQuery(payload);
  return useCustomSWR(`/tasks/all${urlPayload}`, () =>
    taskServices.getTaskAllByPagination(payload)
  );
};

export const useGetTaskAll = () => {
  return useCustomSWR<Task[]>(
    "/tasks/all",
    async () => (await taskServices.getTaskAll()).data?.tasks ?? []
  );
};
export const useGetTaskById = (id: string) => {
  return useCustomSWR<Task>(`/tasks/${id}`);
};
