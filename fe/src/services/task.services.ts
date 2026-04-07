import { buildPagingUrlQuery } from "@/lib/helper";
import { del, get, post, put } from "@/services/api.services";
import { PayloadGet } from "@/types/common.type";
import { Task, TaskRequestPayload, TasksListResponse } from "@/types/task.type";

export const taskServices = {
  getTaskUser: () => {
    return get<TasksListResponse>("/tasks");
  },
  getTaskUserByPagination: (payload: PayloadGet<Record<string, never>>) => {
    const urlPayload = buildPagingUrlQuery(payload);
    return get<TasksListResponse>(`/tasks${urlPayload}`);
  },
  getTaskAll: () => {
    return get<TasksListResponse>("/tasks/all");
  },
  getTaskAllByPagination: (payload: PayloadGet<Record<string, never>>) => {
    const urlPayload = buildPagingUrlQuery(payload);
    return get<TasksListResponse>(`/tasks/all${urlPayload}`);
  },
  getTaskById: (id: string) => {
    return get<Task>(`/tasks/${id}`);
  },
  createTask: (payload: TaskRequestPayload) => {
    return post<Task>("/tasks", payload);
  },
  updateTask: (id: string, payload: TaskRequestPayload) => {
    return put(`/tasks/${id}`, payload);
  },
  deleteTask: (id: string) => {
    return del(`/tasks/${id}/soft-delete`);
  },
  restoreTask: (id: string) => {
    return put(`task/${id}/restore`);
  }
};
