"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Assignment, AssignmentStatus } from "@/types/trainingPlan.type";
import AssignmentCard from "./AssignmentCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getStatusColor } from "@/lib/helper";
import { Separator } from "@/components/ui/separator";

interface Props {
  id: AssignmentStatus;
  title: string;
  assignments: Assignment[];
  role: string;
  onView?: (assignment: Assignment) => void;
  onDelete?: (id: string) => void;
}

export default function DroppableColumn({
  id,
  title,
  assignments,
  role,
  onView,
  onDelete
}: Props) {
  const { setNodeRef } = useDroppable({
    id,
    data: { column: id }
  });

  const [animateRef] = useAutoAnimate();

  return (
    <div
      ref={setNodeRef}
      className={`bg-muted/50 border rounded-md p-3 min-h-[730px] flex flex-col space-y-2 bg-white`}
    >
      <h2
        className={`text-base font-semibold capitalize mb-1 text-center rounded-md ${getStatusColor(
          title as AssignmentStatus
        )}`}
      >
        {title} ({assignments?.length || 0})
      </h2>
      <Separator />
      <SortableContext
        items={(assignments ?? []).map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={animateRef} className="flex flex-col space-y-3">
          {(assignments ?? []).map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              role={role}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
