"use client";

import React, { useState } from "react";
import { UserCheck } from "lucide-react";
import { PageHeader } from "@/components/HeaderContent";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetInfoMentorDashboard } from "@/hooks/useDashboard";
import DashboardStatsCard from "@/components/roles/mentor/Dashboard/DashboardStatsCard";
import { useGetAssigmentAll } from "@/hooks/useAssignment";
import { AssignmentDetailModal } from "@/components/shared/TrainingPlans/AssignmentDetail/AssignmentDetailModal";
import { Assignment } from "@/types/trainingPlan.type";
import { assignmentServices } from "@/services/assignment.services";
import { DashboardSkeleton, DashboardStatsOnlySkeleton } from "@/components/common/Skeleton";
import AssignmentAwaitingReview from "@/components/roles/mentor/Dashboard/AssignmentAwaitingReview";
import ListIntern from "@/components/roles/mentor/Dashboard/ListIntern";

export default function DashboardContent() {
  const { userDetails } = useAuthStore();
  const { data, isLoading } = useGetInfoMentorDashboard(
    userDetails?.role === "mentor"
  );
  const { data: assignmentsWait, isLoading: isLoadingWait } =
    useGetAssigmentAll({
      status: "Submitted",
      isAssigned: true
    });
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const handleView = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setDetailOpen(true);
  };

  const isLoadingAny = isLoading || isLoadingWait;

  if (isLoadingAny) {
    return (
      <>
        <PageHeader
          title={`Welcome back, ${userDetails?.name}!`}
          description="Here's an overview of your interns' progress."
          icon={<UserCheck className="w-5 h-5 " />}
        />
        <div className="space-y-6 py-4 px-4 sm:px-20">
          <DashboardStatsOnlySkeleton />
          <div className="flex flex-col sm:flex-row gap-4">
            <DashboardSkeleton />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${userDetails?.name}!`}
        description="Here's an overview of your interns' progress."
        icon={<UserCheck className="w-5 h-5 " />}
      />
      <div className="space-y-6 py-4 px-4 sm:px-20">
        {/* Stat cards */}
        {data ? (
          <DashboardStatsCard
            totalInterns={data?.internsOfUserCount?.total ?? 0}
            totalCompleted={data?.internsOfUserCount?.completed ?? 0}
            totalInProgress={data?.internsOfUserCount?.inProgress ?? 0}
            totalOnboarding={data?.internsOfUserCount?.onboarding ?? 0}
          />
        ) : (
          <DashboardStatsCard
            totalInterns={0}
            totalCompleted={0}
            totalInProgress={0}
            totalOnboarding={0}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Assignment Awaiting Review */}
          <AssignmentAwaitingReview
            assignmentsWait={assignmentsWait ?? []}
            handleView={handleView}
          />
          {/* List Intern */}
          <ListIntern data={data ?? undefined} />
        </div>
        <AssignmentDetailModal
          assignment={selectedAssignment}
          role={userDetails?.role ?? ""}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onFeedbackSubmit={async (feedback) => {
            if (!selectedAssignment) return;
            try {
              await assignmentServices.assignmentReview(selectedAssignment.id, {
                feedback
              });
              setSelectedAssignment((prev) =>
                prev ? { ...prev, feedback } : prev
              );
            } catch (error) {
              console.error("Review failed", error);
            }
          }}
        />
      </div>
    </>
  );
}
