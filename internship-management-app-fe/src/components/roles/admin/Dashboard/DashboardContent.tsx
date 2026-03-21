"use client";

import React from "react";
import { PageHeader } from "@/components/HeaderContent";
import { Card } from "@/components/ui/card";
import DashboardStatsCard from "@/components/roles/admin/Dashboard/DashboardStatsCard";
import { ShieldUser } from "lucide-react";

import { useGetInternsDataDashboard } from "@/hooks/useDashboard";
import { DashboardSkeleton } from "@/components/common/Skeleton";
import { InternAnalytics } from "@/components/roles/admin/Dashboard/InternAnalytics,";

export default function DashboardContent() {
  const { data: internsData, isLoading } = useGetInternsDataDashboard();

  if (isLoading) {
    return (
      <div className="relative">
        <PageHeader
          title="Welcome back, Admin!"
          description="Overview of system activity and stats."
          icon={<ShieldUser className="w-5 h-5" />}
        />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="relative">
      <PageHeader
        title="Welcome back, Admin!"
        description="Overview of system activity and stats."
        icon={<ShieldUser className="w-5 h-5" />}
      />

      <div className="space-y-6 py-4 px-4 md:px-20">
        <DashboardStatsCard
          totalInterns={internsData?.internsCount.total ?? 0}
          totalCompleted={internsData?.internsCount.completed ?? 0}
          totalInProgress={internsData?.internsCount.inProgress ?? 0}
          totalOnboarding={internsData?.internsCount.onboarding ?? 0}
          totalField={internsData?.internsCount.totalFields ?? 0}
        />

        <Card className="p-5 rounded-xl border border-slate-200/80 shadow-sm bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <h2 className="card-section-title mb-4">
            Intern Analytics
          </h2>
          {internsData ? (
            <InternAnalytics internsData={internsData} />
          ) : null}
        </Card>
      </div>
    </div>
  );
}
