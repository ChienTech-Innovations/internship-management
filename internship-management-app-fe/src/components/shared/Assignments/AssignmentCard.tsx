"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Assignment } from "@/types/trainingPlan.type";
import { getStatusColor } from "@/lib/helper";

import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { Clock, Eye, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Props {
  assignment: Assignment;
  role: string;
  onView?: (assignment: Assignment) => void;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({
  assignment,
  role,
  onView,
  onDelete
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: assignment.id,
    data: { status: assignment.status }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "default"
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="rounded-xl border bg-background p-3 shadow hover:shadow-md transition min-h-[130px] flex gap-2 flex-col"
      >
       <div className="flex items-center justify-between">
         <div className="w-full space-y-2 cursor-pointer" {...listeners}>
          
          {/* STATUS */}
          <Badge
            variant="outline"
            className={`text-xs capitalize w-fit ${getStatusColor(
              assignment.status
            )}`}
          >
            {assignment.status}
          </Badge>
        </div>

        {/* ACTION MENU */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onView?.(assignment)}>
                <Eye className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>

              {role === "mentor" && (
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-600"
                  onSelect={() => setConfirmDelete(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
       </div>

        <div>
          {/* TITLE */}
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <h3 className="font-semibold line-clamp-1 text-sm">
                  {assignment.task.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent>{assignment.task.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* DESCRIPTION */}
          <p className="text-xs text-muted-foreground line-clamp-1">
            {assignment.task.description ?? "No description provided"}
          </p>

          {/* SKILLS */}
          {assignment.skills.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {assignment.skills.length} skills
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px]">
                  <div className="flex flex-wrap gap-1">
                    {assignment.skills.map((s) => (
                      <Badge key={s.id} variant="secondary" className="bg-blue-100 text-blue-700">
                        {s.skill.name}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* META */}
          <div className="text-xs text-muted-foreground space-y-1">
            {role === "mentor" ? (
              <div>
                Assigned to:{" "}
                <span className="font-medium text-foreground">
                  {assignment?.assignee?.fullName ?? assignment.assignedTo}
                </span>
              </div>
            ) : (
              <div>
                Created by:{" "}
                <span className="font-medium text-foreground">
                  {assignment.creator?.fullName}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock size={14} />
              {assignment.estimatedTime} hours
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={confirmDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete "${assignment.task.name}"?`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          onDelete?.(assignment.id);
          setConfirmDelete(false);
        }}
      />
    </>
  );
}