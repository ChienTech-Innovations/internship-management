"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { UserRoundCheck, UserRoundMinus, Users } from "lucide-react";

type Props = {
  totalMentor: number;
  totalAssigned: number;
  totalUnssigned: number;
};

export const MentorStatsCard: React.FC<Props> = ({
  totalMentor,
  totalAssigned,
  totalUnssigned
}: Props) => {
  const stats = [
    {
      icon: Users,
      title: "Total Mentors",
      count: totalMentor,
      description: "All mentors",
      color: "blue" as const
    },
    {
      icon: UserRoundCheck,
      title: "Assigned",
      count: totalAssigned,
      description: "With interns",
      color: "emerald" as const
    },
    {
      icon: UserRoundMinus,
      title: "Unassigned",
      count: totalUnssigned,
      description: "Without interns",
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
