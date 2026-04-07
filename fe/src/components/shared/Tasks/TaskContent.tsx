"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ListChecks } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { PageHeader } from "@/components/HeaderContent";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { TableSkeleton } from "@/components/common/Skeleton";
import { Task, TaskRequestPayload } from "@/types/task.type";
import {
  useGetTaskAllByPagination,
  useGetTaskUserByPagination
} from "@/hooks/useTask";
import { taskServices } from "@/services/task.services";

import { TaskForm } from "./TaskForm";
import { useToastMessage } from "@/hooks/useToastMessage";
import { TaskTable } from "@/components/shared/Tasks/TaskTable";

export default function TasksContent() {
  const { userDetails } = useAuthStore();
  const { showToastSuccess, showToastError } = useToastMessage();

  const [searchTaskName, setSearchTaskName] = useState("");
  const [debouncedSearchTaskName, setDebouncedSearchTaskName] = useState("");
  const [paginationTask, setPaginationTask] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  const allHookResult = useGetTaskAllByPagination({
    page: paginationTask.pageIndex + 1,
    limit: paginationTask.pageSize,
    search: debouncedSearchTaskName
  });

  const userHookResult = useGetTaskUserByPagination({
    page: paginationTask.pageIndex + 1,
    limit: paginationTask.pageSize,
    search: debouncedSearchTaskName
  });

  const isAdmin = userDetails?.role === "admin";
  const source = isAdmin ? allHookResult : userHookResult;

  const tasks: Task[] = source.data?.data?.tasks || [];
  const taskPagination = source.data?.data?.pagination;
  const isTaskLoading = source.isLoading;
  const mutateTask = source.mutate;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedSearchTaskName(searchTaskName);
      setPaginationTask((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(timeOut);
  }, [searchTaskName]);

  const methodsTask = useForm<TaskRequestPayload>({
    defaultValues: { name: "", description: "" }
  });

  const [dialogTask, setDialogTask] = useState<{
    open: boolean;
    mode: "add" | "edit";
    entity: Task | null;
  }>({ open: false, mode: "add", entity: null });

  const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);

  const openTaskDialog = (mode: "add" | "edit", entity: Task | null = null) => {
    if (mode === "edit" && entity) {
      methodsTask.setValue("name", entity.name);
      methodsTask.setValue("description", entity.description ?? "");
    } else {
      methodsTask.reset();
    }
    setDialogTask({ open: true, mode, entity });
  };

  const submitTask = async (payload: TaskRequestPayload) => {
    try {
      if (dialogTask.mode === "edit" && dialogTask.entity) {
        await taskServices.updateTask(dialogTask.entity.id, payload);
        showToastSuccess("Task updated successfully!");
      } else {
        await taskServices.createTask(payload);
        showToastSuccess("Task created successfully!");
      }
      await mutateTask();
      setDialogTask({ open: false, mode: "add", entity: null });
    } catch (error) {
      console.error("Failed to submit task:", error);
      showToastError("Failed to submit task");
    }
  };

  const deleteTask = async () => {
    if (confirmDeleteTask) {
      try {
        await taskServices.deleteTask(confirmDeleteTask.id);
        await mutateTask();
        showToastSuccess("Task deleted successfully!");
      } catch (error) {
        console.error("Failed to delete task:", error);
        showToastError("Failed to delete task");
      }
    }
    setConfirmDeleteTask(null);
  };

  if (isTaskLoading && !source.data) {
    return (
      <>
        <PageHeader
          title="Tasks Management"
          description="Manage all tasks"
          icon={<ListChecks className="w-5 h-5" />}
        />
        <div className="py-4 px-4 sm:px-24">
          <TableSkeleton rows={5} cols={4} showToolbar />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Tasks Management"
        description="Manage all tasks"
        icon={<ListChecks className="w-5 h-5" />}
      />
      <div className="py-4 px-4 sm:px-24">
        <Card className="p-5 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="card-section-title mb-4">
            Tasks List
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTaskName}
                onChange={(e) => setSearchTaskName(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 search-input-enhanced"
              />
            </div>
            <Button onClick={() => openTaskDialog("add")} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-sm rounded-lg">
              <Plus size={16} className="w-4 h-4 mr-1" /> Add Task
            </Button>
          </div>
          <TaskTable
            isLoading={isTaskLoading}
            paginatedItems={tasks}
            paginationPageSize={paginationTask.pageSize}
            onEdit={(task) => openTaskDialog("edit", task)}
            onDelete={(task) => setConfirmDeleteTask(task)}
          />

          <Pagination
            pageIndex={paginationTask.pageIndex}
            pageCount={taskPagination?.totalPages ?? 1}
            pageSize={paginationTask.pageSize}
            onPageChange={(i) =>
              setPaginationTask((prev) => ({ ...prev, pageIndex: i }))
            }
            onPageSizeChange={(size) =>
              setPaginationTask({ pageIndex: 0, pageSize: size })
            }
          />
        </Card>

        <FormProvider {...methodsTask}>
          <TaskForm
            isOpen={dialogTask.open}
            onClose={() =>
              setDialogTask({ open: false, mode: "add", entity: null })
            }
            title={dialogTask.mode === "edit" ? "Edit Task" : "Add Task"}
            description={
              dialogTask.mode === "edit"
                ? "Update task information"
                : "Add a new task"
            }
            isEditing={dialogTask.mode === "edit"}
            onSubmit={submitTask}
          />
        </FormProvider>
        <ConfirmDialog
          isOpen={!!confirmDeleteTask}
          title="Confirm Delete"
          description={`Are you sure you want to delete "${confirmDeleteTask?.name}"?`}
          onCancel={() => setConfirmDeleteTask(null)}
          onConfirm={deleteTask}
        />
      </div>
    </>
  );
}
