"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useState, useEffect } from "react";
import { Assignment } from "@/types/trainingPlan.type";
import { getStatusColor } from "@/lib/helper";

interface AssignmentDetailModalProps {
  assignment: Assignment | null;
  role: string;
  open: boolean;
  onClose: () => void;
  onFeedbackSubmit?: (feedback: string) => void;
  onLinkSubmit?: (link: string) => void;
}

export function AssignmentDetailModal({
  assignment,
  role,
  open,
  onClose,
  onFeedbackSubmit,
  onLinkSubmit
}: AssignmentDetailModalProps) {
  const [localFeedback, setLocalFeedback] = useState("");
  const [localLink, setLocalLink] = useState("");

  useEffect(() => {
    setLocalFeedback(assignment?.feedback || "");
    setLocalLink(assignment?.submittedLink || "");
  }, [assignment, open]);

  if (!assignment) return null;

  const canSendFeedback = role === "mentor" || role === "admin";

  const handleSave = () => {
    if (canSendFeedback) onFeedbackSubmit?.(localFeedback);
    else onLinkSubmit?.(localLink);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        {/* HEADER */}
        <DialogHeader className="space-y-3 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold leading-snug">
                {assignment.task.name}
              </DialogTitle>

              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <span>Estimated: {assignment.estimatedTime}h</span>
              </div>
            </div>

            <Badge className={`capitalize ${getStatusColor(assignment.status)}`}>
              {assignment.status}
            </Badge>
          </div>
        </DialogHeader>

        {/* DESCRIPTION */}
        <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
          {assignment.task.description || "No description provided"}
        </div>

        {/* META GRID */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-1">Skills</p>
            <div className="flex flex-wrap gap-1">
              {assignment.skills?.length > 0 ? (
                assignment.skills.map((s) => (
                  <Badge key={s.id} variant="secondary">
                    {s.skill.name}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-xs mb-1">
              {role === "mentor" ? "Assigned to" : "Created by"}
            </p>
            <p className="font-medium">
              {role === "mentor"
                ? assignment?.assignee?.fullName ?? assignment.assignedTo
                : assignment.creator?.fullName}
            </p>
          </div>
        </div>

        {/* LINK PREVIEW */}
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground text-xs">Submission</p>
          {assignment.submittedLink ? (
            <a
              href={assignment.submittedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-md p-3 hover:bg-muted transition break-all text-blue-600"
            >
              {assignment.submittedLink}
            </a>
          ) : (
            <div className="text-muted-foreground italic">No submission yet</div>
          )}
        </div>

        <Separator />

        {/* ACTION PANEL */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-3"
        >
          <p className="font-medium">
            {canSendFeedback ? "Give Feedback" : "Submit Assignment"}
          </p>

          <textarea
            className="w-full min-h-[90px] rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={canSendFeedback ? localFeedback : localLink}
            onChange={(e) =>
              canSendFeedback
                ? setLocalFeedback(e.target.value)
                : setLocalLink(e.target.value)
            }
            placeholder={
              canSendFeedback
                ? "Write feedback for intern..."
                : "Paste your submission link..."
            }
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}