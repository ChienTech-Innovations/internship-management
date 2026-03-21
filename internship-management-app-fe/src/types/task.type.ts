export type Task = {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
};

export type TaskRequestPayload = {
  name: string;
  description: string;
};

export type TasksListResponse = {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};
