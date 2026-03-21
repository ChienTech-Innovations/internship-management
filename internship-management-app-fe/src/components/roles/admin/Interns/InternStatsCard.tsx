"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { UserRoundCheck, UserRoundMinus, Users } from "lucide-react";

type Props = {
  totalInterns: number;
  assignedInterns: number;
  unassignedInterns: number;
};

export const InternStatsCard: React.FC<Props> = ({
  totalInterns,
  assignedInterns,
  unassignedInterns
}) => {
  const stats = [
    {
      icon: Users,
      title: "Total Interns",
      count: totalInterns,
      description: "All interns",
      color: "blue" as const
    },
    {
      icon: UserRoundCheck,
      title: "Assigned",
      count: assignedInterns,
      description: "Assigned to mentor",
      color: "emerald" as const
    },
    {
      icon: UserRoundMinus,
      title: "Unassigned",
      count: unassignedInterns,
      description: "Not assigned yet",
      color: "orange" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((s, index) => (
        <StatsCard
          key={index}
          title={s.title}
          count={s.count}
          description={s.description}
          icon={<s.icon className="w-5 h-5" />}
          color={s.color}
        />
      ))}
    </div>
  );
};
