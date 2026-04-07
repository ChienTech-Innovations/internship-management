"use client";

import { useGetInternInfoAllById } from "@/hooks/useIntern";
import React, { useEffect, useState } from "react";
import { InternInfoDetail } from "@/types/intern.type";
import { Assignment } from "@/types/trainingPlan.type";
import FooterSection from "@/components/Export/Footer";
import ProgressOverviewSection from "@/components/Export/ProgressOverviewSection";
import MentorInfoSection from "@/components/Export/MentorInfoSection";
import InternInfoSection from "@/components/Export/InternInfoSection";
import HeaderSection from "@/components/Export/Header";
import TrainingPlanSection from "@/components/Export/TrainingPlanSection";
import AssignmentDetailsSection from "@/components/Export/AssignmentDetailsSection";

const ExportPDF = ({ internId }: { internId: string }) => {
  const { data } = useGetInternInfoAllById(internId);
  const infoInternExport = data?.data as InternInfoDetail | undefined;
  const [progressCounts, setProgressCounts] = useState({
    todo: 0,
    inprogress: 0,
    submitted: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    if (infoInternExport?.plan?.assignments) {
      const counts = infoInternExport.plan.assignments.reduce(
        (
          acc: {
            todo: number;
            inprogress: number;
            submitted: number;
            completed: number;
            total: number;
          },
          assignment: Assignment
        ) => {
          acc.total += 1;
          switch (assignment.status) {
            case "Todo":
              acc.todo += 1;
              break;
            case "InProgress":
              acc.inprogress += 1;
              break;
            case "Submitted":
              acc.submitted += 1;
              break;
            case "Reviewed":
              acc.completed += 1;
              break;
          }
          return acc;
        },
        {
          todo: 0,
          inprogress: 0,
          submitted: 0,
          completed: 0,
          total: 0
        }
      );
      setProgressCounts(counts);
    }
  }, [infoInternExport]);

  return (
    <div className="w-[60vw] text-center m-auto my-5 space-y-8">
      <HeaderSection />
      <InternInfoSection infoInternExport={infoInternExport} />
      <MentorInfoSection infoInternExport={infoInternExport} />
      <ProgressOverviewSection progressCounts={progressCounts} />
      <TrainingPlanSection infoInternExport={infoInternExport} />
      <AssignmentDetailsSection infoInternExport={infoInternExport} />
      <FooterSection />
    </div>
  );
};

export default ExportPDF;
